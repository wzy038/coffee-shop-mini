# Cocount Coffee Mini Program

一个咖啡外卖小程序，基于微信小程序开发。

## 线上演示说明

本项目后端无公网部署地址，完整本地启动+全功能操作演示录屏存放于仓库 `/video/项目演示.mp4`，用于验证全部页面、接口功能正常运行。

## 技术栈

- **框架**: 微信小程序原生开发
- **语言**: JavaScript / Python
- **UI**: WXML + WXSS
- **后端**:
  - PHP (api/) - 基础业务接口
  - Flask (server/) - Python AI后端，RESTful AI推荐接口
- **数据库**: SQLite
- **工程化工具**: Git + GitHub
- **AI辅助开发**: Trae AI辅助编程工具

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

### AI饮品推荐 (`pages/ai-drink-recommend`)
- 智能对话交互界面
- AI根据用户需求智能匹配饮品
- 推荐结果展示商品图片和价格
- 一键加入购物车功能
- 网络异常兜底逻辑，无网络时显示本地推荐数据

## 项目结构

```
coffee-mini/
├── api/                    # PHP后端接口
│   ├── auth.php            # 认证接口
│   └── config.php          # 配置文件
├── server/                 # Flask后端服务
│   ├── app.py              # Flask应用入口
│   ├── config.py           # 配置文件
│   ├── models.py           # 数据库模型
│   ├── run.py              # 启动脚本
│   ├── requirements.txt    # Python依赖
│   ├── routes/             # 路由模块
│   │   ├── __init__.py
│   │   ├── ai.py           # AI推荐接口
│   │   ├── auth.py         # 认证接口
│   │   ├── categories.py   # 分类接口
│   │   ├── orders.py       # 订单接口
│   │   └── products.py     # 商品接口
│   └── utils/              # 工具函数
│       ├── auth_helper.py  # 认证辅助
│       └── response.py     # 响应封装
├── common/                 # 公共工具
│   └── request.js          # 请求封装
├── pages/                  # 页面目录
│   ├── index/              # 首页
│   ├── around/             # 周边
│   ├── order/              # 订单
│   ├── mine/               # 我的
│   ├── checkout/           # 结算
│   ├── goods/              # 商品列表(分包)
│   ├── goods-detail/       # 商品详情(分包)
│   ├── takeaway/           # 外卖点餐(分包)
│   ├── user/               # 用户模块(分包)
│   └── ai-drink-recommend/ # AI饮品推荐
├── static/                 # 静态资源
│   └── icon/               # TabBar图标
├── utils/                  # 工具函数
│   ├── qrcode.js           # 二维码生成
│   └── request.js          # 请求工具
├── screenshot/             # 截图文件夹
│   ├── postman/            # 接口测试截图
│   └── ai/                 # AI代码审查截图
├── video/                  # 演示视频文件夹
│   └── 项目演示.mp4        # 全功能操作演示录屏
├── README.md               # 项目说明文档
├── API.md                  # API接口文档
├── prompt_shturl.md        # Prompt日志
├── 实训总结报告.md          # 个人实训总结报告
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
3. 安装 Python 3.8+ 及 pip
4. 安装 Node.js（可选，用于代码规范检查）

### 开发

1. 克隆仓库
   ```bash
   git clone <repository-url>
   ```

2. 打开微信开发者工具，选择"导入项目"

3. 导入项目目录为 `coffee-mini`

4. 填写小程序 AppID（测试可使用测试号）

### 运行

#### 前端启动
在微信开发者工具中点击"编译"即可预览。

#### Flask后端启动
```bash
# 进入server目录
cd server

# 安装依赖
pip install -r requirements.txt

# 启动服务（默认监听 0.0.0.0:5000）
python run.py
```

#### 前后端对接
1. 获取本机局域网IP地址
2. 修改 `utils/request.js` 或 `common/request.js` 中的后端接口地址为你的局域网IP
3. 在微信开发者工具中勾选"不校验合法域名"选项

## API 接口

### PHP基础业务接口
后端接口位于 `api/` 目录，包含：
- `auth.php` - 用户认证相关接口
- `config.php` - 数据库配置

### Flask AI推荐接口
后端服务位于 `server/` 目录，包含：
- `/api/recommend` - AI智能饮品推荐接口
- `/api/products` - 商品列表接口
- `/api/categories` - 分类列表接口
- `/api/orders` - 订单管理接口
- `/api/auth` - 用户认证接口

### 接口文档与测试
完整接口定义、请求示例、异常返回、测试指引独立存放于仓库根目录 `API.md`
接口完整测试示例、成功/异常返回样例全部记录于根目录`API.md`标准化接口文档，本次以规范文档替代Postman测试截图，可结合本地演示录屏完整验证接口运行效果；`/screenshot/postman/`为预留空目录。

## 部署

1. 前端：在微信开发者工具中点击"上传"，提交审核发布
2. PHP后端：将 `api/` 目录部署到 PHP 服务器
3. Flask后端：部署到 Python Web 服务器（如 Gunicorn + Nginx）

## 项目健壮性与异常处理

### 网络请求失败处理
- 所有网络请求均配置超时机制
- 请求失败时显示友好的错误提示
- AI推荐接口支持本地数据兜底，无网络时使用预设推荐

### 空输入处理
- 用户输入框校验，防止空内容提交
- 提示用户输入有效内容

### 无匹配商品处理
- AI推荐无匹配商品时返回热门推荐
- 显示"暂无匹配商品，为您推荐热门饮品"提示

### 购物车空值处理
- 购物车为空时禁用结算按钮
- 显示"购物车为空"友好提示

### 其他容错逻辑
- 页面参数校验，防止非法参数导致崩溃
- 图片加载失败使用默认占位图
- 数据格式异常时使用默认值

## Git版本管理规范

### 提交规范
- `feat:` - 新增功能（如 `feat: 实现AI饮品推荐功能`）
- `fix:` - 修复问题（如 `fix: 修复悬浮球点击无响应`）
- `docs:` - 更新文档（如 `docs: 完善API接口文档`）
- `refactor:` - 代码重构（如 `refactor: 优化商品列表渲染`）

### 开发周期
- 开发周期跨多天多次提交
- 每个功能模块独立提交
- 可完整追溯开发流程
- 提交记录覆盖项目初始化、功能开发、测试优化等阶段

## 实训考核配套材料清单

### Prompt日志
- 存放路径：`prompt_shturl.md`
- 记录AI辅助开发过程中的关键Prompt和交互对话

### AI代码审查截图
- 存放路径：`/screenshot/ai/`
- 包含AI辅助代码审查、代码优化建议的截图

### 接口测试说明
- 接口完整测试示例、成功/异常返回样例全部记录于根目录`API.md`标准化接口文档
- 本次以规范文档替代Postman测试截图，可结合本地演示录屏完整验证接口运行效果
- `/screenshot/postman/`为预留空目录

### 演示视频
- 存放路径：`/video/项目演示.mp4`
- 完整本地启动+全功能操作演示录屏

### 个人实训报告
- 存放路径：`实训总结报告.md`
- 包含实训目的、技术栈学习、功能实现、问题解决、总结反思等内容

## License

MIT