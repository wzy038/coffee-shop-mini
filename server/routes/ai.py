"""
AI 饮品定制推荐路由
根据用户输入的口味需求文本，智能匹配饮品标签，生成个性化推荐和搭配方案
所有接口前缀：/api/ai
"""
import logging
from flask import Blueprint, request

from models import db, Product, DrinkTag
from utils.response import success_response, error_response

ai_bp = Blueprint("ai", __name__)
logger = logging.getLogger(__name__)


SWEETNESS_LEVELS = ["无糖", "三分糖", "五分糖", "七分糖", "全糖"]
ICE_LEVELS = ["热饮", "少冰", "去冰", "正常冰", "多冰"]


SCENE_KEYWORDS = {
    "冬天": {"sweetness": "七分糖", "ice": "热饮", "reason": "冬日暖饮，温暖身心"},
    "夏天": {"sweetness": "三分糖", "ice": "多冰", "reason": "夏日冰爽，消暑解热"},
    "冬天暖": {"sweetness": "五分糖", "ice": "热饮", "reason": "温暖醇厚，适合寒冷天气"},
    "夏天冰": {"sweetness": "三分糖", "ice": "多冰", "reason": "冰爽解渴，夏日必备"},
}


SEMANTIC_MAPPING = {
    "减肥": ["低咖啡因", "无糖", "清爽", "低糖", "少糖", "低热量"],
    "减脂": ["低咖啡因", "无糖", "清爽", "低糖", "少糖", "低热量"],
    "健身": ["低咖啡因", "无糖", "清爽", "低糖", "少糖"],
    "低糖": ["无糖", "少糖", "三分糖"],
    "控糖": ["无糖", "少糖", "三分糖"],
    "孕妇": ["低咖啡因", "无糖", "暖饮"],
    "失眠": ["低咖啡因", "无糖", "热饮"],
    "熬夜": ["提神", "冰爽", "清爽"],
    "加班": ["提神", "浓郁", "冰爽"],
    "下午茶": ["甜点搭配", "顺滑", "甜", "焦糖"],
    "约会": ["花香", "颜值", "创意特调", "浪漫"],
    "拍照": ["颜值", "创意特调", "蓝色", "粉色"],
    "聚会": ["果味", "气泡", "甜", "创意"],
    "早餐": ["提神", "浓郁", "暖饮"],
    "夜宵": ["低咖啡因", "热饮", "顺滑"],
    "感冒": ["暖饮", "热饮", "养生"],
    "上火": ["清爽", "解腻", "绿茶", "果茶"],
    "油腻": ["清爽", "解腻", "气泡", "柠檬"],
    "晕车": ["清爽", "柠檬", "薄荷", "少糖"],
    "犯困": ["提神", "浓郁", "冰爽"],
    "夏天": ["冰爽", "清爽", "气泡", "果味"],
    "冬天": ["暖饮", "热饮", "浓郁", "顺滑"],
    "秋天": ["桂花", "顺滑", "焦糖"],
    "春天": ["花香", "清新", "果味"],
    "网红": ["创意特调", "颜值", "打卡"],
    "经典": ["经典", "传统", "浓郁"],
    "猎奇": ["创意特调", "小众", "特别"],
}


PRODUCT_CATEGORY_MAP = {
    "美式": ["吃杯美式", "果C美式"],
    "拿铁": ["养生拿铁", "风味拿铁", "生椰家族", "小黄油系列"],
    "果茶": ["果茶"],
    "甜品": ["甜品简餐"],
    "特调": ["吃杯特调", "SOE小黑杯", "大师咖啡"],
}


def _expand_query(user_text):
    """
    语义扩展：将用户的自然语言需求扩展为标签关键词
    例如："我最近减肥" → ["减肥", "低咖啡因", "无糖", "清爽", "低糖", "少糖", "低热量"]
    """
    expanded = [user_text]

    for kw, synonyms in SEMANTIC_MAPPING.items():
        if kw in user_text:
            expanded.extend(synonyms)

    return list(set(expanded))


