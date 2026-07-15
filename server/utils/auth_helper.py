"""
JWT 认证工具
提供令牌生成、验证以及登录装饰器
"""
from datetime import datetime, timedelta, timezone
from functools import wraps
import jwt
from flask import request, current_app, g

from .response import error_response


def generate_token(user_id, username):
    """
    生成 JWT 令牌
    :param user_id: 用户 ID
    :param username: 用户名
    :return: JWT 令牌字符串
    """
    # 读取配置
    secret_key = current_app.config.get("JWT_SECRET_KEY")
    algorithm = current_app.config.get("JWT_ALGORITHM", "HS256")
    expiration = current_app.config.get("JWT_EXPIRATION", timedelta(hours=24))

    # 构造载荷
    payload = {
        "user_id": user_id,
        "username": username,
        # exp 为过期时间，iat 为签发时间
        "exp": datetime.now(timezone.utc) + expiration,
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(payload, secret_key, algorithm=algorithm)


def verify_token(token):
    """
    验证 JWT 令牌
    :param token: JWT 令牌字符串
    :return: 解码后的载荷字典；验证失败返回 None
    """
    if not token:
        return None

    secret_key = current_app.config.get("JWT_SECRET_KEY")
    algorithm = current_app.config.get("JWT_ALGORITHM", "HS256")

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        # 令牌已过期
        return None
    except jwt.InvalidTokenError:
        # 令牌无效
        return None


def get_current_user():
    """
    从请求头中解析当前登录用户
    :return: 用户对象；未登录或令牌无效返回 None
    """
    # 避免循环导入，在函数内部导入
    from models import User

    auth_header = request.headers.get("Authorization", "")
    # 支持 "Bearer <token>" 格式
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    else:
        token = auth_header

    payload = verify_token(token)
    if not payload:
        return None

    user_id = payload.get("user_id")
    user = User.query.get(user_id)
    return user


def login_required(func):
    """
    登录验证装饰器
    被装饰的接口需要携带有效的 JWT 令牌才能访问
    通过 g.current_user 访问当前用户对象
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return error_response(message="未登录或登录已过期，请重新登录", code=401)
        # 将当前用户存入请求上下文，供后续使用
        g.current_user = user
        return func(*args, **kwargs)

    return wrapper
