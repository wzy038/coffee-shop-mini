"""
路由模块初始化文件
统一注册所有蓝图（Blueprint）
"""
from .auth import auth_bp
from .products import products_bp
from .orders import orders_bp
from .categories import categories_bp
from .ai import ai_bp


def register_blueprints(app):
    """
    将所有蓝图注册到 Flask 应用
    :param app: Flask 应用实例
    """
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
