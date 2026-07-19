const allGoods = [
  { id:101, name:"蓝色深海美式", sales:53, price:16, img:"/pages/goods/static/images/m4 (18).png" },
  { id:102, name:"青柠冰美式", sales:124, price:18, img:"/pages/goods/static/images/m4 (19).png" },
  { id:103, name:"冰淇淋美式", sales:6, price:14, img:"/pages/goods/static/images/m4 (7).png" },
  { id:104, name:"玫瑰美式", sales:88, price:20, img:"/pages/goods/static/images/m4 (2).png" },
  { id:105, name:"西瓜美式", sales:88, price:28, img:"/pages/goods/static/images/m4 (1).png" },
  { id:106, name:"抹茶美式", sales:88, price:25, img:"/pages/goods/static/images/m4 (3).png" },
  { id:107, name:"话梅冰美式", sales:88, price:22, img:"/pages/goods/static/images/m4 (4).png" },
  { id:201, name:"红豆奶油拿铁", sales:88, price:22, img:"/pages/goods/static/images/m4 (12).png" },
  { id:202, name:"南瓜西米拿铁", sales:88, price:24, img:"/pages/goods/static/images/m4 (13).png" },
  { id:203, name:"黑芝麻糊拿铁", sales:88, price:18, img:"/pages/goods/static/images/m4 (13).png" },
  { id:204, name:"桂圆红枣拿铁", sales:88, price:22, img:"/pages/goods/static/images/m4 (15).png" },
  { id:205, name:"柑橘可可拿铁", sales:88, price:23, img:"/pages/goods/static/images/m4 (16).png" },
  { id:206, name:"奶盖丸子厚乳拿铁", sales:88, price:22, img:"/pages/goods/static/images/m4 (17).png" },
  { id:301, name:"桂花拿铁", sales:88, price:17, img:"/pages/goods/static/images/w1.png" },
  { id:302, name:"海盐焦糖拿铁", sales:88, price:25, img:"/pages/goods/static/images/w2.png" },
  { id:303, name:"玫瑰冰拿铁", sales:88, price:20, img:"/pages/goods/static/images/w3.png" },
  { id:304, name:"冰淇淋香草拿铁", sales:88, price:28, img:"/pages/goods/static/images/w4.png" },
  { id:305, name:"绿豆冰沙拿铁", sales:88, price:25, img:"/pages/goods/static/images/w5.png" },
  { id:306, name:"咸摩卡冰拿铁", sales:88, price:22, img:"/pages/goods/static/images/w6.png" },
  { id:401, name:"橙C美式", sales:88, price:17, img:"/pages/goods/static/images/m4 (5).png" },
  { id:402, name:"凤梨美式", sales:88, price:25, img:"/pages/goods/static/images/m4 (6).png" },
  { id:501, name:"橙芭乐椰子冷萃", sales:88, price:17, img:"/pages/goods/static/images/a1.png" },
  { id:601, name:"西柚冷萃气泡饮", sales:53, price:16, img:"/pages/goods/static/images/b1.png" },
  { id:602, name:"气泡冻柠茶", sales:124, price:18, img:"/pages/goods/static/images/b2.png" },
  { id:701, name:"羽衣甘蓝华夫饼", sales:53, price:16, img:"/pages/goods/static/images/c1.png" },
  { id:702, name:"黑芝麻酸奶杯", sales:124, price:18, img:"/pages/goods/static/images/c2.png" },
  { id:703, name:"黑金冰酪三明治", sales:6, price:4, img:"/pages/goods/static/images/c3.png" },
  { id:801, name:"芒果椰子海", sales:88, price:22, img:"/pages/goods/static/images/f1.png" },
  { id:901, name:"黑色天鹅", sales:88, price:22, img:"/pages/goods/static/images/j1.png" },
  { id:1001, name:"小米辣美式", sales:88, price:22, img:"/pages/goods/static/images/t1.png" },
  { id:1101, name:"小黄油拿铁", sales:88, price:22, img:"/pages/goods/static/images/h1.png" }
]