def _match_tags(user_text, tags):
    """
    根据用户输入文本匹配饮品标签（支持语义扩展）
    返回按匹配分数排序的商品列表
    """
    matched_products = {}
    expanded_queries = _expand_query(user_text)

    for tag in tags:
        if not tag.is_active or not tag.product:
            continue

        keywords = [k.strip() for k in (tag.keywords or "").split(",") if k.strip()]
        keywords.append(tag.name)

        matched = False
        for query in expanded_queries:
            for kw in keywords:
                if kw and kw in query:
                    matched = True
                    break
            if matched:
                break

        if matched:
            pid = tag.product_id
            score = tag.weight * 10

            if pid not in matched_products:
                matched_products[pid] = {
                    "score": score,
                    "product": tag.product,
                    "matched_tags": [tag.name],
                }
            else:
                matched_products[pid]["score"] += score
                if tag.name not in matched_products[pid]["matched_tags"]:
                    matched_products[pid]["matched_tags"].append(tag.name)

    sorted_list = sorted(matched_products.values(), key=lambda x: x["score"], reverse=True)
    return sorted_list


def _find_pairing(product, all_products, avoid_product_ids=None):
    """
    为饮品推荐搭配的甜品或小食
    根据商品名称和分类推荐合适的搭配
    """
    if avoid_product_ids is None:
        avoid_product_ids = set()

    avoid_product_ids.add(product.id)

    pairing_keywords = []
    product_name = product.name

    if "美式" in product_name or "咖啡" in product_name:
        pairing_keywords = ["提拉米苏", "华夫饼", "酸奶", "三明治", "蛋糕"]
    elif "拿铁" in product_name:
        pairing_keywords = ["提拉米苏", "华夫饼", "酸奶", "三明治"]
    elif "果茶" in product_name or "气泡" in product_name:
        pairing_keywords = ["三明治", "华夫饼", "蛋糕"]

    candidates = []
    for p in all_products:
        if p.id in avoid_product_ids:
            continue
        if p.category and p.category.name in ["甜品简餐"]:
            candidates.append(p)

    if candidates:
        for kw in pairing_keywords:
            for p in candidates:
                if kw in p.name:
                    return p

        return candidates[0]

    return None


def _generate_recommendation(product, matched_tags, user_text, all_products, pairing_product=None):
    """
    根据商品和匹配标签生成个性化推荐文案和搭配方案
    """
    sweetness = "五分糖"
    ice = "少冰"
    reason = "经典搭配，值得一试"

    for scene_kw, config in SCENE_KEYWORDS.items():
        if scene_kw in user_text:
            sweetness = config["sweetness"]
            ice = config["ice"]
            reason = config["reason"]
            break

    if "少糖" in user_text or "低糖" in user_text or "无糖" in user_text:
        sweetness = "无糖" if "无糖" in user_text else "三分糖"
    if "多糖" in user_text or "全糖" in user_text:
        sweetness = "全糖"
    if "热" in user_text or "暖" in user_text:
        ice = "热饮"
    if "冰" in user_text or "冷" in user_text:
        ice = "多冰"

    if any("低咖啡因" in t or "脱因" in t for t in matched_tags):
        reason = "低咖啡因选择，适合对咖啡因敏感的你"
    elif "清爽" in matched_tags or "冰爽" in matched_tags:
        reason = "清爽口感，适合想要解渴的时刻"
    elif "浓郁" in matched_tags:
        reason = "醇厚浓郁，适合喜欢深度口感的你"
    elif "养生" in matched_tags:
        reason = "养生配方，温暖呵护你的健康"
    elif "椰香" in matched_tags:
        reason = "清新椰香，带来热带风情"
    elif "花香" in matched_tags:
        reason = "花香四溢，浪漫优雅"
    elif "创意特调" in matched_tags:
        reason = "网红爆款，颜值与口感并存"
    elif "减肥" in user_text or "减脂" in user_text:
        reason = "低热量选择，减肥期间也能安心享用"
    elif "孕妇" in user_text or "失眠" in user_text:
        reason = "低咖啡因配方，安心饮用无负担"

    tag_text = "、".join(matched_tags[:3])
    recommend_text = f"根据你说的「{user_text}」，这款{product.name}完美匹配！标签：{tag_text}"

    pairing_info = None
    if pairing_product:
        pairing_info = {
            "product": pairing_product.to_dict(),
            "reason": f"{product.name}搭配{pairing_product.name}，口感层次更丰富",
        }

    return {
        "sweetness": sweetness,
        "ice": ice,
        "reason": reason,
        "recommendText": recommend_text,
        "matchedTags": matched_tags,
        "pairing": pairing_info,
    }


