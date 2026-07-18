"""
Flask 主应用入口
负责创建 Flask 应用实例、加载配置、初始化扩展、注册蓝图、配置错误处理和种子数据初始化
"""
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

from config import get_config
from models import db, User, Category, Product, DrinkTag


def create_app(config_name=None):
    """
    创建 Flask 应用实例（工厂模式）
    :param config_name: 配置名称（development/production/testing）
    :return: Flask 应用实例
    """
    app = Flask(__name__)

    # 加载配置
    if config_name:
        from config import config_map
        app.config.from_object(config_map.get(config_name, config_map["development"]))
    else:
        app.config.from_object(get_config())

    # 初始化数据库
    db.init_app(app)

    # 配置 CORS 跨域（允许小程序前端访问）
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # 注册蓝图
    from routes import register_blueprints
    register_blueprints(app)

    # 注册错误处理器
    register_error_handlers(app)

    # 注册根路由（健康检查）
    register_root_routes(app)

    # 初始化数据库表和种子数据
    with app.app_context():
        init_db()
        init_drink_tags()

    return app


def register_error_handlers(app):
    """注册全局错误处理器"""

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"code": 400, "message": "请求参数错误", "data": None}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"code": 401, "message": "未授权，请先登录", "data": None}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"code": 403, "message": "禁止访问", "data": None}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"code": 404, "message": "资源不存在", "data": None}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"code": 405, "message": "请求方法不允许", "data": None}), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({"code": 500, "message": "服务器内部错误", "data": None}), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        """捕获未处理的异常"""
        app.logger.error(f"未处理异常: {error}", exc_info=True)
        return jsonify({"code": 500, "message": "服务器内部错误", "data": None}), 500


def register_root_routes(app):
    """注册根路由"""

    @app.route("/")
    def index():
        """根路径，返回服务信息"""
        return jsonify({
            "code": 200,
            "message": "success",
            "data": {
                "name": "Coffee Mini API",
                "version": "1.0.0",
                "description": "咖啡小程序后端 API 服务",
            },
        })

    @app.route("/api/health")
    def health_check():
        """健康检查接口"""
        return jsonify({
            "code": 200,
            "message": "success",
            "data": {"status": "ok"},
        })

    @app.route("/api/recommend", methods=["POST"])
    def api_recommend():
        """
        AI饮品推荐接口（API文档标准路径）
        请求体：{ user_input: "用户输入的口味需求" }
        返回：匹配的饮品推荐列表
        """
        from routes.ai import _get_recommend_data
        import logging
        logger = logging.getLogger(__name__)
        try:
            data = request.get_json(silent=True) or {}
            user_text = (data.get("user_input") or data.get("message") or data.get("text") or "").strip()

            if not user_text:
                return jsonify({
                    "code": 400,
                    "message": "用户输入不能为空",
                    "data": None
                })

            logger.info(f"AI饮品推荐请求(API标准接口): text={user_text}")
            return _get_recommend_data(user_text)

        except Exception as e:
            logger.error(f"AI饮品推荐异常(API标准接口): {e}", exc_info=True)
            return jsonify({
                "code": 500,
                "message": "服务器内部错误",
                "data": None
            })


