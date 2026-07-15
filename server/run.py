"""
Flask 启动脚本
运行命令：python run.py
"""
import os
from app import create_app

# 创建 Flask 应用实例
app = create_app()

if __name__ == "__main__":
    # 从环境变量读取主机和端口
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 5000))

    print("=" * 50)
    print("Coffee Mini API 服务启动中...")
    print(f"访问地址：http://{host}:{port}")
    print(f"API 文档：http://{host}:{port}/api/health")
    print(f"运行环境：{os.getenv('FLASK_ENV', 'development')}")
    print("=" * 50)

    app.run(host=host, port=port, debug=app.config.get("DEBUG", False))