@ai_bp.route("/drink-suggest", methods=["POST"])
def drink_suggest():
    """
    AI 饮品定制推荐（智能语义理解版）
    请求体：{ text: "用户输入的口味需求" }
    返回：匹配的饮品推荐列表，含推荐文案、甜度/冰度搭配、搭配建议

    支持的自然语言示例：
    - "我最近减肥" → 推荐低热量、低咖啡因饮品
    - "夏天喝什么清爽" → 推荐冰爽饮品
    - "熬夜加班需要提神" → 推荐提神咖啡
    - "下午茶推荐" → 推荐甜点搭配的饮品
    - "约会想拍照好看" → 推荐颜值高的特调
    """
    try:
        data = request.get_json(silent=True) or {}
        user_text = (data.get("text") or "").strip()

        if not user_text:
            return success_response(data={
                "recommendations": [],
                "message": "请告诉我你的口味需求，比如「清爽、低因、少糖」",
            }, message="success")

        logger.info(f"AI饮品推荐请求: text={user_text}")

        tags = DrinkTag.query.filter_by(is_active=True).all()

        if not tags:
            return success_response(data={
                "recommendations": [],
                "message": "暂无标签数据，请先在后台配置饮品标签",
            }, message="success")

        matched = _match_tags(user_text, tags)

        if not matched:
            fallback_products = Product.query.filter_by(is_on_sale=True).order_by(Product.sales.desc()).limit(3).all()
            if fallback_products:
                recommendations = []
                for product in fallback_products:
                    rec = _generate_recommendation(product, [], user_text, [], None)
                    recommendations.append({
                        "product": product.to_dict(),
                        "sweetness": rec["sweetness"],
                        "ice": rec["ice"],
                        "reason": rec["reason"],
                        "recommendText": f"虽然没有完全匹配，但这款{product.name}很受欢迎，值得一试！",
                        "matchedTags": [],
                        "score": 0,
                    })
                return success_response(data={
                    "recommendations": recommendations,
                    "message": f"没有找到完全匹配的，但为你推荐几款热门饮品",
                }, message="success")
            else:
                return success_response(data={
                    "recommendations": [],
                    "message": f"没有找到匹配「{user_text}」的饮品，试试其他关键词吧～",
                }, message="success")

        all_products = Product.query.filter_by(is_on_sale=True).all()
        used_pids = set()

        recommendations = []
        for item in matched[:5]:
            product = item["product"]
            if product.id in used_pids:
                continue

            pairing_product = _find_pairing(product, all_products, used_pids)

            rec = _generate_recommendation(product, item["matched_tags"], user_text, all_products, pairing_product)
            recommendations.append({
                "product": product.to_dict(),
                "sweetness": rec["sweetness"],
                "ice": rec["ice"],
                "reason": rec["reason"],
                "recommendText": rec["recommendText"],
                "matchedTags": rec["matchedTags"],
                "pairing": rec["pairing"],
                "score": item["score"],
            })

            used_pids.add(product.id)
            if pairing_product:
                used_pids.add(pairing_product.id)

        return success_response(data={
            "recommendations": recommendations,
            "message": f"为你找到{len(recommendations)}款匹配饮品",
        }, message="success")

    except Exception as e:
        logger.error(f"AI饮品推荐异常: {e}", exc_info=True)
        return error_response(message="推荐服务暂时不可用，请稍后再试", code=500)


