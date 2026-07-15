Page({
  data: {
    statusBarHeight: 44,
    bannerList: [
      {
        id: 1,
        image: '/pages/around/static/images/t1.jpg'
      },
      {
        id: 2,
        image: '/pages/around/static/images/t2.jpg'
      },
      {
        id: 3,
        image: '/pages/around/static/images/t3.jpg'
      }
    ],
    goodsList: [
      {
        id: 1,
        name: '黄油可颂马克杯',
        price: 28,
        point: 300,
        image: '/pages/around/static/images/makebie.jpg'
      },
      {
        id: 2,
        name: '冰箱贴',
        price: 22,
        point: 180,
        image: '/pages/around/static/images/bxt.jpg'
      },
      {
        id: 3,
        name: '苹果杯',
        price: 40,
        point: 500,
        image: '/pages/around/static/images/pingguo.jpg'
      },
      {
        id: 4,
        name: '咖啡渣笔记本',
        price: 58,
        point: 680,
        image: '/pages/around/static/images/bjb.jpg'
      },
      {
        id: 5,
        name: '小猫靠枕',
        price: 128,
        point: 1330,
        image: '/pages/around/static/images/kz.jpg'
      },
      {
        id: 6,
        name: '小猫抱枕',
        price: 98,
        point: 998,
        image: '/pages/around/static/images/bz.jpg'
      }
    ],
    userPoint: 0,
    userBalance: 0,
    showPayModal: false,
    payType: 'balance',
    currentGoods: null
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 44 })
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    const user = wx.getStorageSync("userInfo") || {}
    this.setData({ 
      userPoint: user.integral || 0,
      userBalance: user.balance || 0
    })
  },

  buyGoods(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      currentGoods: item,
      showPayModal: true,
      payType: 'balance'
    })
  },

  closePayModal() {
    this.setData({ showPayModal: false })
  },

  stopPropagation() {},

  selectPayType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ payType: type })
  },

  confirmPay() {
    const { currentGoods, payType, userBalance } = this.data
    if (!currentGoods) return

    const price = currentGoods.price
    const user = wx.getStorageSync("userInfo") || {}

    if (payType === 'balance') {
      if (userBalance < price) {
        wx.showModal({
          title: '余额不足',
          content: `当前余额¥${userBalance}，支付金额¥${price}，还差¥${price - userBalance}`,
          showCancel: false
        })
        return
      }

      wx.showModal({
        title: '支付确认',
        content: `确定使用余额支付¥${price}购买"${currentGoods.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            user.balance = (user.balance || 0) - price
            if (!user.balanceRecords) {
              user.balanceRecords = []
            }
            user.balanceRecords.unshift({
              id: Date.now(),
              type: '周边购买',
              amount: -price,
              date: new Date().toLocaleString(),
              afterBalance: user.balance
            })
            wx.setStorageSync("userInfo", user)
            
            const registeredUsers = wx.getStorageSync("registeredUsers") || []
            const index = registeredUsers.findIndex(u => u.phone === user.phone)
            if (index !== -1) {
              registeredUsers[index].balance = user.balance
              registeredUsers[index].balanceRecords = user.balanceRecords
              wx.setStorageSync("registeredUsers", registeredUsers)
            }

            this.createOrder(currentGoods, price, '余额支付')

            this.setData({ 
              showPayModal: false,
              userBalance: user.balance
            })
            wx.showToast({ title: '购买成功', icon: 'success' })
          }
        }
      })
    } else {
      wx.showModal({
        title: '支付确认',
        content: `确定使用微信支付¥${price}购买"${currentGoods.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({ title: '支付中...' })
            setTimeout(() => {
              wx.hideLoading()
              this.createOrder(currentGoods, price, '微信支付')
              this.setData({ showPayModal: false })
              wx.showToast({ title: '购买成功', icon: 'success' })
            }, 1500)
          }
        }
      })
    }
  },

  createOrder(goods, price, payType) {
    const user = wx.getStorageSync("userInfo") || {}
    const userId = user.nickName || 'anonymous'
    
    const order = {
      id: Date.now().toString().slice(-12),
      userId: userId,
      type: 'periphery',
      status: '已完成',
      orderStatus: '已购买',
      payType: payType,
      createTime: new Date().toLocaleString(),
      items: [{
        id: goods.id,
        name: goods.name,
        price: goods.price,
        img: goods.image,
        num: 1,
        spec: '周边商品'
      }],
      total: price
    }

    const allOrders = wx.getStorageSync("orders") || []
    allOrders.unshift(order)
    wx.setStorageSync("orders", allOrders)
  },

  exchangeGoods(e) {
    const item = e.currentTarget.dataset.item
    const { userPoint } = this.data

    if (userPoint >= item.point) {
      wx.showModal({
        title: '兑换确认',
        content: `确定消耗${item.point}积分兑换"${item.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            const newPoint = userPoint - item.point
            this.setData({ userPoint: newPoint })
            const user = wx.getStorageSync("userInfo") || {}
            user.integral = newPoint
            wx.setStorageSync("userInfo", user)
            wx.showToast({ title: '兑换成功', icon: 'success' })
          }
        }
      })
    } else {
      wx.showToast({ title: '积分不足', icon: 'none' })
    }
  }
})