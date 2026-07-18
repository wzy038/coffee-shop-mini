# AI开发提示词日志

说明：每条记录对应项目文件/功能，包含我的提问prompt、Trae完整原始输出，用于实训核验AI辅助开发全过程

---
### 填写规范
1. 我的Prompt：粘贴当时发给Trae的完整原始提问文字，不可简写；
2. AI原始返回：
   - 纯文字/代码类输出：直接粘贴完整代码块；
   - 长对话、页面修改效果图：插入截图，并标注截图存放路径 `/screenshot/ai/`；
3. 每条记录完成填写后随代码一并Git提交，完整留存AI辅助开发全过程。

## 记录1：AI饮品推荐页面布局优化

对应文件：pages/ai-drink-recommend

我希望AI可以灵活根据用户需求给出建议和饮品的搭配
2. AI原始返回：
  完整对话截图存放路径：/screenshot/ai/ai-drink-recommend(2).png

---

## 记录2：Flask后端AI推荐接口编写

对应文件：server/routes/ai.py

1. 我的Prompt：我不想做AI凑单助手了，把之前的全部删掉，换成这个基于现有咖啡店微信小程序、Flask后端、Next.js商家后台，开发AI饮品定制推荐完整功能，需求分层开发： 
  1.微信小程序端 pages/ai-drink-recommend 
    1) 页面采用聊天对话式UI，参考电商AI对话气泡布局 
    2) 底部输入框，用户输入口味需求：如清爽、低咖啡因、少糖、适合冬天等 
    3) 点击发送，读取输入文本请求后端AI推荐接口 
    4. AI返回推荐饮品列表，展示适配理由、推荐甜度/冰度搭配 
    5. 每个饮品卡片附带「一键加购」按钮；无匹配商品、空输入友好提示 
    6. 购物车全局存储复用wx.getStorageSync("cart") 
 2.Flask后端新增接口 /api/ai/drink-suggest 
    - 接收用户文本描述，读取数据库饮品标签库 
    - AI逻辑匹配标签生成个性化推荐文案、搭配方案 
    - models新增DrinkTag表存储饮品标签，全局异常捕获、日志打印 
    - 输出完整接口文档、Postman测试示例 
 3.Next.js商家admin后台 
    - 新增饮品标签配置页面，支持新增/编辑/删除饮品标签 
    - 标签实时同步给前端AI推荐接口，自定义AI匹配权重 
 4.代码分层规范，独立组件拆分，注释完整，适配微信开发者工具直接运行

2. AI原始返回：
完整对话截图存放路径：/screenshot/ai/ai-drink-recommend.png


## 记录3：页面顶部导航栏样式修改

对应文件：pages/ai-drink-recommend

 删除现有页面顶部「←AI 饮品推荐」棕色大标题栏（包含返回箭头 + 文字的整块组件全部移除）
替换成和商品点单页（图二）完全一致的顶部导航样式：
左上角：左箭头返回按钮 <
中间居中文字：页面标题「AI 饮品推荐」
保持页面下方 AI 对话输入框、饮品推荐列表所有业务逻辑不变，只修改顶部导航 UI 布局，整体风格统一项目其他页面。间距问题：当前输入框距离页面底部留白太大，缩小底部边距，紧贴页面最下方，和点单页底部购物栏的底部间距保持一致；
宽度样式：调整输入框整体宽度，左右两侧增加合适内边距，不要撑满屏幕左右贴边，视觉更协调；
布局细节：输入框和右侧发送按钮横向并排，圆角、配色保持现有风格不变，只调整宽高、左右边距、底部外边距；
中间聊天对话、饮品推荐卡片所有逻辑和布局完全不动，只改顶部头部、底部输入框。
适配手机安全区，不会遮挡底部输入内容。
2. AI原始返回：
  完整对话截图存放路径：/screenshot/ai/ai-drink-recommend(1).png


## 记录4：代码审查Code Review优化建议

对应文件：server全部后端代码

1. 我的Prompt：进行一次 Code Review

2. AI原始返回：
  完整对话截图存放路径：/screenshot/ai/ai-drink-recommend(3).png
                    /screenshot/ai/ai-drink-recommend(4).png
                    /screenshot/ai/ai-drink-recommend(5).png


## 记录5：README.md项目文档扩充完善

对应文件：README.md

1. 我的Prompt：README.md项目文档扩充完善

2. AI原始返回：/screenshot/ai/ai-drink-recommend(6).png

---

## 记录6：API.md接口文档生成

对应文件：API.md

1. 我的Prompt：
帮我生成一份完整规范的API.md接口文档，文件放在项目根目录，内容要求：
1.分为两大模块：PHP基础业务接口、Flask Python AI后端接口
2.Flask接口包含：
   ① 健康检测接口 GET /api/health，用于校验服务是否正常运行，给出请求地址、返回成功JSON示例
   ② AI饮品推荐接口 POST /api/recommend，入参user_input（用户文字需求），返回匹配饮品数组，无匹配时返回热销兜底商品，写出请求参数、返回示例、异常场景
3.PHP接口包含用户登录、商品列表查询、订单创建三个基础接口，分别写清请求方式、参数、返回数据
4.文档末尾添加说明：所有接口Postman调用成功截图存放在仓库 /screenshot/postman/；Flask后端本地访问地址 http://127.0.0.1:5000
5.使用标准markdown格式，条理清晰，符合实训考核要求，直接输出完整可保存的API.md全文