@ai_bp.route("/drink-tags", methods=["GET"])
def get_drink_tags():
    """获取所有饮品标签列表"""
    try:
        tags = DrinkTag.query.order_by(DrinkTag.category.asc(), DrinkTag.weight.desc()).all()
        return success_response(
            data=[t.to_dict() for t in tags],
            message="获取饮品标签列表成功",
        )
    except Exception as e:
        logger.error(f"获取饮品标签异常: {e}", exc_info=True)
        return error_response(message="获取标签失败", code=500)


@ai_bp.route("/drink-tags", methods=["POST"])
def create_drink_tag():
    """
    创建饮品标签
    请求体：{ name, category?, keywords?, productId?, weight?, isActive? }
    """
    try:
        data = request.get_json(silent=True) or {}

        name = (data.get("name") or "").strip()
        if not name:
            return error_response(message="标签名称不能为空", code=400)

        tag = DrinkTag(
            name=name,
            category=data.get("category", "taste"),
            keywords=data.get("keywords", ""),
            product_id=data.get("productId"),
            weight=int(data.get("weight", 1)),
            is_active=bool(data.get("isActive", True)),
        )
        db.session.add(tag)
        db.session.commit()

        logger.info(f"创建饮品标签: {name}")
        return success_response(data=tag.to_dict(), message="标签创建成功", code=201)

    except Exception as e:
        db.session.rollback()
        logger.error(f"创建饮品标签异常: {e}", exc_info=True)
        return error_response(message="创建失败", code=500)


@ai_bp.route("/drink-tags/<int:tag_id>", methods=["PUT"])
def update_drink_tag(tag_id):
    """
    更新饮品标签
    请求体：{ name?, category?, keywords?, productId?, weight?, isActive? }
    """
    try:
        tag = DrinkTag.query.get(tag_id)
        if not tag:
            return error_response(message="标签不存在", code=404)

        data = request.get_json(silent=True) or {}

        if "name" in data:
            name = (data.get("name") or "").strip()
            if not name:
                return error_response(message="标签名称不能为空", code=400)
            tag.name = name

        if "category" in data:
            tag.category = data["category"]
        if "keywords" in data:
            tag.keywords = data["keywords"]
        if "productId" in data:
            tag.product_id = data["productId"]
        if "weight" in data:
            tag.weight = int(data["weight"])
        if "isActive" in data:
            tag.is_active = bool(data["isActive"])

        db.session.commit()
        return success_response(data=tag.to_dict(), message="标签更新成功")

    except Exception as e:
        db.session.rollback()
        logger.error(f"更新饮品标签异常: {e}", exc_info=True)
        return error_response(message="更新失败", code=500)


@ai_bp.route("/drink-tags/<int:tag_id>", methods=["DELETE"])
def delete_drink_tag(tag_id):
    """删除饮品标签"""
    try:
        tag = DrinkTag.query.get(tag_id)
        if not tag:
            return error_response(message="标签不存在", code=404)

        db.session.delete(tag)
        db.session.commit()
        return success_response(message="标签删除成功")

    except Exception as e:
        db.session.rollback()
        logger.error(f"删除饮品标签异常: {e}", exc_info=True)
        return error_response(message="删除失败", code=500)


PRODUCT_TAG_MAP = {
    "清爽": ["青柠冰美式", "西柚冷萃气泡饮", "冰淇淋美式"],
    "提神": ["蓝色深海美式", "青柠冰美式", "抹茶美式", "冰淇淋美式"],
    "浓郁": ["海盐焦糖拿铁", "桂圆红枣拿铁", "南瓜西米拿铁"],
    "养生": ["桂圆红枣拿铁", "南瓜西米拿铁"],
    "花香": ["桂圆红枣拿铁"],
    "果香": ["青柠冰美式", "西柚冷萃气泡饮"],
    "低糖": ["蓝色深海美式", "青柠冰美式", "抹茶美式"],
    "冰爽": ["青柠冰美式", "西柚冷萃气泡饮", "蓝色深海美式", "冰淇淋美式"],
    "热饮": ["海盐焦糖拿铁", "桂圆红枣拿铁", "南瓜西米拿铁"],
    "颜值": ["蓝色深海美式", "南瓜西米拿铁", "桂圆红枣拿铁"],
    "创意": ["蓝色深海美式", "南瓜西米拿铁", "冰淇淋美式"],
    "经典": ["抹茶美式", "海盐焦糖拿铁"],
    "甜": ["南瓜西米拿铁", "海盐焦糖拿铁", "桂圆红枣拿铁"],
    "咖啡": ["蓝色深海美式", "青柠冰美式", "抹茶美式", "海盐焦糖拿铁", "冰淇淋美式"],
    "拿铁": ["海盐焦糖拿铁", "桂圆红枣拿铁", "南瓜西米拿铁"],
    "美式": ["蓝色深海美式", "青柠冰美式", "抹茶美式", "冰淇淋美式"],
    "果茶": ["西柚冷萃气泡饮"],
    "甜品": ["黑金冰酪三明治"],
    "三明治": ["黑金冰酪三明治"],
    "气泡": ["西柚冷萃气泡饮"],
}


