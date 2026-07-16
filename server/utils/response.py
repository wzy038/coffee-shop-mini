"""
统一响应格式工具
所有接口统一返回 {code, message, data} 格式
"""


def success_response(data=None, message="success", code=200):
    """
    成功响应
    :param data: 返回的数据
    :param message: 提示信息
    :param code: 状态码
    :return: Flask Response
    """
    from flask import jsonify

    return jsonify({
        "code": code,
        "message": message,
        "data": data,
    })


def error_response(message="error", code=400, data=None):
    """
    失败响应
    :param message: 错误信息
    :param code: 状态码
    :param data: 附加数据
    :return: Flask Response
    """
    from flask import jsonify

    return jsonify({
        "code": code,
        "message": message,
        "data": data,
    }), code


def paginate_response(query, page, page_size, serializer=None):
    """
    分页响应
    :param query: SQLAlchemy 查询对象
    :param page: 当前页码（从 1 开始）
    :param page_size: 每页数量
    :param serializer: 序列化函数，将模型对象转为字典
    :return: 分页数据
    """
    # 校验分页参数
    page = max(int(page or 1), 1)
    page_size = max(min(int(page_size or 10), 100), 1)

    # 执行分页查询
    pagination = query.paginate(page=page, per_page=page_size, error_out=False)
    items = pagination.items

    # 序列化数据
    if serializer:
        items = [serializer(item) for item in items]

    return success_response(data={
        "list": items,
        "total": pagination.total,
        "page": page,
        "pageSize": page_size,
        "totalPages": pagination.pages,
    })