function getRandomExchange(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

Page({
  data: {
    statusBarHeight: 44,
    deliveryType: "pickup",
    payTotal: 0,
    cartList: [],
    goodsSum: 0,
    sendFee: 6,
    showDeliveryToggle: true,
    exchangeList: [],
    remark: "",
    showRemarkModal: false,
    remarkTags: ["少冰", "去冰", "少糖", "不加糖", "多加珍珠", "多加椰果", "打包分开装", "请尽快送达"],
    payType: "wechat",
    coupons: [],
    selectedCoupon: null,
    discountAmount: 0,
    showCouponModal: false,
    tempCoupon: null,
    selectedAddress: {}
  },

  onLoad() {
    const cart = wx.getStorageSync("cart") || []
    const type = wx.getStorageSync("orderType") || "pickup"
    const fromTakeaway = wx.getStorageSync("fromTakeaway")
    wx.removeStorageSync("fromTakeaway")
    const randomThree = getRandomExchange(allGoods, 3)
    const selectedAddress = wx.getStorageSync("selectedAddress") || {}
    
    const user = wx.getStorageSync("userInfo") || {}
    const rawCoupons = (user.coupons || []).filter(c => c.status === 'unused')
    
    let hasUpdated = false
    const idSet = new Set()
    const coupons = rawCoupons.map(c => {
      if (idSet.has(c.id)) {
        c.id = Date.now() + Math.random()
        hasUpdated = true
      }
      idSet.add(c.id)
      
      if (c.discount === undefined || c.minAmount === undefined) {
        const match = c.name.match(/满(\d+)减(\d+)/)
        if (match) {
          c.minAmount = parseInt(match[1])
          c.discount = parseInt(match[2])
        } else {
          c.minAmount = 0
          c.discount = 0
        }
        hasUpdated = true
      }
      return c
    }).filter(c => c.discount > 0)
    
    if (hasUpdated) {
      wx.setStorageSync("userInfo", user)
    }
    
    this.setData({
      cartList: cart,
      deliveryType: type,
      exchangeList: randomThree,
      showDeliveryToggle: !fromTakeaway,
      coupons,
      selectedAddress
    })
    this.calcPayTotal()
  },
  
  onShow() {
    const selectedAddress = wx.getStorageSync("selectedAddress") || {}
    this.setData({ selectedAddress })
  },
  
  goBack() {
    wx.navigateBack()
  },
  
  goAddress() {
    wx.navigateTo({
      url: "/pages/user/address/address?from=goods"
    })
  },

  switchTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ deliveryType: type }, () => {
      this.calcPayTotal()
    })
  },

  calcPayTotal() {
    let goodsSum = 0
    this.data.cartList.forEach(item => {
      goodsSum += item.price * item.num
    })
    this.setData({ goodsSum })

    let total = goodsSum
    if (this.data.deliveryType === "send") {
      total += this.data.goodsSum >= 30 ? 0 : this.data.sendFee
    }
    
    const discount = this.data.selectedCoupon ? this.data.selectedCoupon.discount : 0
    this.setData({ 
      payTotal: total,
      discountAmount: discount
    })
  },

  goBack() {
    wx.navigateBack()
  },

  addExchange(e) {
    const goods = {
      id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      price: e.currentTarget.dataset.price,
      img: e.currentTarget.dataset.img,
      num: 1
    }
    let cart = wx.getStorageSync("cart") || []
    const existIndex = cart.findIndex(item => item.id === goods.id)
    if (existIndex !== -1) {
      cart[existIndex].num += 1
    } else {
      cart.push(goods)
    }
    wx.setStorageSync("cart", cart)
    wx.showToast({ title: "加入购物车成功", icon: "success" })
    this.setData({ cartList: cart })
    this.calcPayTotal()
  },

  changeNum(e) {
    const id = e.currentTarget.dataset.id
    const op = e.currentTarget.dataset.op
    let cart = [...this.data.cartList]
    const index = cart.findIndex(item => item.id === id)
    if (index !== -1) {
      if (cart[index].isFree) {
        wx.showToast({ title: '兑换商品仅限一份', icon: 'none' })
        return
      }
      if (op === "+") {
        cart[index].num += 1
      } else {
        if (cart[index].num > 1) {
          cart[index].num -= 1
        } else {
          cart.splice(index, 1)
        }
      }
    }
    wx.setStorageSync("cart", cart)
    this.setData({ cartList: cart })
    this.calcPayTotal()
  },

  goRemark() {
    this.setData({ showRemarkModal: true })
  },

  closeRemarkModal() {
    this.setData({ showRemarkModal: false })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  selectRemarkTag(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ remark: value })
  },

  confirmRemark() {
    this.setData({ showRemarkModal: false })
  },

  selectPayType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ payType: type })
  },

  openCouponModal() {
    this.setData({ showCouponModal: true })
  },

  closeCouponModal() {
    this.setData({ 
      showCouponModal: false,
      tempCoupon: null 
    })
  },

  selectCoupon(e) {
    const coupon = e.currentTarget.dataset.coupon
    
    if (coupon.minAmount > this.data.goodsSum) {
      wx.showToast({
        title: `需满¥${coupon.minAmount}才能使用`,
        icon: 'none'
      })
      return
    }
    
    const isSelected = this.data.tempCoupon && this.data.tempCoupon.id === coupon.id
    if (isSelected) {
      this.setData({ tempCoupon: null })
    } else {
      this.setData({ tempCoupon: coupon })
    }
  },

  confirmCoupon() {
    this.setData({ 
      selectedCoupon: this.data.tempCoupon,
      showCouponModal: false 
    })
    this.calcPayTotal()
  },

  submitOrder() {
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
    if (this.data.cartList.length === 0) {
      wx.showToast({ title: "请先选购商品", icon: "none" })
      return
    }
    if (this.data.deliveryType === "send" && this.data.goodsSum < 30) {
      wx.showToast({ title: "外送需满¥30才能下单，还差¥" + (30 - this.data.goodsSum), icon: "none" })
      return
    }
    
    const discountAmount = this.data.selectedCoupon ? this.data.selectedCoupon.discount : 0
    const finalTotal = this.data.payTotal - discountAmount
    
    if (this.data.payType === "balance") {
      const balance = user.balance || 0
      if (balance < finalTotal) {
        wx.showModal({
          title: "余额不足",
          content: "当前余额¥" + balance + "，支付金额¥" + finalTotal + "，还差¥" + (finalTotal - balance),
          confirmText: "去充值",
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: "/pages/user/recharge/recharge" })
            }
          }
        })
        return
      }
    }
    wx.showLoading({ title: "提交中" })
    setTimeout(() => {
      wx.hideLoading()
      const oldBalance = user.balance || 0
      
      if (this.data.payType === "balance") {
        user.balance = oldBalance - finalTotal
      }
      
      if (!user.balanceRecords) {
        user.balanceRecords = []
      }
      
      const now = new Date()
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      
      if (this.data.payType === "balance") {
        user.balanceRecords.unshift({
          id: Date.now(),
          type: 'expense',
          typeName: '订单消费',
          amount: finalTotal,
          time: timeStr,
          beforeBalance: oldBalance,
          afterBalance: user.balance
        })
      }
      
      const earnedIntegral = finalTotal
      user.integral = (user.integral || 0) + earnedIntegral
      
      if (user.coupons) {
        if (this.data.selectedCoupon) {
          const couponIndex = user.coupons.findIndex(c => c.id === this.data.selectedCoupon.id)
          if (couponIndex !== -1) {
            user.coupons[couponIndex].status = 'used'
          }
        }
        
        this.data.cartList.forEach(item => {
          if (item.isFree && item.couponId) {
            const couponIndex = user.coupons.findIndex(c => c.id === item.couponId)
            if (couponIndex !== -1) {
              user.coupons[couponIndex].status = 'used'
            }
          }
        })
        
        user.couponCount = user.coupons.filter(c => c.status === 'unused').length
      }
      
      wx.setStorageSync("userInfo", user)
      
      let registeredUsers = wx.getStorageSync("registeredUsers") || []
      const index = registeredUsers.findIndex(u => u.phone === user.phone)
      if (index !== -1) {
        registeredUsers[index].integral = user.integral || 0
        registeredUsers[index].balance = user.balance || 0
        registeredUsers[index].coupons = user.coupons || []
        registeredUsers[index].couponCount = user.couponCount || 0
        registeredUsers[index].pointNum = user.pointNum || 0
        registeredUsers[index].avatar = user.avatar || ''
        registeredUsers[index].balanceRecords = user.balanceRecords || []
        wx.setStorageSync("registeredUsers", registeredUsers)
      }
      
      wx.showToast({ title: "下单成功，获得" + earnedIntegral + "积分" })
      
      const deliveryTime = new Date(now.getTime() + 45 * 60 * 1000)
      const order = {
        id: Date.now(),
        userId: user.nickName || 'anonymous',
        items: this.data.cartList,
        total: finalTotal,
        originalTotal: this.data.payTotal,
        discount: discountAmount,
        type: this.data.deliveryType,
        status: this.data.deliveryType === "pickup" ? "待取餐" : "待配送",
        orderStatus: this.data.deliveryType === "pickup" ? "制作中" : "待配送",
        pickupCode: this.data.deliveryType === "pickup" ? "T" + Math.floor(Math.random() * 900 + 100) : "",
        waitingCount: Math.floor(Math.random() * 50 + 5),
        waitingTime: Math.floor(Math.random() * 20 + 10) + "分钟",
        deliveryTime: deliveryTime.getHours().toString().padStart(2, '0') + ":" + deliveryTime.getMinutes().toString().padStart(2, '0'),
        createTime: now.toLocaleString(),
        remark: this.data.remark
      }
      const orders = wx.getStorageSync("orders") || []
      orders.unshift(order)
      wx.setStorageSync("orders", orders)
      
      wx.removeStorageSync("cart")
      wx.removeStorageSync("orderType")
      wx.switchTab({ url: "/pages/order/order" })
    }, 1000)
  }
})