def _match_by_product_name(user_text, products):
    """根据商品名称直接匹配"""
    matched = []
    text_lower = user_text.lower()

    for product in products:
        name_lower = product.name.lower()
        score = 0

        if text_lower in name_lower or name_lower in text_lower:
            score += 50
        else:
            for kw in product.name.split():
                if kw.lower() in text_lower or text_lower in kw.lower():
                    score += 20

        if score > 0:
            matched.append({
                "product": product,
                "score": score,
                "matched_tags": ["名称匹配"]
            })

    return matched


def _match_by_category(user_text, products):
    """根据分类匹配"""
    category_keywords = {
        "吃杯美式": ["美式", "咖啡", "黑咖", "浓缩"],
        "养生拿铁": ["拿铁", "养生", "暖", "热"],
        "风味拿铁": ["拿铁", "风味", "甜", "奶"],
        "果C美式": ["美式", "果味", "果茶"],
        "吃杯特调": ["特调", "创意", "颜值", "网红"],
        "果茶": ["果茶", "水果", "茶"],
        "甜品简餐": ["甜品", "蛋糕", "三明治", "点心"],
    }

    matched = []

    for product in products:
        if not product.category:
            continue

        cat_name = product.category.name
        if cat_name in category_keywords:
            for kw in category_keywords[cat_name]:
                if kw in user_text:
                    matched.append({
                        "product": product,
                        "score": 30,
                        "matched_tags": [cat_name]
                    })
                    break

    return matched


def _match_by_tag_keywords(user_text, products):
    """根据标签关键词匹配"""
    matched = {}
    user_text_lower = user_text.lower()
    logger.info(f"_match_by_tag_keywords: user_text='{user_text}', user_text_lower='{user_text_lower}'")

    for tag_kw, product_names in PRODUCT_TAG_MAP.items():
        tag_kw_lower = tag_kw.lower()
        match_found = tag_kw_lower in user_text_lower or user_text_lower in tag_kw_lower
        logger.info(f"  Checking tag: '{tag_kw}' vs '{user_text}' -> {match_found}")
        
        if match_found:
            logger.info(f"    Matching products: {product_names}")
            for product in products:
                logger.info(f"      Checking product: '{product.name}' in list: {product.name in product_names}")
                if product.name in product_names:
                    if product.id not in matched:
                        matched[product.id] = {
                            "product": product,
                            "score": 0,
                            "matched_tags": []
                        }
                    matched[product.id]["score"] += 25
                    if tag_kw not in matched[product.id]["matched_tags"]:
                        matched[product.id]["matched_tags"].append(tag_kw)

    logger.info(f"_match_by_tag_keywords result: {len(matched)} products")
    return list(matched.values())


