Page({
  data: {
    activeCate: 0,
    cartTotal: 0,
    totalPrice: 0,
    showCartPopup: false,
    cartMap: {},
    deliveryType: "pickup",
    statusBarHeight: 44,
    selectedAddress: null,
    showSearch: false,
    searchText: '',
    searchResult: [],
    recommendList: [
      { id:1, name:"南瓜西米拿铁", sales:88, price:24, img:"/pages/goods/static/images/l2.png" },
      { id:2, name:"抹茶美式", sales:88, price:25, img:"/pages/goods/static/images/m6.png" },
      { id:3, name:"桂圆红枣拿铁", sales:88, price:22, img:"/pages/goods/static/images/l4.png" }
    ],
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
    goodsData: [
      [
        { id:1, name:"蓝色深海美式", sales:53, price:16, img:"/pages/goods/static/images/m1.png" },
        { id:2, name:"青柠冰美式", sales:124, price:18, img:"/pages/goods/static/images/m2.png" },
        { id:3, name:"冰淇淋美式", sales:6, price:14, img:"/pages/goods/static/images/m3.png" },
        { id:4, name:"玫瑰美式", sales:88, price:20, img:"/pages/goods/static/images/m4.png" },
        { id:5, name:"西瓜美式", sales:88, price:28, img:"/pages/goods/static/images/m5.png" },
        { id:6, name:"抹茶美式", sales:88, price:25, img:"/pages/goods/static/images/m6.png" },
        { id:7, name:"话梅冰美式", sales:88, price:22, img:"/pages/goods/static/images/m7.png" }
      ],
      [
        { id:1, name:"红豆奶油拿铁", sales:88, price:22, img:"/pages/goods/static/images/l1.png" },
        { id:2, name:"南瓜西米拿铁", sales:88, price:24, img:"/pages/goods/static/images/l2.png" },
        { id:3, name:"黑芝麻糊拿铁", sales:88, price:18, img:"/pages/goods/static/images/l3.png" },
        { id:4, name:"桂圆红枣拿铁", sales:88, price:22, img:"/pages/goods/static/images/l4.png" },
        { id:5, name:"柑橘可可拿铁", sales:88, price:23, img:"/pages/goods/static/images/l5.png" },
        { id:6, name:"奶盖丸子厚乳拿铁", sales:88, price:22, img:"/pages/goods/static/images/l6.png" }
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
        { id:1, name:"橙C美式", sales:88, price:17, img:"/pages/goods/static/images/q1.png" },
        { id:2, name:"凤梨美式", sales:88, price:25, img:"/pages/goods/static/images/q2.png" },
        { id:3, name:"冰淇淋美式", sales:88, price:20, img:"/pages/goods/static/images/q3.png" },
        { id:4, name:"西瓜美式", sales:88, price:28, img:"/pages/goods/static/images/q4.png" },
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
        { id:2, name:"椰青冰美式", sales:88, price:24, img:"/static/images/f2.png" },
        { id:3, name:"生椰拿铁", sales:88, price:18, img:"/static/images/f3.png" },
        { id:4, name:"海盐薄荷冰茉莉椰子糖", sales:88, price:22, img:"/static/images/f4.png" }
      ],
      [
        { id:1, name:"黑色天鹅", sales:88, price:22, img:"/static/images/j1.png" },
        { id:2, name:"加浓dirty", sales:88, price:24, img:"/pages/goods/static/images/j2.png" },
        { id:3, name:"雪松特调", sales:88, price:18, img:"/pages/goods/static/images/j3.png" },
        { id:4, name:"拉花咖啡", sales:88, price:22, img:"/pages/goods/static/images/j4.png" }
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
    cartList: []
  },
  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({
      currentGoods: this.data.goodsData[0],
      statusBarHeight: sysInfo.statusBarHeight || 44
    })
    this.refreshCart()
  },
  goBack() {
    wx.navigateBack()
  },
  // 每次切回点单tab强制刷新购物车，读取最新缓存
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
    console.log("点单页刷新购物车，最新缓存：", latestCart)
  },
  switchDelivery(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ deliveryType: type })
  },
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
    
    // 免费商品（兑换券商品）不能增加数量
    if (item.isFree) {
      wx.showToast({ title: '兑换商品仅限一份', icon: 'none' })
      return
    }
    
    const goodsStr = encodeURIComponent(JSON.stringify(item))
    wx.hideTabBar()
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?goods=${goodsStr}`
    })
  },
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
  openCartPopup() {
    if(this.data.cartTotal === 0) {
      wx.showToast({title:"购物车暂无商品",icon:"none"})
      return
    }
    this.setData({ showCartPopup: true })
  },
  closeCartPopup() {
    this.setData({ showCartPopup: false })
  },
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
    wx.setStorageSync("orderType", this.data.deliveryType)
    this.setData({showCartPopup:false})
    wx.navigateTo({
      url: "/pages/checkout/checkout"
    })
  },
  selectAddr() {
    wx.navigateTo({
      url: "/pages/user/address/address?from=goods"
    })
  },
  goBack() {
    wx.navigateBack()
  },
  preventBubble() {
  },
  openSearch() {
    this.setData({ showSearch: true })
  },
  closeSearch() {
    this.setData({ showSearch: false, searchText: '', searchResult: [] })
  },
  onSearchInput(e) {
    const value = e.detail.value
    this.setData({ searchText: value })
    if (value.trim()) {
      const goodsData = this.data.goodsData
      const allGoods = []
      for (let i = 0; i < goodsData.length; i++) {
        for (let j = 0; j < goodsData[i].length; j++) {
          allGoods.push(goodsData[i][j])
        }
      }
      const result = allGoods.filter(item => 
        item.name.includes(value.trim())
      )
      this.setData({ searchResult: result })
    } else {
      this.setData({ searchResult: [] })
    }
  },
  clearSearch() {
    this.setData({ searchText: '', searchResult: [] })
  },
  selectSearchItem(e) {
    const item = e.currentTarget.dataset.item
    const idx = this.data.goodsData.findIndex(cate => 
      cate.some(g => g.id === item.id)
    )
    if (idx >= 0) {
      this.setData({ activeCate: idx })
      this.closeSearch()
    }
  },
  addCartFromSearch(e) {
    const item = { ...e.currentTarget.dataset.item }
    const cateIndex = this.data.goodsData.findIndex(cate => 
      cate.some(g => g.id === item.id)
    )
    const cateName = cateIndex >= 0 ? this.data.cateList[cateIndex]?.name || '' : ''
    item.category = cateName
    
    if (item.isFree) {
      wx.showToast({ title: '兑换商品仅限一份', icon: 'none' })
      return
    }
    
    const goodsStr = encodeURIComponent(JSON.stringify(item))
    wx.hideTabBar()
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?goods=${goodsStr}`
    })
  }
})