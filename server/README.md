# Coffee Mini API 后端服务

咖啡小程序项目的 Flask 后端 API 服务，提供用户认证、商品管理、订单管理、分类管理等功能。

## 技术栈

- **Flask** 3.0 - Web 框架
- **Flask-CORS** - 跨域资源共享
- **Flask-SQLAlchemy** - ORM 数据库操作
- **PyJWT** - JWT 令牌认证
- **python-dotenv** - 环境变量管理

## 目录结构

```
server/
├── app.py                  # Flask 主应用入口（工厂模式）
├── run.py                  # 启动脚本
├── config.py               # 配置文件（支持多环境）
├── models.py               # 数据模型（SQLAlchemy）
├── requirements.txt        # Python 依赖
├── .env.example            # 环境变量示例
├── README.md               # 说明文档
├── routes/                 # 路由模块（蓝图）
│   ├── __init__.py         # 蓝图注册
│   ├── auth.py             # 认证接口
│   ├── products.py         # 商品接口
│   ├── orders.py           # 订单接口
│   └── categories.py       # 分类接口
└── utils/                  # 工具模块
    ├── __init__.py         # 工具模块导出
    ├── auth_helper.py      # JWT 认证工具
    └── response.py         # 统一响应格式
```

## 快速开始

### 1. 安装依赖

```bash
cd server
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env
# 根据需要修改 .env 中的配置
```

### 3. 启动服务

```bash
python run.py
```

服务默认运行在 `http://127.0.0.1:5000`。

首次启动时会自动创建数据库表并插入种子数据（咖啡商品、测试用户）。

### 4. 验证服务

访问 `http://127.0.0.1:5000/api/health`，若返回如下内容则说明服务正常：

```json
{
  "code": 200,
  "message": "success",
  "data": { "status": "ok" }
}
```

## 测试账号

首次启动时会自动创建测试用户：

- 账号：`admin`
- 密码：`123456`

## 统一响应格式

所有接口统一返回如下 JSON 格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段      | 类型   | 说明                         |
| --------- | ------ | ---------------------------- |
| code      | number | 状态码，200 表示成功         |
| message   | string | 提示信息                     |
| data      | any    | 返回数据，失败时可能为 null  |

## 认证说明

- 登录/注册成功后返回 `token` 字段
- 访问需要认证的接口时，在请求头携带：`Authorization: Bearer <token>`
- 令牌有效期默认 24 小时

## API 接口列表

### 认证接口（/api/auth）

| 方法 | 路径            | 说明         | 是否需要认证 |
| ---- | --------------- | ------------ | ------------ |
| POST | /api/auth/register | 用户注册     | 否           |
| POST | /api/auth/login    | 用户登录     | 否           |
| GET  | /api/auth/profile  | 获取用户信息 | 是           |

