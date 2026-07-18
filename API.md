# API 接口文档

## 概述

本项目包含两套后端接口系统：

| 模块 | 技术栈 | 目录 | 说明 |
|------|--------|------|------|
| PHP基础业务接口 | PHP | `api/` | 用户认证、商品查询、订单创建 |
| Flask AI后端接口 | Python + Flask | `server/` | AI饮品推荐、健康检测 |

---

## 一、Flask Python AI后端接口

### 基础信息

- **服务地址**: `http://127.0.0.1:5000`
- **内容类型**: `application/json`
- **编码格式**: `UTF-8`

### 1. 健康检测接口

**路径**: `GET /api/health`

**功能**: 用于校验服务是否正常运行

**请求示例**:
```bash
curl http://127.0.0.1:5000/api/health
```

**成功返回**:
```json
{
  "code": 200,
  "message": "Service is running",
  "data": {
    "status": "healthy",
    "timestamp": "2026-07-17 10:30:00"
  }
}
```

---

### 2. AI饮品推荐接口

**路径**: `POST /api/recommend`

**功能**: 根据用户文字需求智能匹配推荐饮品

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_input | string | 是 | 用户输入的需求描述（如："我想要一杯提神的咖啡"） |

**请求示例**:
```bash
curl -X POST http://127.0.0.1:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"user_input": "我想要一杯提神的咖啡"}'
```

**成功返回（有匹配商品）**:
```json
{
  "code": 200,
  "message": "推荐成功",
  "data": {
    "recommendation": "根据您的需求，为您推荐以下饮品：",
    "products": [
      {
        "id": 1,
        "name": "拿铁咖啡",
        "price": 28,
        "image": "/static/images/a1.png",
        "description": "浓郁奶香，提神醒脑",
        "tags": ["咖啡", "提神", "奶香"]
      },
      {
        "id": 2,
        "name": "美式咖啡",
        "price": 22,
        "image": "/static/images/a2.png",
        "description": "纯正黑咖，提神首选",
        "tags": ["咖啡", "提神", "无糖"]
      }
    ]
  }
}
```

**成功返回（无匹配商品，返回热销兜底）**:
```json
{
  "code": 200,
  "message": "暂无完全匹配商品，为您推荐热销饮品",
  "data": {
    "recommendation": "为您推荐本店热销饮品：",
    "products": [
      {
        "id": 3,
        "name": "招牌拿铁",
        "price": 30,
        "image": "/static/images/a3.png",
        "description": "店长推荐，人气爆款",
        "tags": ["咖啡", "热销", "招牌"]
      },
      {
        "id": 4,
        "name": "焦糖玛奇朵",
        "price": 32,
        "image": "/static/images/a4.png",
        "description": "甜蜜焦糖，回味无穷",
        "tags": ["咖啡", "热销", "焦糖"]
      }
    ]
  }
}
```

**异常场景返回**:

**场景1：输入为空**
```json
{
  "code": 400,
  "message": "用户输入不能为空",
  "data": null
}
```

**场景2：服务异常**
```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

---

## 二、PHP基础业务接口

### 基础信息

- **服务地址**: `http://localhost/coffee-mini/api/`
- **内容类型**: `application/json`
- **编码格式**: `UTF-8`

### 1. 用户登录接口

**路径**: `POST /api/auth.php?action=login`

**功能**: 用户登录验证，返回用户信息和Token

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**:
```bash
curl -X POST "http://localhost/coffee-mini/api/auth.php?action=login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
```

**成功返回**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user_id": 1,
    "username": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**失败返回（用户名或密码错误）**:
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

---

### 2. 商品列表查询接口

**路径**: `GET /api/goods.php?action=list`

**功能**: 获取商品列表，支持分类筛选和分页

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| category_id | int | 否 | 分类ID（不传则查询全部） |
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页数量，默认10 |

**请求示例**:
```bash
curl "http://localhost/coffee-mini/api/goods.php?action=list&category_id=1&page=1&page_size=10"
```

**成功返回**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "拿铁咖啡",
        "price": 28,
        "image": "/pages/goods/static/images/a1.png",
        "description": "浓郁奶香，丝滑口感",
        "category_id": 1,
        "category_name": "咖啡",
        "stock": 100,
        "sales": 2580
      },
      {
        "id": 2,
        "name": "美式咖啡",
        "price": 22,
        "image": "/pages/goods/static/images/a2.png",
        "description": "纯正黑咖，醇香浓郁",
        "category_id": 1,
        "category_name": "咖啡",
        "stock": 80,
        "sales": 1890
      }
    ],
    "total": 20,
    "page": 1,
    "page_size": 10
  }
}
```

---

### 3. 订单创建接口

**路径**: `POST /api/order.php?action=create`

**功能**: 创建新订单

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_id | int | 是 | 用户ID |
| items | array | 是 | 商品列表 |
| items[].product_id | int | 是 | 商品ID |
| items[].quantity | int | 是 | 购买数量 |
| items[].price | float | 是 | 单价 |
| address_id | int | 是 | 收货地址ID |
| total_price | float | 是 | 订单总价 |

**请求示例**:
```bash
curl -X POST "http://localhost/coffee-mini/api/order.php?action=create" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2, "price": 28},
      {"product_id": 2, "quantity": 1, "price": 22}
    ],
    "address_id": 1,
    "total_price": 78
  }'
```

**成功返回**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "order_id": "ORD20260717001",
    "status": "待支付",
    "create_time": "2026-07-17 10:30:00",
    "total_price": 78
  }
}
```

**失败返回（参数错误）**:
```json
{
  "code": 400,
  "message": "商品列表不能为空",
  "data": null
}
```

---

## 三、错误码说明

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| 200 | 200 | 请求成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未授权/登录失败 |
| 403 | 403 | 禁止访问 |
| 404 | 404 | 资源不存在 |
| 500 | 500 | 服务器内部错误 |

---

## 四、接口测试说明

### Flask后端访问地址
- **本地开发地址**: `http://127.0.0.1:5000`
- **局域网访问地址**: `http://[你的局域网IP]:5000`

### 测试步骤
1. 启动Flask后端服务：`cd server && python run.py`
2. 使用Postman访问对应接口地址
3. 验证接口返回数据格式正确
4. 截取测试成功截图保存至 `/screenshot/postman/`

## 五、项目健壮性与异常覆盖说明
1. AI推荐接口做多层容错：空输入拦截、无匹配商品自动返回热销兜底、服务报错统一返回500提示；
2. PHP订单/登录接口校验必填参数，缺失、错误账号密码都会返回明确提示，前端可根据code做弹窗提示；
3. 所有接口统一JSON返回格式，前端request工具可统一解析code判断业务状态，减少重复判断逻辑。