2. AI原始返回：/screenshot/ai/ai-drink-recommend(7).png


## 记录7：可拖拽悬浮球组件开发

对应文件：pages/goods、pages/checkout

1. 我的Prompt：基于现有咖啡店微信小程序、Flask后端AI凑单接口，开发全局可拖拽AI凑单悬浮球组件，完整需求： 
 1.小程序前端 
   1) 封装全局公共悬浮球组件，所有页面自动显示，无需每个页面重复引入 
   2) 圆形渐变悬浮球，右下角默认位置，支持手指拖动，松手自动吸附屏幕左右边缘，不超出屏幕边界 
   3) 球体显示「AI凑单助手」文字/图标，点击跳转pages/ai-coupon凑单页面 
   4) 跳转时自动读取全局购物车存储数据，传给后端AI凑单接口 
   5) 样式带阴影、圆角，层级z-index最高，不遮挡页面核心操作按钮 
   6) 处理边界：拖动不超出屏幕顶部导航、底部tab栏 
 2.配套AI凑单页面pages/ai-coupon不变，对接后端/api/ai/get-coupon-suggest接口 
 3.Flask后端无需改动，复用现有凑单接口 
 4.Next.js商家后台满减配置页面保留，用于修改凑单优惠规则 
 5.输出完整组件目录、wxml/wxss/js代码，附带全局引入app.json配置说明，代码分层规范，这个想法能实现吗，告诉我你的思路，现不着急做

2. AI原始返回：/screenshot/ai/ai-drink-recommend(8).png
             /screenshot/ai/ai-drink-recommend(9).png

---


## 记录8：网络请求封装与异常处理

对应文件：utils/request.js、common/request.js

1. 我的Prompt：请帮我封装前端网络请求工具，需要包含统一的baseURL配置，请求拦截器添加token和设置超时时间，响应拦截器统一错误处理和数据格式转换，异常处理包括网络错误、超时、HTTP错误状态码，支持GET、POST、PUT、DELETE方法，Promise封装支持async/await调用，网络请求失败时显示友好提示，提供默认导出和单独方法导出，请直接输出完整的request.js代码。

2. AI原始返回：
```javascript
// utils/request.js
const BASE_URL = 'http://127.0.0.1:5000'

const request = (options) => {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options
    
    wx.request({
      url: BASE_URL + url,
      method: method.toUpperCase(),
      data: data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else {
          wx.showToast({
            title: `HTTP错误: ${res.statusCode}`,
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败，请检查网络',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {}
    })
  })
}

request.get = (url, data, header) => {
  return request({ url, method: 'GET', data, header })
}

request.post = (url, data, header) => {
  return request({ url, method: 'POST', data, header })
}

request.put = (url, data, header) => {
  return request({ url, method: 'PUT', data, header })
}

request.delete = (url, data, header) => {
  return request({ url, method: 'DELETE', data, header })
}

module.exports = request
```

---

## 记录9：项目性能优化与代码重构

对应文件：项目全局

1. 我的Prompt：请帮我对咖啡小程序项目进行性能优化和代码重构，包括：1.优化图片资源加载，使用懒加载和占位图；2.优化页面渲染，减少不必要的setData调用；3.代码结构优化，抽取公共组件和工具函数；4.优化网络请求，添加缓存机制；5.优化小程序包体积，移除未使用的资源文件；6.添加性能监控和日志记录，请给出详细的优化方案和代码示例。

2. AI原始返回：
```javascript
// 图片懒加载优化示例
const lazyLoad = (selector) => {
  const query = wx.createSelectorQuery()
  query.selectAll(selector).boundingClientRect()
  query.selectViewport().scrollOffset()
  query.exec((res) => {
    const images = res[0]
    const scrollTop = res[1].scrollTop
    const windowHeight = wx.getSystemInfoSync().windowHeight
    
    images.forEach((image) => {
      if (image.top < scrollTop + windowHeight) {
        const img = image.dataset.src
        if (img && !image.src) {
          image.src = img
        }
      }
    })
  })
}

// 防抖函数优化
const debounce = (fn, delay = 300) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 节流函数优化
const throttle = (fn, interval = 500) => {
  let lastTime = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn(...args)
    }
  }
}

// 缓存工具封装
const cache = {
  get(key) {
    try {
      const data = wx.getStorageSync(key)
      return data ? JSON.parse(data) : null
    } catch (e) {
      return null
    }
  },
  set(key, value, expire = 3600) {
    try {
      const data = {
        value,
        expire: Date.now() + expire * 1000
      }
      wx.setStorageSync(key, JSON.stringify(data))
    } catch (e) {
      console.error('缓存设置失败', e)
    }
  },
  remove(key) {
    wx.removeStorageSync(key)
  },
  has(key) {
    const data = this.get(key)
    return data && data.expire > Date.now()
  }
}

// 性能监控工具
const performance = {
  timers: {},
  start(key) {
    this.timers[key] = Date.now()
  },
  end(key) {
    if (this.timers[key]) {
      const duration = Date.now() - this.timers[key]
      console.log(`[Performance] ${key}: ${duration}ms`)
      return duration
    }
    return 0
  }
}
```