Page({
  data: {
    statusBarHeight: 44,
    unusedCoupons: [],
    usedCoupons: [],
    currentTab: 'unused'
  },

  onLoad() {
    this.loadCoupons()
  },

  onShow() {
    this.loadCoupons()
  },

  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab })
  },

  loadCoupons() {
    const user = wx.getStorageSync("userInfo") || {}
    const coupons = user.coupons || []
    
    let hasUpdated = false
    const idSet = new Set()
    const fixedCoupons = coupons.map(c => {
      // 兼容旧数据：为重复ID生成唯一ID
      if (idSet.has(c.id)) {
        c.id = Date.now() + Math.random()
        hasUpdated = true
      }
      idSet.add(c.id)
      
      // 兼容旧数据：补充 couponType
      if (!c.couponType) {
        const match = c.name.match(/满(\d+)减(\d+)/)
        if (match) {
          c.couponType = 'coupon'
          c.minAmount = parseInt(match[1])
          c.discount = parseInt(match[2])
        } else if (c.image && c.image.includes('/goods/static/images/c')) {
          c.couponType = 'dessert'
          // 根据名称匹配商品ID
          const goodsMap = {
            '羽衣甘蓝华夫饼': { goodsId: 1, goodsPrice: 16 },
            '黑芝麻酸奶杯': { goodsId: 2, goodsPrice: 18 },
            '黑金冰酪三明治': { goodsId: 3, goodsPrice: 4 }
          }
          const goodsInfo = goodsMap[c.name]
          if (goodsInfo) {
            c.goodsId = goodsInfo.goodsId
            c.goodsPrice = goodsInfo.goodsPrice
          }
        } else {
          c.couponType = 'peripheral'
        }
        hasUpdated = true
      }
      return c
    })
    
    if (hasUpdated) {
      user.coupons = fixedCoupons
      wx.setStorageSync("userInfo", user)
    }
    
    const unusedCoupons = fixedCoupons.filter(c => c.status === 'unused')
    const usedCoupons = fixedCoupons.filter(c => c.status === 'used')
    
    this.setData({
      unusedCoupons,
      usedCoupons
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  },

  goToIntegral() {
    wx.navigateTo({ url: '/pages/user/integral/integral' })
  },

  goToGoods(e) {
    const item = e.currentTarget.dataset.item
    
    const user = wx.getStorageSync("userInfo") || {}
    if (!user.coupons) return
    
    const couponIndex = user.coupons.findIndex(c => c.id === item.id)
    if (couponIndex === -1) return
    
    if (user.coupons[couponIndex].status === 'used') {
      wx.showToast({ title: '该券已使用', icon: 'none' })
      return
    }
    
    if (item.couponType === 'dessert' || item.couponType === 'peripheral') {
      let cart = wx.getStorageSync("cart") || []
      
      const existingGoods = cart.find(g => g.couponId === item.id)
      if (existingGoods) {
        wx.showToast({ title: '该商品已在购物车', icon: 'none' })
        wx.navigateTo({ url: '/pages/goods/goods' })
        return
      }
      
      const freeGoods = {
        id: item.id,
        name: item.name,
        price: 0,
        img: item.image,
        num: 1,
        isFree: true,
        couponId: item.id,
        couponType: item.couponType
      }
      cart.push(freeGoods)
      wx.setStorageSync("cart", cart)
      
      wx.showToast({ title: '请去结算付款', icon: 'success' })
      wx.navigateTo({ url: '/pages/goods/goods' })
    } else {
      wx.navigateTo({ url: '/pages/goods/goods' })
    }
  }
})