**注册示例：**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456",
  "nickname": "测试用户"
}
```

**登录示例：**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

### 商品接口（/api/products）

| 方法   | 路径                | 说明         | 是否需要认证 |
| ------ | ------------------- | ------------ | ------------ |
| GET    | /api/products       | 获取商品列表 | 否           |
| GET    | /api/products/:id   | 获取商品详情 | 否           |
| POST   | /api/products       | 创建商品     | 是           |
| PUT    | /api/products/:id   | 更新商品     | 是           |
| DELETE | /api/products/:id   | 删除商品     | 是           |

**查询参数（GET /api/products）：**

| 参数       | 类型   | 说明                 |
| ---------- | ------ | -------------------- |
| page       | number | 页码，默认 1         |
| pageSize   | number | 每页数量，默认 10    |
| categoryId | number | 分类 ID              |
| keyword    | string | 搜索关键词           |
| isHot      | string | 是否热销（"true"）   |
| isNew      | string | 是否新品（"true"）   |

### 订单接口（/api/orders）

| 方法 | 路径                       | 说明           | 是否需要认证 |
| ---- | -------------------------- | -------------- | ------------ |
| GET  | /api/orders                | 获取订单列表   | 是           |
| GET  | /api/orders/:id            | 获取订单详情   | 是           |
| POST | /api/orders                | 创建订单       | 是           |
| PUT  | /api/orders/:id/status     | 更新订单状态   | 是           |

**创建订单示例：**

```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ],
  "remark": "少冰",
  "address": "某某路123号",
  "contactName": "张三",
  "contactPhone": "13800138000"
}
```

**更新订单状态示例：**

```bash
PUT /api/orders/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "paid"
}
```

### 分类接口（/api/categories）

| 方法 | 路径            | 说明         | 是否需要认证 |
| ---- | --------------- | ------------ | ------------ |
| GET  | /api/categories | 获取分类列表 | 否           |
| POST | /api/categories | 创建分类     | 是           |

## 订单状态说明

| 状态值      | 中文描述 | 说明           |
| ----------- | -------- | -------------- |
| pending     | 待付款   | 订单创建后     |
| paid        | 已付款   | 用户完成支付   |
| preparing   | 制作中   | 商家开始制作   |
| completed   | 已完成   | 订单完成       |
| cancelled   | 已取消   | 订单被取消     |

## 数据模型

### User（用户）

| 字段          | 类型   | 说明         |
| ------------- | ------ | ------------ |
| id            | int    | 主键         |
| memberId      | string | 会员编号     |
| username      | string | 登录账号     |
| nickname      | string | 昵称         |
| phone         | string | 手机号       |
| avatar        | string | 头像 URL     |
| balance       | float  | 账户余额     |
| integral      | int    | 积分         |
| level         | string | 会员等级     |
| registerTime  | string | 注册时间     |

### Product（商品）

| 字段          | 类型   | 说明         |
| ------------- | ------ | ------------ |
| id            | int    | 主键         |
| name          | string | 商品名称     |
| description   | string | 商品描述     |
| price         | float  | 商品价格     |
| originalPrice | float  | 原价         |
| image         | string | 商品图片     |
| categoryId    | int    | 分类 ID      |
| stock         | int    | 库存         |
| sales         | int    | 销量         |
| isHot         | bool   | 是否热销     |
| isNew         | bool   | 是否新品     |
| isOnSale      | bool   | 是否上架     |

### Category（分类）

| 字段       | 类型   | 说明       |
| ---------- | ------ | ---------- |
| id         | int    | 主键       |
| name       | string | 分类名称   |
| icon       | string | 分类图标   |
| sortOrder  | int    | 排序序号   |

### Order（订单）

| 字段          | 类型   | 说明         |
| ------------- | ------ | ------------ |
| id            | int    | 主键         |
| orderNo       | string | 订单号       |
| userId        | int    | 用户 ID      |
| totalAmount   | float  | 订单总金额   |
| status        | string | 订单状态     |
| statusText    | string | 状态中文描述 |
| remark        | string | 备注         |
| address       | string | 收货地址     |
| contactName   | string | 联系人       |
| contactPhone  | string | 联系电话     |
| items         | array  | 订单明细     |

### OrderItem（订单明细）

| 字段          | 类型   | 说明         |
| ------------- | ------ | ------------ |
| id            | int    | 主键         |
| orderId       | int    | 订单 ID      |
| productId     | int    | 商品 ID      |
| productName   | string | 商品名称     |
| productImage  | string | 商品图片     |
| price         | float  | 商品单价     |
| quantity      | int    | 购买数量     |
| subtotal      | float  | 小计金额     |

## 数据库配置

默认使用 SQLite，数据库文件 `coffee.db` 会自动创建在 `server/` 目录下。

如需使用 MySQL，修改 `.env` 文件中的 `DATABASE_URL`：

```
DATABASE_URL=mysql+pymysql://用户名:密码@主机:端口/数据库名
```

使用 MySQL 时需额外安装 `pymysql`：

```bash
pip install pymysql
```

## 常见问题

1. **端口被占用**：修改 `.env` 文件中的 `PORT` 配置
2. **跨域问题**：已通过 Flask-CORS 配置，允许所有来源访问
3. **数据库重置**：删除 `coffee.db` 文件后重启服务即可重新初始化
