# API 接口文档

## 概述

本项目包含两套后端接口：
- **PHP接口** (`api/`) - 基础业务接口
- **Flask接口** (`server/`) - AI推荐及扩展功能接口

---

## 一、PHP基础业务接口

### 1. 用户认证接口

**文件**: `api/auth.php`

#### 登录接口
- **方法**: POST
- **路径**: `/api/auth.php?action=login`
- **参数**:
  | 参数名 | 类型 | 必填 | 说明 |
  |--------|------|------|------|
  | username | string | 是 | 用户名 |
  | password | string | 是 | 密码 |
- **返回**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "user_id": 1,
      "username": "admin",
      "token": "xxx"
    }
  }
  ```

#### 注册接口
- **方法**: POST
- **路径**: `/api/auth.php?action=register`
- **参数**:
  | 参数名 | 类型 | 必填 | 说明 |
  |--------|------|------|------|
  | username | string | 是 | 用户名 |
  | password | string | 是 | 密码 |
  | phone | string | 否 | 手机号 |
- **返回**:
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": null
  }
  ```

---

## 二、Flask AI推荐接口

### 基础信息
- **服务地址**: `http://localhost:5000`
- **内容类型**: `application/json`
- **认证方式**: JWT Token（部分接口需要）

### 1. AI饮品推荐接口

**路径**: `POST /api/ai/recommend`

**功能**: 根据用户输入智能推荐饮品

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| input | string | 是 | 用户输入的需求描述 |

**请求示例**:
```json
{
  "input": "我想要一杯提神的咖啡"
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "success",
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
      }
    ]
  }
}
```

**失败返回**:
```json
{
  "code": 400,
  "message": "输入不能为空",
  "data": null
}
```

### 2. 商品列表接口

**路径**: `GET /api/products`

**功能**: 获取商品列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| category_id | int | 否 | 分类ID筛选 |
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页数量，默认10 |

**成功返回**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "拿铁咖啡",
        "price": 28,
        "image": "/static/images/a1.png",
        "description": "浓郁奶香",
        "category_id": 1,
        "tags": ["咖啡", "热饮"]
      }
    ],
    "total": 20,
    "page": 1,
    "page_size": 10
  }
}
```

### 3. 商品详情接口

**路径**: `GET /api/products/<id>`

**功能**: 获取单个商品详情

**成功返回**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "拿铁咖啡",
    "price": 28,
    "image": "/static/images/a1.png",
    "description": "浓郁奶香，提神醒脑",
    "category_id": 1,
    "tags": ["咖啡", "热饮", "提神"],
    "stock": 100
  }
}
```

### 4. 分类列表接口

**路径**: `GET /api/categories`

**功能**: 获取商品分类列表

**成功返回**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "咖啡",
      "description": "经典咖啡系列"
    },
    {
      "id": 2,
      "name": "奶茶",
      "description": "奶茶系列"
    }
  ]
}
```

### 5. 订单接口

**路径**: `POST /api/orders`

**功能**: 创建订单

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| items | array | 是 | 商品列表 |
| address_id | int | 是 | 地址ID |
| total_price | float | 是 | 总价 |

**请求示例**:
```json
{
  "items": [
    {"product_id": 1, "quantity": 2, "price": 28}
  ],
  "address_id": 1,
  "total_price": 56
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "order_id": "ORD20260717001",
    "status": "pending"
  }
}
```

### 6. 用户认证接口

#### 登录
**路径**: `POST /api/auth/login`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**成功返回**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin"
    }
  }
}
```

#### 注册
**路径**: `POST /api/auth/register`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| email | string | 否 | 邮箱 |

**成功返回**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": 2
  }
}
```

---

## 三、错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token失效 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 四、接口测试

接口测试截图存放于 `/screenshot/postman/` 目录。

测试步骤：
1. 使用Postman导入接口文档
2. 测试所有接口的正常和异常情况
3. 截取测试结果并保存到截图目录