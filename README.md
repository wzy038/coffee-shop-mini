# Cocount Coffee Mini Program

一个咖啡外卖小程序，基于微信小程序开发。

## 技术栈

- **框架**: 微信小程序原生开发
- **语言**: JavaScript
- **UI**: WXML + WXSS
- **后端**: PHP (api/)

## 功能模块

### 首页 (`pages/index`)
- 轮播图展示
- 会员中心入口
- 积分入口

### 周边 (`pages/around`)
- 周边商品展示
- 商品分类浏览

### 订单 (`pages/order`)
- 订单列表
- 订单状态管理

### 我的 (`pages/mine`)
- 用户个人中心
- 优惠券管理
- 积分充值
- 个人信息

### 商品详情 (`pages/goods-detail`)
- 商品详情展示
- 加入购物车
- 立即购买

### 外卖点餐 (`pages/takeaway`)
- 外卖商品列表
- 购物车管理

### 结算 (`pages/checkout`)
- 订单确认
- 地址管理
- 提交订单

## 项目结构

```
coffee-mini/
├── api/                    # 后端接口
│   ├── auth.php            # 认证接口
│   └── config.php          # 配置文件
├── common/                 # 公共工具
│   └── request.js          # 请求封装
├── pages/                  # 页面目录
│   ├── index/              # 首页
│   ├── around/             # 周边
│   ├── order/              # 订单
│   ├── mine/               # 我的
│   ├── checkout/           # 结算
│   ├── goods/              # 商品列表(分包)
│   ├── goods-data/         # 商品数据(分包)
│   ├── goods-detail/       # 商品详情(分包)
│   ├── takeaway/           # 外卖点餐(分包)
│   └── user/               # 用户模块(分包)
├── static/                 # 静态资源
│   └── icon/               # TabBar图标
├── utils/                  # 工具函数
│   ├── qrcode.js           # 二维码生成
│   └── request.js          # 请求工具
├── app.js                  # 小程序入口
├── app.json                # 小程序配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置
└── sitemap.json            # 站点地图
```

## 快速开始

### 前置条件

1. 安装微信开发者工具
2. 注册微信小程序账号

### 开发

1. 克隆仓库
   ```bash
   git clone <repository-url>
   ```

2. 打开微信开发者工具，选择"导入项目"

3. 导入项目目录为 `coffee-mini`

4. 填写小程序 AppID（测试可使用测试号）

### 运行

在微信开发者工具中点击"编译"即可预览。

## API 接口

后端接口位于 `api/` 目录，包含：

- `auth.php` - 用户认证相关接口
- `config.php` - 数据库配置

## 部署

1. 前端：在微信开发者工具中点击"上传"，提交审核发布
2. 后端：将 `api/` 目录部署到 PHP 服务器

## License

MIT