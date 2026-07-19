Page({
  data: {
    activeCate: 0,
    cartTotal: 0,
    totalPrice: 0,
    showCartPopup: false,
    selectedAddress: null,
    statusBarHeight: 44,
    recommendList: [
      { id:1, name:"南瓜西米拿铁", sales:88, price:24, img:"/pages/takeaway/static/images/l2.png" },
      { id:2, name:"抹茶美式", sales:88, price:25, img:"/pages/takeaway/static/images/m6.png" },
      { id:3, name:"桂圆红枣拿铁", sales:88, price:22, img:"/pages/takeaway/static/images/l4.png" }
    ],
    // 左侧分类
    cateList: [
      { id:1, name:"吃杯美式" },
      { id:2, name:"养生拿铁☕️" },
      { id:3, name:"风味拿铁☕️" },
      { id:4, name:"果C美式" },
      { id:5, name:"吃杯特调" },
      { id:6, name:"果茶" },
      { id:7, name:"甜品简餐" },
      { id:8, name:"生椰🥥家族" },
      { id:9, name:"soe小黑杯" },
      { id:10, name:"大师咖啡" },
      { id:11, name:"小黄油🧈系列" }
    ],
    // 商品数据源
    goodsData: [
      [
        { id:1, name:"蓝色深海美式", sales:53, price:16, img:"/pages/takeaway/static/images/m1.png" },
        { id:2, name:"青柠冰美式", sales:124, price:18, img:"/pages/takeaway/static/images/m2.png" },
        { id:3, name:"冰淇淋美式", sales:6, price:14, img:"/pages/takeaway/static/images/m3.png" },
        { id:4, name:"玫瑰美式", sales:88, price:20, img:"/pages/takeaway/static/images/m4.png" },
        { id:5, name:"西瓜美式", sales:88, price:28, img:"/pages/takeaway/static/images/m5.png" },
        { id:6, name:"抹茶美式", sales:88, price:25, img:"/pages/takeaway/static/images/m6.png" },
        { id:7, name:"话梅冰美式", sales:88, price:22, img:"/pages/takeaway/static/images/m7.png" }
      ],
      [
        { id:1, name:"红豆奶油拿铁", sales:88, price:22, img:"/pages/takeaway/static/images/l1.png" },
        { id:2, name:"南瓜西米拿铁", sales:88, price:24, img:"/pages/takeaway/static/images/l2.png" },
        { id:3, name:"黑芝麻糊拿铁", sales:88, price:18, img:"/pages/takeaway/static/images/l3.png" },
        { id:4, name:"桂圆红枣拿铁", sales:88, price:22, img:"/pages/takeaway/static/images/l4.png" },
        { id:5, name:"柑橘可可拿铁", sales:88, price:23, img:"/pages/takeaway/static/images/l5.png" },
        { id:6, name:"奶盖丸子厚乳拿铁", sales:88, price:22, img:"/pages/takeaway/static/images/l6.png" }
      ],
      [
        { id:1, name:"桂花拿铁", sales:88, price:17, img:"/static/images/w1.png" },
        { id:2, name:"海盐焦糖拿铁", sales:88, price:25, img:"/static/images/w2.png" },
        { id:3, name:"玫瑰冰拿铁", sales:88, price:20, img:"/static/images/w3.png" },
        { id:4, name:"冰淇淋香草拿铁", sales:88, price:28, img:"/static/images/w4.png" },
        { id:5, name:"绿豆冰沙拿铁", sales:88, price:25, img:"/static/images/w5.png" },
        { id:6, name:"咸摩卡冰拿铁", sales:88, price:22, img:"/static/images/w6.png" }
      ],
      [ 
        { id:1, name:"橙C美式", sales:88, price:17, img:"/pages/takeaway/static/images/q1.png" },
        { id:2, name:"凤梨美式", sales:88, price:25, img:"/pages/takeaway/static/images/q2.png" },
        { id:3, name:"冰淇淋美式", sales:88, price:20, img:"/pages/takeaway/static/images/q3.png" },
        { id:4, name:"西瓜美式", sales:88, price:28, img:"/pages/takeaway/static/images/q4.png" },
        { id:5, name:"玫瑰美式", sales:88, price:25, img:"/static/images/q5.png" },
        { id:6, name:"抹茶美式", sales:88, price:22, img:"/static/images/q6.png" }
      ],
      [
        { id:1, name:"橙芭乐椰子冷萃", sales:88, price:17, img:"/static/images/a1.png" },
        { id:2, name:"冰橙子撞牛奶", sales:88, price:25, img:"/static/images/a2.png" },
        { id:3, name:"长安的荔枝", sales:88, price:20, img:"/static/images/a3.png" },
        { id:4, name:"棉花黑加仑冷萃", sales:88, price:28, img:"/static/images/a4.png" },
        { id:5, name:"日照旧金山拿铁", sales:88, price:25, img:"/static/images/a5.png" }
      ],
      [
        { id:1, name:"西柚冷萃气泡饮", sales:53, price:16, img:"/static/images/b1.png" },
        { id:2, name:"气泡冻柠茶", sales:124, price:18, img:"/static/images/b2.png" },
        { id:3, name:"苹果气泡", sales:6, price:4, img:"/static/images/b3.png" },
        { id:4, name:"百香气泡养乐多", sales:6, price:4, img:"/static/images/b4.png" }
      ],
      [
        { id:1, name:"羽衣甘蓝华夫饼", sales:53, price:16, img:"/static/images/c1.png" },
        { id:2, name:"黑芝麻酸奶杯", sales:124, price:18, img:"/static/images/c2.png" },
        { id:3, name:"黑金冰酪三明治", sales:6, price:4, img:"/static/images/c3.png" }
      ],
      [
        { id:1, name:"芒果🥭椰子海", sales:88, price:22, img:"/static/images/f1.png" },
        { id:2, name:"椰青冰美式", sales:88, price:24, img:"/static/images/f1.png" },
        { id:3, name:"生椰拿铁", sales:88, price:18, img:"/static/images/f1.png" },
        { id:4, name:"海盐薄荷冰茉莉椰子糖", sales:88, price:22, img:"/static/images/f4.png" }
      ],
      [
        { id:1, name:"黑色天鹅", sales:88, price:22, img:"/static/images/j1.png" },
        { id:2, name:"加浓dirty", sales:88, price:24, img:"/pages/takeaway/static/images/j2.png" },
        { id:3, name:"雪松特调", sales:88, price:18, img:"/pages/takeaway/static/images/j3.png" },
        { id:4, name:"拉花咖啡", sales:88, price:22, img:"/pages/takeaway/static/images/j4.png" }
      ],
      [
        { id:1, name:"小米辣美式", sales:88, price:22, img:"/static/images/t1.png" },
        { id:2, name:"无花果", sales:88, price:24, img:"/static/images/t2.png" },
      ],
      [
        { id:1, name:"小黄油拿铁", sales:88, price:22, img:"/static/images/h1.png" },
        { id:2, name:"小黄油冰美式", sales:88, price:24, img:"/static/images/h2.png" },
        { id:3, name:"小黄油厚椰拿铁", sales:88, price:18, img:"/static/images/h3.png" },
      ]
    ],
    currentGoods: [],
    cartList: [], // 购物车缓存
    cartMap: {} // 购物车商品ID映射
  },
  onLoad() {
    this.setData({
      currentGoods: this.data.goodsData[0]
    })
    this.refreshCart()
  },
  // 每次切回外卖tab强制刷新购物车，读取最新缓存
  onShow() {
    this.refreshCart()
    const addr = wx.getStorageSync("selectedAddress")
    if (addr) {
      this.setData({ selectedAddress: addr })
    }
  },
  // 封装统一刷新购物车方法
  refreshCart() {
    const latestCart = wx.getStorageSync("cart") || []
    this.calcCartTotal(latestCart)
    this.updateCartMap()
  },
  // 切换左侧商品分类
  switchCate(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({
      activeCate: idx,
      currentGoods: this.data.goodsData[idx]
    })
  },
  addCart(e) {
    const item = { ...e.currentTarget.dataset.item }
    const cateName = this.data.cateList[this.data.activeCate].name
    item.category = cateName
    const goodsStr = encodeURIComponent(JSON.stringify(item))
    wx.hideTabBar()
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?goods=${goodsStr}`
    })
  },
  // 弹窗内减少商品数量
  reduceCart(e) {
    const id = e.currentTarget.dataset.id
    let cart = [...this.data.cartList]
    const index = cart.findIndex(item => item.id === id)
    if(index === -1) return
    if(cart[index].num > 1) {
      cart[index].num -= 1
    } else {
      cart.splice(index, 1)
    }
    this.calcCartTotal(cart)
    this.updateCartMap()
    wx.setStorageSync("cart", cart)
  },
  // 统一计算购物车总数、总价
  calcCartTotal(cart) {
    let total = 0
    let price = 0
    cart.forEach(v => {
      total += v.num
      price += v.price * v.num
    })
    this.setData({
      cartList: cart,
      cartTotal: total,
      totalPrice: price
    })
  },
  updateCartMap() {
    const map = {}
    this.data.cartList.forEach(item => {
      map[item.id] = true
    })
    this.setData({ cartMap: map })
  },
  // 打开购物车弹窗
  openCartPopup() {
    if(this.data.cartTotal === 0) {
      wx.showToast({title:"购物车暂无商品",icon:"none"})
      return
    }
    this.setData({
      showCartPopup: true
    })
  },
  // 关闭购物车弹窗
  closeCartPopup() {
    this.setData({
      showCartPopup: false
    })
  },
  // 清空购物车
  clearCart() {
    this.setData({
      cartList: [],
      cartTotal: 0,
      totalPrice: 0,
      showCartPopup: false,
      cartMap: {}
    })
    wx.removeStorageSync("cart")
  },
  submitOrder() {
    if(this.data.cartTotal === 0) {
      wx.showToast({ title: "请先选择商品", icon: "none" })
      return
    }
    const user = wx.getStorageSync("userInfo")
    if (!user) {
      wx.showModal({
        title: "提示",
        content: "请先登录后再进行结算操作",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: "/pages/mine/mine" })
          }
        }
      })
      return
    }
    wx.setStorageSync("cart", this.data.cartList)
    wx.setStorageSync("orderType", "send")
    wx.setStorageSync("fromTakeaway", true)
    this.setData({showCartPopup:false})
    wx.navigateTo({
      url: "/pages/checkout/checkout"
    })
  },
  // 选择收货地址
  selectAddr() {
    wx.navigateTo({ url: "/pages/user/address/address?from=takeaway" })
  },
  goBack() {
    wx.navigateBack()
  }
})