"""
订单路由
提供订单的创建、查询、状态更新接口
所有接口前缀：/api/orders
"""
from datetime import datetime
from flask import Blueprint, request, g

from models import db, Order, OrderItem, Product
from utils.response import success_response, error_response, paginate_response
from utils.auth_helper import login_required

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("", methods=["GET"])
@login_required
def get_orders():
    """
    获取当前用户的订单列表（需要登录）
    查询参数：page, pageSize, status
    """
    user = g.current_user
    page = request.args.get("page", 1)
    page_size = request.args.get("pageSize", 10)
    status = request.args.get("status")

    # 仅查询当前用户的订单
    query = Order.query.filter_by(user_id=user.id)

    # 按状态筛选
    if status:
        query = query.filter(Order.status == status)

    # 按下单时间倒序排列
    query = query.order_by(Order.created_at.desc())

    return paginate_response(query, page, page_size, serializer=lambda o: o.to_dict())


@orders_bp.route("/<int:order_id>", methods=["GET"])
@login_required
def get_order(order_id):
    """获取订单详情（需要登录）"""
    user = g.current_user
    order = Order.query.get(order_id)

    if not order:
        return error_response(message="订单不存在", code=404)

    # 只能查看自己的订单
    if order.user_id != user.id:
        return error_response(message="无权查看该订单", code=403)

    return success_response(data=order.to_dict(), message="获取订单详情成功")


@orders_bp.route("", methods=["POST"])
@login_required
def create_order():
    """
    创建订单（需要登录）
    请求体：
    {
        items: [{productId, quantity}],
        remark?, address?, contactName?, contactPhone?
    }
    """
    user = g.current_user
    data = request.get_json(silent=True) or {}

    items_data = data.get("items")
    if not items_data or not isinstance(items_data, list) or len(items_data) == 0:
        return error_response(message="订单商品不能为空", code=400)

    # 计算订单总金额，并构建订单明细
    total_amount = 0
    order_items = []

    for item in items_data:
        product_id = item.get("productId")
        quantity = int(item.get("quantity", 1))

        if not product_id or quantity < 1:
            return error_response(message="订单商品信息不正确", code=400)

        product = Product.query.get(product_id)
        if not product:
            return error_response(message=f"商品(ID:{product_id})不存在", code=404)

        if not product.is_on_sale:
            return error_response(message=f"商品「{product.name}」已下架", code=400)

        if product.stock < quantity:
            return error_response(message=f"商品「{product.name}」库存不足", code=400)

        # 累加总金额
        subtotal = float(product.price) * quantity
        total_amount += subtotal

        # 创建订单明细（保存商品快照信息）
        order_item = OrderItem(
            product_id=product.id,
            product_name=product.name,
            product_image=product.image,
            price=product.price,
            quantity=quantity,
        )
        order_items.append(order_item)

        # 扣减库存、增加销量
        product.stock -= quantity
        product.sales += quantity

    # 生成订单号：年月日时分秒 + 3 位随机数
    order_no = datetime.now().strftime("%Y%m%d%H%M%S") + str(
        Order.query.count() + 1
    ).zfill(3)

    # 创建订单
    order = Order(
        order_no=order_no,
        user_id=user.id,
        total_amount=total_amount,
        status=Order.STATUS_PENDING,
        remark=data.get("remark", ""),
        address=data.get("address", ""),
        contact_name=data.get("contactName", ""),
        contact_phone=data.get("contactPhone", ""),
    )

    db.session.add(order)
    db.session.flush()  # 获取 order.id

    # 关联订单明细
    for order_item in order_items:
        order_item.order_id = order.id
        db.session.add(order_item)

    db.session.commit()

    return success_response(data=order.to_dict(), message="订单创建成功", code=201)


@orders_bp.route("/<int:order_id>/status", methods=["PUT"])
@login_required
def update_order_status(order_id):
    """
    更新订单状态（需要登录）
    请求体：{status}
    订单状态：pending(待付款), paid(已付款), preparing(制作中), completed(已完成), cancelled(已取消)
    """
    user = g.current_user
    order = Order.query.get(order_id)

    if not order:
        return error_response(message="订单不存在", code=404)

    # 只能操作自己的订单
    if order.user_id != user.id:
        return error_response(message="无权操作该订单", code=403)

    data = request.get_json(silent=True) or {}
    new_status = (data.get("status") or "").strip()

    # 校验订单状态是否合法
    valid_statuses = [s for s, _ in Order.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return error_response(
            message=f"订单状态不合法，可选值：{', '.join(valid_statuses)}",
            code=400,
        )

    order.status = new_status
    db.session.commit()

    return success_response(data=order.to_dict(), message="订单状态更新成功")
