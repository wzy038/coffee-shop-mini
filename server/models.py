"""
数据模型定义
使用 SQLAlchemy ORM 定义所有数据表模型
包含：User（用户）、Category（分类）、Product（商品）、Order（订单）、OrderItem（订单明细）
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# 全局数据库实例（在 app.py 中初始化）
db = SQLAlchemy()


class User(db.Model):
    """用户模型"""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # 会员编号，例如 VIP202607110001
    member_id = db.Column(db.String(32), unique=True, nullable=False, comment="会员编号")
    username = db.Column(db.String(64), unique=True, nullable=False, index=True, comment="登录账号")
    password_hash = db.Column(db.String(256), nullable=False, comment="加密后的密码")
    nickname = db.Column(db.String(64), default="", comment="昵称")
    phone = db.Column(db.String(20), default="", comment="手机号")
    avatar = db.Column(db.String(256), default="", comment="头像 URL")
    balance = db.Column(db.Numeric(10, 2), default=0, comment="账户余额")
    integral = db.Column(db.Integer, default=0, comment="积分")
    level = db.Column(db.String(32), default="普通会员", comment="会员等级")
    register_time = db.Column(db.DateTime, default=datetime.now, comment="注册时间")

    # 关联订单（一对多）
    orders = db.relationship("Order", backref="user", lazy="dynamic")

    def set_password(self, password):
        """设置密码（加密存储）"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """校验密码"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """转换为字典（对外输出，不包含密码）"""
        return {
            "id": self.id,
            "memberId": self.member_id,
            "username": self.username,
            "nickname": self.nickname or self.username,
            "phone": self.phone,
            "avatar": self.avatar,
            "balance": float(self.balance),
            "integral": self.integral,
            "level": self.level,
            "registerTime": self.register_time.strftime("%Y-%m-%d %H:%M:%S") if self.register_time else None,
        }


class Category(db.Model):
    """商品分类模型"""
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), unique=True, nullable=False, comment="分类名称")
    icon = db.Column(db.String(256), default="", comment="分类图标 URL")
    sort_order = db.Column(db.Integer, default=0, comment="排序序号，越小越靠前")
    created_at = db.Column(db.DateTime, default=datetime.now, comment="创建时间")

    # 关联商品（一对多）
    products = db.relationship("Product", backref="category", lazy="dynamic")

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "sortOrder": self.sort_order,
            "createdAt": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class Product(db.Model):
    """商品模型"""
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), nullable=False, comment="商品名称")
    description = db.Column(db.Text, default="", comment="商品描述")
    price = db.Column(db.Numeric(10, 2), nullable=False, comment="商品价格")
    original_price = db.Column(db.Numeric(10, 2), default=0, comment="原价")
    image = db.Column(db.String(256), default="", comment="商品主图 URL")
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True, comment="分类 ID")
    stock = db.Column(db.Integer, default=999, comment="库存数量")
    sales = db.Column(db.Integer, default=0, comment="销量")
    is_hot = db.Column(db.Boolean, default=False, comment="是否热销")
    is_new = db.Column(db.Boolean, default=False, comment="是否新品")
    is_on_sale = db.Column(db.Boolean, default=True, comment="是否上架")
    created_at = db.Column(db.DateTime, default=datetime.now, comment="创建时间")
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "originalPrice": float(self.original_price) if self.original_price else 0,
            "image": self.image,
            "categoryId": self.category_id,
            "categoryName": self.category.name if self.category else None,
            "stock": self.stock,
            "sales": self.sales,
            "isHot": self.is_hot,
            "isNew": self.is_new,
            "isOnSale": self.is_on_sale,
            "createdAt": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "updatedAt": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
        }


class Order(db.Model):
    """订单模型"""
    __tablename__ = "orders"

    # 订单状态常量
    STATUS_PENDING = "pending"        # 待付款
    STATUS_PAID = "paid"              # 已付款
    STATUS_PREPARING = "preparing"    # 制作中
    STATUS_COMPLETED = "completed"    # 已完成
    STATUS_CANCELLED = "cancelled"    # 已取消

    STATUS_CHOICES = (
        (STATUS_PENDING, "待付款"),
        (STATUS_PAID, "已付款"),
        (STATUS_PREPARING, "制作中"),
        (STATUS_COMPLETED, "已完成"),
        (STATUS_CANCELLED, "已取消"),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # 订单号，例如 202607111530001
    order_no = db.Column(db.String(32), unique=True, nullable=False, index=True, comment="订单号")
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, comment="用户 ID")
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0, comment="订单总金额")
    status = db.Column(db.String(20), nullable=False, default=STATUS_PENDING, comment="订单状态")
    remark = db.Column(db.String(256), default="", comment="订单备注")
    address = db.Column(db.String(256), default="", comment="收货地址")
    contact_name = db.Column(db.String(64), default="", comment="联系人")
    contact_phone = db.Column(db.String(20), default="", comment="联系电话")
    created_at = db.Column(db.DateTime, default=datetime.now, comment="下单时间")
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")

    # 关联订单明细（一对多）
    items = db.relationship("OrderItem", backref="order", cascade="all, delete-orphan", lazy="dynamic")

    def get_status_text(self):
        """获取订单状态的中文描述"""
        for value, text in self.STATUS_CHOICES:
            if value == self.status:
                return text
        return "未知"

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "orderNo": self.order_no,
            "userId": self.user_id,
            "totalAmount": float(self.total_amount),
            "status": self.status,
            "statusText": self.get_status_text(),
            "remark": self.remark,
            "address": self.address,
            "contactName": self.contact_name,
            "contactPhone": self.contact_phone,
            "items": [item.to_dict() for item in self.items],
            "createdAt": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "updatedAt": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
        }


class DrinkTag(db.Model):
    """饮品标签模型 - 用于AI推荐匹配"""
    __tablename__ = "drink_tags"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), nullable=False, comment="标签名称，如清爽、低咖啡因")
    category = db.Column(db.String(32), default="taste", comment="标签类别：taste/caffeine/temperature/sweet/scene")
    keywords = db.Column(db.Text, default="", comment="匹配关键词，逗号分隔，如 清爽,冰,柠檬,气泡")
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True, comment="关联商品ID")
    weight = db.Column(db.Integer, default=1, comment="AI匹配权重，越大优先级越高")
    is_active = db.Column(db.Boolean, default=True, comment="是否启用")
    created_at = db.Column(db.DateTime, default=datetime.now, comment="创建时间")

    # 关联商品
    product = db.relationship("Product", backref="tags")

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "keywords": self.keywords,
            "productId": self.product_id,
            "productName": self.product.name if self.product else None,
            "weight": self.weight,
            "isActive": self.is_active,
            "createdAt": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class OrderItem(db.Model):
    """订单明细模型"""
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False, comment="订单 ID")
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True, comment="商品 ID")
    product_name = db.Column(db.String(128), nullable=False, comment="商品名称（下单时快照）")
    product_image = db.Column(db.String(256), default="", comment="商品图片（下单时快照）")
    price = db.Column(db.Numeric(10, 2), nullable=False, comment="商品单价（下单时快照）")
    quantity = db.Column(db.Integer, nullable=False, default=1, comment="购买数量")

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "orderId": self.order_id,
            "productId": self.product_id,
            "productName": self.product_name,
            "productImage": self.product_image,
            "price": float(self.price),
            "quantity": self.quantity,
            "subtotal": float(self.price) * self.quantity,
        }