@ai_bp.route("/recommend", methods=["POST"])
def recommend():
    """
    AI 饮品推荐（前端调用的接口）
    请求体：{ message: "用户输入", cart_items: [...] }
    返回：匹配的饮品推荐列表
    """
    try:
        data = request.get_json(silent=True) or {}
        if not data:
            raw_data = request.get_data(as_text=True)
            import json
            try:
                data = json.loads(raw_data)
            except:
                pass
        
        user_text = (data.get("message") or data.get("text") or "").strip()
        if isinstance(user_text, bytes):
            user_text = user_text.decode('utf-8')

        if not user_text:
            return success_response(data={
                "recommendations": [],
                "message": "请告诉我你的口味需求，比如「清爽、提神、减脂」"
            })

        products = Product.query.filter_by(is_on_sale=True).all()

        if not products:
            return success_response(data={
                "recommendations": [],
                "message": "暂无商品数据"
            })

        all_matched = []
        name_matched = _match_by_product_name(user_text, products)
        cat_matched = _match_by_category(user_text, products)
        tag_matched = _match_by_tag_keywords(user_text, products)
        
        all_matched.extend(name_matched)
        all_matched.extend(cat_matched)
        all_matched.extend(tag_matched)

        product_scores = {}
        for item in all_matched:
            pid = item["product"].id
            if pid not in product_scores:
                product_scores[pid] = {
                    "product": item["product"],
                    "score": 0,
                    "matched_tags": []
                }
            product_scores[pid]["score"] += item["score"]
            for tag in item["matched_tags"]:
                if tag not in product_scores[pid]["matched_tags"]:
                    product_scores[pid]["matched_tags"].append(tag)

        logger.info(f"Product scores count: {len(product_scores)}")
        for pid, info in product_scores.items():
            logger.info(f"  {info['product'].name}: score={info['score']}, tags={info['matched_tags']}")

        sorted_products = sorted(product_scores.values(), key=lambda x: x["score"], reverse=True)

        recommendations = []
        for item in sorted_products[:5]:
            product = item["product"]
            matched_tags = item["matched_tags"]

            sweetness = "五分糖"
            ice = "少冰"
            reason = "根据你的需求，这款饮品很适合你"

            if "无糖" in user_text or "低糖" in user_text or "少糖" in user_text:
                sweetness = "无糖" if "无糖" in user_text else "三分糖"
            if "多糖" in user_text or "全糖" in user_text:
                sweetness = "全糖"
            if "热" in user_text or "暖" in user_text:
                ice = "热饮"
            if "冰" in user_text or "冷" in user_text:
                ice = "多冰"

            if "清爽" in matched_tags or "冰爽" in matched_tags:
                reason = "清爽冰爽的口感，非常解渴"
                ice = "多冰"
                sweetness = "三分糖"
            elif "提神" in matched_tags:
                reason = "浓郁咖啡，提神醒脑"
            elif "养生" in matched_tags:
                reason = "养生配方，温暖呵护"
                ice = "热饮"
            elif "颜值" in matched_tags or "创意" in matched_tags:
                reason = "颜值担当，拍照打卡必备"
            elif "减肥" in user_text or "减脂" in user_text:
                reason = "低热量选择，减肥期间也能享用"
                sweetness = "无糖"

            recommendations.append({
                "product": product.to_dict(),
                "sweetness": sweetness,
                "ice": ice,
                "reason": reason,
                "recommendText": f"根据你说的「{user_text}」，推荐「{product.name}」！标签：{'、'.join(matched_tags)}",
                "matchedTags": matched_tags,
                "score": item["score"]
            })

        if not recommendations:
            fallback_products = sorted(products, key=lambda x: x.sales, reverse=True)[:3]
            for product in fallback_products:
                recommendations.append({
                    "product": product.to_dict(),
                    "sweetness": "五分糖",
                    "ice": "少冰",
                    "reason": "[FALLBACK] 这款是我们的热销单品，非常受欢迎！",
                    "recommendText": f"[FALLBACK] 虽然没有完全匹配，但这款「{product.name}」很受欢迎，值得一试！",
                    "matchedTags": [],
                    "score": 0
                })

        return success_response(data={
            "recommendations": recommendations,
            "message": f"为你找到{len(recommendations)}款匹配饮品"
        })

    except Exception as e:
        logger.error(f"AI推荐异常: {e}", exc_info=True)
        return error_response(message="推荐服务暂时不可用，请稍后再试", code=500)