def init_db():
    """
    初始化数据库
    - 创建所有数据表
    - 如果数据库为空，插入种子数据（咖啡相关商品）
    """
    db_path = app_db_path()

    # 创建所有表
    db.create_all()

    # 如果已有分类数据，说明已初始化，跳过
    if Category.query.first():
        return

    # ===== 创建商品分类 =====
    categories_data = [
        {"name": "吃杯美式", "icon": "", "sort_order": 1},
        {"name": "养生拿铁", "icon": "", "sort_order": 2},
        {"name": "风味拿铁", "icon": "", "sort_order": 3},
        {"name": "果C美式", "icon": "", "sort_order": 4},
        {"name": "吃杯特调", "icon": "", "sort_order": 5},
        {"name": "果茶", "icon": "", "sort_order": 6},
        {"name": "甜品简餐", "icon": "", "sort_order": 7},
        {"name": "生椰家族", "icon": "", "sort_order": 8},
        {"name": "SOE小黑杯", "icon": "", "sort_order": 9},
        {"name": "大师咖啡", "icon": "", "sort_order": 10},
        {"name": "小黄油系列", "icon": "", "sort_order": 11},
    ]
    categories = []
    for c in categories_data:
        category = Category(name=c["name"], icon=c["icon"], sort_order=c["sort_order"])
        db.session.add(category)
        categories.append(category)

    db.session.flush()  # 获取分类 ID

    # ===== 创建咖啡商品（与小程序商品一致） =====
    products_data = [
        # 吃杯美式
        {"name": "蓝色深海美式", "price": 16, "category_idx": 0, "is_hot": False, "is_new": False, "sales": 53, "img": "/pages/takeaway/static/images/m1.png"},
        {"name": "青柠冰美式", "price": 18, "category_idx": 0, "is_hot": True, "is_new": False, "sales": 124, "img": "/pages/takeaway/static/images/m2.png"},
        {"name": "冰淇淋美式", "price": 14, "category_idx": 0, "is_hot": False, "is_new": False, "sales": 6, "img": "/pages/takeaway/static/images/m3.png"},
        {"name": "玫瑰美式", "price": 20, "category_idx": 0, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/m4.png"},
        {"name": "西瓜美式", "price": 28, "category_idx": 0, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/m5.png"},
        {"name": "抹茶美式", "price": 25, "category_idx": 0, "is_hot": True, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/m6.png"},
        {"name": "话梅冰美式", "price": 22, "category_idx": 0, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/m7.png"},
        # 养生拿铁
        {"name": "红豆奶油拿铁", "price": 22, "category_idx": 1, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/l1.png"},
        {"name": "南瓜西米拿铁", "price": 24, "category_idx": 1, "is_hot": True, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/l2.png"},
        {"name": "黑芝麻糊拿铁", "price": 18, "category_idx": 1, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/l3.png"},
        {"name": "桂圆红枣拿铁", "price": 22, "category_idx": 1, "is_hot": True, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/l4.png"},
        {"name": "柑橘可可拿铁", "price": 23, "category_idx": 1, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/l5.png"},
        {"name": "奶盖丸子厚乳拿铁", "price": 22, "category_idx": 1, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/l6.png"},
        # 风味拿铁
        {"name": "桂花拿铁", "price": 17, "category_idx": 2, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/w1.png"},
        {"name": "海盐焦糖拿铁", "price": 25, "category_idx": 2, "is_hot": True, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/w2.png"},
        {"name": "玫瑰冰拿铁", "price": 20, "category_idx": 2, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/w3.png"},
        {"name": "冰淇淋香草拿铁", "price": 28, "category_idx": 2, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/w4.png"},
        {"name": "绿豆冰沙拿铁", "price": 25, "category_idx": 2, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/w5.png"},
        {"name": "咸摩卡冰拿铁", "price": 22, "category_idx": 2, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/w6.png"},
        # 果C美式
        {"name": "橙C美式", "price": 17, "category_idx": 3, "is_hot": True, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/q1.png"},
        {"name": "凤梨美式", "price": 25, "category_idx": 3, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/q2.png"},
        # 吃杯特调
        {"name": "橙芭乐椰子冷萃", "price": 17, "category_idx": 4, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/a1.png"},
        {"name": "冰橙子撞牛奶", "price": 25, "category_idx": 4, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/a2.png"},
        {"name": "长安的荔枝", "price": 20, "category_idx": 4, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/a3.png"},
        {"name": "棉花黑加仑冷萃", "price": 28, "category_idx": 4, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/a4.png"},
        {"name": "日照旧金山拿铁", "price": 25, "category_idx": 4, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/a5.png"},
        # 果茶
        {"name": "西柚冷萃气泡饮", "price": 16, "category_idx": 5, "is_hot": False, "is_new": False, "sales": 53, "img": "/pages/takeaway/static/images/b1.png"},
        {"name": "气泡冻柠茶", "price": 18, "category_idx": 5, "is_hot": True, "is_new": False, "sales": 124, "img": "/pages/takeaway/static/images/b2.png"},
        {"name": "苹果气泡", "price": 4, "category_idx": 5, "is_hot": False, "is_new": False, "sales": 6, "img": "/pages/takeaway/static/images/b3.png"},
        {"name": "百香气泡养乐多", "price": 4, "category_idx": 5, "is_hot": False, "is_new": False, "sales": 6, "img": "/pages/takeaway/static/images/b4.png"},
        # 甜品简餐
        {"name": "羽衣甘蓝华夫饼", "price": 16, "category_idx": 6, "is_hot": False, "is_new": False, "sales": 53, "img": "/pages/takeaway/static/images/c1.png"},
        {"name": "黑芝麻酸奶杯", "price": 18, "category_idx": 6, "is_hot": False, "is_new": False, "sales": 124, "img": "/pages/takeaway/static/images/c2.png"},
        {"name": "黑金冰酪三明治", "price": 4, "category_idx": 6, "is_hot": False, "is_new": False, "sales": 6, "img": "/pages/takeaway/static/images/c3.png"},
        # 生椰家族
        {"name": "芒果椰子海", "price": 22, "category_idx": 7, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/f1.png"},
        {"name": "椰青冰美式", "price": 24, "category_idx": 7, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/f1.png"},
        {"name": "生椰拿铁", "price": 18, "category_idx": 7, "is_hot": True, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/f1.png"},
        {"name": "海盐薄荷冰茉莉椰子糖", "price": 22, "category_idx": 7, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/f4.png"},
        # SOE小黑杯
        {"name": "黑色天鹅", "price": 22, "category_idx": 8, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/j1.png"},
        {"name": "加浓dirty", "price": 24, "category_idx": 8, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/j2.png"},
        {"name": "雪松特调", "price": 18, "category_idx": 8, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/j3.png"},
        {"name": "拉花咖啡", "price": 22, "category_idx": 8, "is_hot": False, "is_new": False, "sales": 88, "img": "/pages/takeaway/static/images/j4.png"},
        # 大师咖啡
        {"name": "小米辣美式", "price": 22, "category_idx": 9, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/t1.png"},
        {"name": "无花果", "price": 24, "category_idx": 9, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/t2.png"},
        # 小黄油系列
        {"name": "小黄油拿铁", "price": 22, "category_idx": 10, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/h1.png"},
        {"name": "小黄油冰美式", "price": 24, "category_idx": 10, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/h2.png"},
        {"name": "小黄油厚椰拿铁", "price": 18, "category_idx": 10, "is_hot": False, "is_new": True, "sales": 88, "img": "/pages/takeaway/static/images/h3.png"},
    ]

    for p in products_data:
        product = Product(
            name=p["name"],
            description=f"精选{p['name']}，新鲜现做，口感香醇。",
            price=p["price"],
            original_price=round(p["price"] * 1.2, 2),
            image=p["img"],
            category_id=categories[p["category_idx"]].id,
            is_hot=p["is_hot"],
            is_new=p["is_new"],
            sales=p.get("sales", 0),
            stock=999,
        )
        db.session.add(product)

    # ===== 创建默认测试用户 =====
    test_user = User(
        member_id="VIP202607110001",
        username="admin",
        nickname="咖啡爱好者",
        phone="13800138000",
        balance=100.00,
        integral=200,
        level="普通会员",
    )
    test_user.set_password("123456")
    db.session.add(test_user)

    db.session.commit()


def init_drink_tags():
    """
    初始化饮品标签数据
    - 如果标签表为空，插入默认标签
    """
    if DrinkTag.query.first():
        return

    all_products = Product.query.all()
    product_map = {p.name: p for p in all_products}

    drink_tags_data = [
        # 清爽/冰爽类 - 夏天、解渴、冰饮
        {"name": "清爽", "category": "taste", "keywords": "清爽,冰,解渴,柠檬,气泡,柠", "product_name": "青柠冰美式", "weight": 3},
        {"name": "冰爽", "category": "temperature", "keywords": "冰,冷,夏天,冰爽,冰饮,降温", "product_name": "青柠冰美式", "weight": 2},
        {"name": "气泡感", "category": "taste", "keywords": "气泡,碳酸,清爽,气泡饮", "product_name": "西柚冷萃气泡饮", "weight": 2},
        {"name": "果味", "category": "taste", "keywords": "水果,草莓,果味,酸甜,芒果,凤梨,橙,西柚", "product_name": "芒果椰子海", "weight": 2},

        # 提神类
        {"name": "提神", "category": "scene", "keywords": "提神,醒脑,加班,困,累,提神醒脑", "product_name": "青柠冰美式", "weight": 3},
        {"name": "浓郁", "category": "taste", "keywords": "浓郁,醇厚,浓,深度,strong", "product_name": "加浓dirty", "weight": 2},

        # 低咖啡因/养生类
        {"name": "低咖啡因", "category": "caffeine", "keywords": "低咖啡因,脱因,低因,孕妇,敏感,少咖啡", "product_name": "黑芝麻酸奶杯", "weight": 3},
        {"name": "养生", "category": "scene", "keywords": "养生,健康,调理,桂圆,红枣,芝麻", "product_name": "桂圆红枣拿铁", "weight": 3},
        {"name": "暖饮", "category": "temperature", "keywords": "热,暖,冬天,温,热饮,暖胃", "product_name": "桂圆红枣拿铁", "weight": 2},

        # 顺滑/奶香类
        {"name": "顺滑", "category": "taste", "keywords": "顺滑,柔和,温和,不苦,奶香,牛奶", "product_name": "生椰拿铁", "weight": 2},
        {"name": "椰香", "category": "taste", "keywords": "椰子,椰汁,椰香,生椰,椰奶", "product_name": "生椰拿铁", "weight": 3},
        {"name": "抹茶", "category": "taste", "keywords": "抹茶,绿茶,清新,茶", "product_name": "抹茶美式", "weight": 2},

        # 甜/焦糖/巧克力类
        {"name": "甜", "category": "sweet", "keywords": "甜,巧克力,摩卡,糖,焦糖,香甜", "product_name": "海盐焦糖拿铁", "weight": 2},
        {"name": "焦糖风味", "category": "taste", "keywords": "焦糖,甜,糖浆,风味,焦糖玛奇朵", "product_name": "海盐焦糖拿铁", "weight": 3},

        # 花香/果香类
        {"name": "花香", "category": "taste", "keywords": "玫瑰,桂花,花香,香水,花", "product_name": "玫瑰冰拿铁", "weight": 2},
        {"name": "桂花", "category": "taste", "keywords": "桂花,桂花香,秋天", "product_name": "桂花拿铁", "weight": 2},
        {"name": "玫瑰", "category": "taste", "keywords": "玫瑰,玫瑰花,浪漫", "product_name": "玫瑰美式", "weight": 2},

        # 甜点搭配
        {"name": "甜点搭配", "category": "scene", "keywords": "甜点,蛋糕,下午茶,搭配,甜品", "product_name": "黑芝麻酸奶杯", "weight": 1},
        {"name": "坚果风味", "category": "taste", "keywords": "坚果,榛子,榛果,花生,香", "product_name": "小黄油拿铁", "weight": 2},

        # 特调/创意类
        {"name": "创意特调", "category": "scene", "keywords": "特调,创意,网红,打卡,颜值,拍照", "product_name": "蓝色深海美式", "weight": 2},
        {"name": "清爽解腻", "category": "taste", "keywords": "解腻,开胃,清爽,酸,话梅", "product_name": "话梅冰美式", "weight": 2},
    ]

    for td in drink_tags_data:
        product = product_map.get(td["product_name"])
        if product:
            tag = DrinkTag(
                name=td["name"],
                category=td["category"],
                keywords=td["keywords"],
                product_id=product.id,
                weight=td["weight"],
                is_active=True,
            )
            db.session.add(tag)

    db.session.commit()


def app_db_path():
    """获取数据库文件路径（仅 SQLite 时有意义）"""
    db_uri = os.environ.get("DATABASE_URL", "sqlite:///coffee.db")
    if db_uri.startswith("sqlite:///") and db_uri != "sqlite:///:memory:":
        db_file = db_uri.replace("sqlite:///", "")
        # 确保相对路径相对于 server 目录
        if not os.path.isabs(db_file):
            db_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), db_file)
        return db_file
    return None
