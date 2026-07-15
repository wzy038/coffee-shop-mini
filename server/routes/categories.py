"""
分类路由
提供商品分类的查询和创建接口
所有接口前缀：/api/categories
"""
from flask import Blueprint, request

from models import db, Category
from utils.response import success_response, error_response
from utils.auth_helper import login_required

categories_bp = Blueprint("categories", __name__)


@categories_bp.route("", methods=["GET"])
def get_categories():
    """获取所有分类列表（按排序序号升序）"""
    categories = Category.query.order_by(Category.sort_order.asc(), Category.id.asc()).all()
    return success_response(
        data=[c.to_dict() for c in categories],
        message="获取分类列表成功",
    )


@categories_bp.route("", methods=["POST"])
@login_required
def create_category():
    """
    创建分类（需要登录）
    请求体：{name, icon?, sortOrder?}
    """
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    if not name:
        return error_response(message="分类名称不能为空", code=400)

    # 检查分类名称是否重复
    if Category.query.filter_by(name=name).first():
        return error_response(message="该分类已存在", code=409)

    category = Category(
        name=name,
        icon=data.get("icon", ""),
        sort_order=int(data.get("sortOrder", 0)),
    )

    db.session.add(category)
    db.session.commit()

    return success_response(data=category.to_dict(), message="分类创建成功", code=201)
