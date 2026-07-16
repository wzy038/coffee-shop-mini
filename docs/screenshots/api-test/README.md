# 接口测试截图

本目录存放API接口测试的截图文件。

## 测试接口

1. **认证接口**
   - POST /auth/register - 用户注册
   - POST /auth/login - 用户登录
   - GET /auth/me - 获取用户信息

2. **商品接口**
   - GET /products - 获取商品列表
   - GET /products/:id - 获取商品详情
   - POST /products - 创建商品

3. **订单接口**
   - POST /orders - 创建订单
   - GET /orders - 获取订单列表

4. **AI推荐接口**
   - POST /ai/recommend - AI饮品推荐

## 命名规范

`接口名称_状态码.png`

示例：
- login_200.png
- products_200.png
- recommend_200.png