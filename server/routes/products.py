"""
商品路由
提供商品的增删改查接口
所有接口前缀：/api/products
"""
from flask import Blueprint, request

from models import db, Product
from utils.response import success_response, error_response, paginate_response
from utils.auth_helper import login_required

products_bp = Blueprint("products", __name__)


@products_bp.route("", methods=["GET"])
def get_products():
    """
    获取商品列表
    查询参数：page, pageSize, categoryId, keyword, isHot, isNew
    """
    page = request.args.get("page", 1)
    page_size = request.args.get("pageSize", 10)
    category_id = request.args.get("categoryId")
    keyword = request.args.get("keyword", "").strip()
    is_hot = request.args.get("isHot")
    is_new = request.args.get("isNew")

    # 构建查询
    query = Product.query

    # 仅返回上架商品
    query = query.filter(Product.is_on_sale == True)

    # 分类筛选
    if category_id:
        query = query.filter(Product.category_id == category_id)

    # 关键词搜索（按名称模糊匹配）
    if keyword:
        query = query.filter(Product.name.like(f"%{keyword}%"))

    # 热销筛选
    if is_hot == "true":
        query = query.filter(Product.is_hot == True)

    # 新品筛选
    if is_new == "true":
        query = query.filter(Product.is_new == True)

    # 按创建时间倒序排列
    query = query.order_by(Product.created_at.desc())

    return paginate_response(query, page, page_size, serializer=lambda p: p.to_dict())


@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    """获取商品详情"""
    product = Product.query.get(product_id)
    if not product:
        return error_response(message="商品不存在", code=404)

    return success_response(data=product.to_dict(), message="获取商品详情成功")


@products_bp.route("", methods=["POST"])
@login_required
def create_product():
    """
    创建商品（需要登录）
    请求体：{name, price, description?, image?, categoryId?, stock?, originalPrice?, isHot?, isNew?}
    """
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    price = data.get("price")

    # 输入校验
    if not name:
        return error_response(message="商品名称不能为空", code=400)

    if price is None:
        return error_response(message="商品价格不能为空", code=400)

    try:
        price = float(price)
        if price < 0:
            return error_response(message="商品价格不能为负数", code=400)
    except (TypeError, ValueError):
        return error_response(message="商品价格格式不正确", code=400)

    # 创建商品
    product = Product(
        name=name,
        price=price,
        description=data.get("description", ""),
        image=data.get("image", ""),
        category_id=data.get("categoryId"),
        stock=int(data.get("stock", 999)),
        original_price=float(data.get("originalPrice", 0)) if data.get("originalPrice") else 0,
        is_hot=bool(data.get("isHot", False)),
        is_new=bool(data.get("isNew", False)),
        is_on_sale=bool(data.get("isOnSale", True)),
    )

    db.session.add(product)
    db.session.commit()

    return success_response(data=product.to_dict(), message="商品创建成功", code=201)


@products_bp.route("/<int:product_id>", methods=["PUT"])
@login_required
def update_product(product_id):
    """
    更新商品（需要登录）
    请求体：{name?, price?, description?, image?, categoryId?, stock?, ...}
    """
    product = Product.query.get(product_id)
    if not product:
        return error_response(message="商品不存在", code=404)

    data = request.get_json(silent=True) or {}

    # 更新字段（仅更新传入的字段）
    if "name" in data:
        name = (data.get("name") or "").strip()
        if not name:
            return error_response(message="商品名称不能为空", code=400)
        product.name = name

    if "price" in data:
        try:
            price = float(data["price"])
            if price < 0:
                return error_response(message="商品价格不能为负数", code=400)
            product.price = price
        except (TypeError, ValueError):
            return error_response(message="商品价格格式不正确", code=400)

    if "description" in data:
        product.description = data["description"]

    if "image" in data:
        product.image = data["image"]

    if "categoryId" in data:
        product.category_id = data["categoryId"]

    if "stock" in data:
        product.stock = int(data["stock"])

    if "originalPrice" in data:
        product.original_price = float(data["originalPrice"]) if data["originalPrice"] else 0

    if "isHot" in data:
        product.is_hot = bool(data["isHot"])

    if "isNew" in data:
        product.is_new = bool(data["isNew"])

    if "isOnSale" in data:
        product.is_on_sale = bool(data["isOnSale"])

    db.session.commit()

    return success_response(data=product.to_dict(), message="商品更新成功")


@products_bp.route("/<int:product_id>", methods=["DELETE"])
@login_required
def delete_product(product_id):
    """删除商品（需要登录）"""
    product = Product.query.get(product_id)
    if not product:
        return error_response(message="商品不存在", code=404)

    db.session.delete(product)
    db.session.commit()

    return success_response(message="商品删除成功")
