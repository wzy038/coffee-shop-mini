"""
配置文件
支持通过 .env 文件加载环境变量，区分开发/生产环境
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()


class BaseConfig:
    """基础配置类，所有环境共享的默认配置"""

    # 密钥（用于 JWT 签名和 Flask session）
    SECRET_KEY = os.getenv("SECRET_KEY", "coffee-mini-secret-key-change-me")

    # 数据库连接配置
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///coffee.db",  # 默认使用 SQLite，方便学生本地开发
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT 配置
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_EXPIRATION = timedelta(hours=24)  # JWT 令牌有效期 24 小时
    JWT_ALGORITHM = "HS256"

    # 文件上传配置
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 最大上传 16MB

    # 分页默认配置
    DEFAULT_PAGE_SIZE = 10


class DevelopmentConfig(BaseConfig):
    """开发环境配置"""
    DEBUG = True
    SQLALCHEMY_ECHO = False  # 是否打印 SQL 语句


class ProductionConfig(BaseConfig):
    """生产环境配置"""
    DEBUG = False
    SQLALCHEMY_ECHO = False


class TestingConfig(BaseConfig):
    """测试环境配置"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"  # 内存数据库，测试用


# 配置字典，根据环境变量 FLASK_ENV 切换
config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def get_config():
    """根据环境变量获取对应配置类"""
    env = os.getenv("FLASK_ENV", "development")
    return config_map.get(env, DevelopmentConfig)
