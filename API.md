# Coffee Shop Mini Program API Documentation

## 基础信息

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **Authentication**: JWT Token in Authorization header

## 目录

1. [认证接口](#认证接口)
2. [商品接口](#商品接口)
3. [分类接口](#分类接口)
4. [订单接口](#订单接口)
5. [AI推荐接口](#AI推荐接口)

---

## 认证接口

### 1. 注册用户

**POST** `/auth/register`

请求体：
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "phone": "string"
}
```

响应：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000"
  }
}
```

### 2. 用户登录

**POST** `/auth/login`

请求体：
```json
{
  "username": "string",
  "password": "string"
}
```

响应：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

### 3. 获取用户信息

**GET** `/auth/me`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000",
    "created_at": "2024-01-01 00:00:00"
  }
}
```

### 4. 修改密码

**PUT** `/auth/change-password`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "old_password": "string",
  "new_password": "string"
}
```

响应：
```json
{
  "code": 200,
  "message": "密码修改成功"
}
```

---

## 商品接口

### 5. 获取商品列表

**GET** `/products`

查询参数：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| per_page | int | 否 | 每页数量，默认10 |
| category_id | int | 否 | 分类ID |
| keyword | string | 否 | 搜索关键词 |

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "拿铁咖啡",
        "description": "香浓拿铁，丝滑口感",
        "price": 28.0,
        "original_price": 32.0,
        "category_id": 1,
        "image_url": "/images/latte.jpg",
        "tags": ["热销", "推荐"],
        "stock": 100,
        "sales": 520,
        "created_at": "2024-01-01 00:00:00"
      }
    ],
    "total": 50,
    "page": 1,
    "per_page": 10
  }
}
```

### 6. 获取商品详情

**GET** `/products/<id>`

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "拿铁咖啡",
    "description": "香浓拿铁，丝滑口感",
    "price": 28.0,
    "original_price": 32.0,
    "category_id": 1,
    "category_name": "咖啡",
    "image_url": "/images/latte.jpg",
    "tags": ["热销", "推荐"],
    "stock": 100,
    "sales": 520,
    "created_at": "2024-01-01 00:00:00"
  }
}
```

### 7. 创建商品

**POST** `/products`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "name": "string",
  "description": "string",
  "price": 28.0,
  "original_price": 32.0,
  "category_id": 1,
  "image_url": "string",
  "tags": ["string"],
  "stock": 100
}
```

响应：
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "拿铁咖啡",
    "price": 28.0
  }
}
```

### 8. 更新商品

**PUT** `/products/<id>`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "name": "string",
  "description": "string",
  "price": 28.0,
  "category_id": 1
}
```

响应：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "更新后的名称",
    "price": 28.0
  }
}
```

### 9. 删除商品

**DELETE** `/products/<id>`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 分类接口

### 10. 获取分类列表

**GET** `/categories`

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "咖啡",
      "icon": "coffee",
      "sort_order": 1,
      "created_at": "2024-01-01 00:00:00"
    },
    {
      "id": 2,
      "name": "奶茶",
      "icon": "tea",
      "sort_order": 2,
      "created_at": "2024-01-01 00:00:00"
    }
  ]
}
```

### 11. 获取分类详情

**GET** `/categories/<id>`

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "咖啡",
    "icon": "coffee",
    "sort_order": 1,
    "product_count": 15,
    "created_at": "2024-01-01 00:00:00"
  }
}
```

### 12. 创建分类

**POST** `/categories`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "name": "string",
  "icon": "string",
  "sort_order": 1
}
```

响应：
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "咖啡"
  }
}
```

### 13. 更新分类

**PUT** `/categories/<id>`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "name": "string",
  "icon": "string",
  "sort_order": 1
}
```

响应：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "更新后的名称"
  }
}
```

### 14. 删除分类

**DELETE** `/categories/<id>`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 订单接口

### 15. 创建订单

**POST** `/orders`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 28.0
    }
  ],
  "total_amount": 56.0,
  "address_id": 1,
  "remark": "少糖"
}
```

响应：
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": 1,
    "order_no": "ORD202401010001",
    "total_amount": 56.0,
    "status": "pending"
  }
}
```

### 16. 获取订单列表

**GET** `/orders`

请求头：
```
Authorization: Bearer <token>
```

查询参数：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| per_page | int | 否 | 每页数量，默认10 |
| status | string | 否 | 订单状态 |

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "orders": [
      {
        "id": 1,
        "order_no": "ORD202401010001",
        "total_amount": 56.0,
        "status": "pending",
        "items": [
          {
            "product_id": 1,
            "product_name": "拿铁咖啡",
            "quantity": 2,
            "price": 28.0
          }
        ],
        "created_at": "2024-01-01 12:00:00"
      }
    ],
    "total": 10,
    "page": 1,
    "per_page": 10
  }
}
```

### 17. 获取订单详情

**GET** `/orders/<id>`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "order_no": "ORD202401010001",
    "total_amount": 56.0,
    "status": "pending",
    "items": [...],
    "address": {...},
    "remark": "少糖",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### 18. 更新订单状态

**PUT** `/orders/<id>/status`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "status": "completed"
}
```

响应：
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "id": 1,
    "status": "completed"
  }
}
```

---

## AI推荐接口

### 19. AI饮品推荐

**POST** `/ai/recommend`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "message": "我最近在减肥，推荐点适合的饮品",
  "cart_items": [
    {
      "product_id": 1,
      "name": "拿铁咖啡",
      "price": 28.0
    }
  ]
}
```

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "recommendations": [
      {
        "product_id": 5,
        "name": "美式咖啡",
        "price": 22.0,
        "reason": "低热量、无糖，非常适合减肥期间饮用",
        "sweetness": "无糖",
        "ice_level": "冰"
      }
    ],
    "pairing_suggestion": "搭配全麦三明治效果更佳",
    "total_savings": 8.0
  }
}
```

---

## 错误响应格式

```json
{
  "code": 400,
  "message": "错误描述",
  "data": null
}
```

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |