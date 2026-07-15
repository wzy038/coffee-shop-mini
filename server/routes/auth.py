"""
认证路由
提供用户注册、登录、获取个人信息接口
所有接口前缀：/api/auth
"""
from datetime import datetime
from flask import Blueprint, request, g

from models import db, User
from utils.response import success_response, error_response
from utils.auth_helper import generate_token, login_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    用户注册
    请求体：{username, password, nickname?}
    """
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    nickname = (data.get("nickname") or "").strip()

    # 输入校验
    if not username or not password:
        return error_response(message="账号和密码不能为空", code=400)

    if len(username) < 3 or len(username) > 32:
        return error_response(message="账号长度需在 3-32 个字符之间", code=400)

    if len(password) < 6:
        return error_response(message="密码长度不能少于 6 位", code=400)

    if not nickname:
        nickname = username

    # 检查账号是否已存在
    if User.query.filter_by(username=username).first():
        return error_response(message="该账号已注册", code=409)

    # 生成会员编号：VIP + 年月日 + 4 位随机数
    member_id = "VIP" + datetime.now().strftime("%Y%m%d") + str(
        User.query.count() + 1
    ).zfill(4)

    # 创建用户
    user = User(
        member_id=member_id,
        username=username,
        nickname=nickname,
        phone=username if username.isdigit() else "",  # 纯数字视为手机号
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # 生成 JWT 令牌
    token = generate_token(user.id, user.username)

    return success_response(
        data={
            "token": token,
            "userInfo": user.to_dict(),
        },
        message="注册成功",
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    用户登录
    请求体：{username, password}
    """
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return error_response(message="账号和密码不能为空", code=400)

    # 查询用户
    user = User.query.filter_by(username=username).first()
    if not user:
        return error_response(message="账号未注册", code=404)

    # 校验密码
    if not user.check_password(password):
        return error_response(message="密码错误", code=403)

    # 生成 JWT 令牌
    token = generate_token(user.id, user.username)

    return success_response(
        data={
            "token": token,
            "userInfo": user.to_dict(),
        },
        message="登录成功",
    )


@auth_bp.route("/profile", methods=["GET"])
@login_required
def profile():
    """
    获取当前登录用户信息
    需要在请求头携带 Authorization: Bearer <token>
    """
    user = g.current_user
    return success_response(data=user.to_dict(), message="获取用户信息成功")
