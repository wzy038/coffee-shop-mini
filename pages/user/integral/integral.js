Page({
  data: {
    userPoint: 0,
    currentTab: 'coupon',
    dessertList: [
      {
        id: 101,
        name: '羽衣甘蓝华夫饼',
        point: 160,
        image: '/static/images/c1.png',
        goodsId: 1,
        goodsPrice: 16
      },
      {
        id: 102,
        name: '黑芝麻酸奶杯',
        point: 180,
        image: '/static/images/c2.png',
        goodsId: 2,
        goodsPrice: 18
      },
      {
        id: 103,
        name: '黑金冰酪三明治',
        point: 40,
        image: '/static/images/c3.png',
        goodsId: 3,
        goodsPrice: 4
      }
    ],
    couponList: [
      {
        id: 201,
        name: '满18减1',
        point: 50,
        image: '/pages/user/integral/static/images/w4.png',
        minAmount: 18,
        discount: 1
      },
      {
        id: 202,
        name: '满20减2',
        point: 80,
        image: '/pages/user/integral/static/images/w3.png',
        minAmount: 20,
        discount: 2
      },
      {
        id: 203,
        name: '满88减15',
        point: 150,
        image: '/pages/user/integral/static/images/w2.png',
        minAmount: 88,
        discount: 15
      },
      {
        id: 204,
        name: '满50减10',
        point: 100,
        image: '/pages/user/integral/static/images/w1.png',
        minAmount: 50,
        discount: 10
      }
    ],
    peripheralList: [
      {
        id: 301,
        name: '品牌马克杯',
        point: 5,
        image: '/pages/around/static/images/makebie.jpg'
      },
      {
        id: 302,
        name: '苹果杯',
        point: 750,
        image: '/pages/around/static/images/pingguo.jpg'
      },
      {
        id: 303,
        name: '小猫靠枕',
        point: 1080,
        image: '/pages/around/static/images/kz.jpg'
      },
      {
        id: 304,
        name: '小猫抱枕',
        point: 880,
        image: '/pages/around/static/images/bz.jpg'
      },
      {
        id: 305,
        name: '冰箱贴',
        point: 280,
        image: '/pages/around/static/images/bxt.jpg'
      },
      {
        id: 306,
        name: '咖啡渣笔记本',
        point: 420,
        image: '/pages/around/static/images/bjb.jpg'
      }
    ]
  },

  onLoad() {
    this.loadUserPoint()
  },

  onShow() {
    this.loadUserPoint()
  },

  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab })
  },

  loadUserPoint() {
    const user = wx.getStorageSync("userInfo") || {}
    const orders = wx.getStorageSync("orders") || []
    
    let earnedFromOrders = 0
    orders.forEach(order => {
      if (order.status === "已完成") {
        earnedFromOrders += order.total || 0
      }
    })
    
    const savedPoint = user.integral || 0
    const actualPoint = savedPoint > 0 ? savedPoint : earnedFromOrders
    
    if (actualPoint !== savedPoint) {
      user.integral = actualPoint
      wx.setStorageSync("userInfo", user)
    }
    
    this.setData({ userPoint: actualPoint })
  },

  exchangeGoods(e) {
    const item = e.currentTarget.dataset.item
    const { userPoint, currentTab } = this.data

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
            
            if (!user.coupons) {
              user.coupons = []
            }
            
            const couponItem = {
              id: Date.now(),
              originalId: item.id,
              name: item.name,
              point: item.point,
              image: item.image,
              status: 'unused',
              exchangeTime: Date.now(),
              couponType: currentTab,
              minAmount: item.minAmount || 0,
              discount: item.discount || 0,
              goodsId: item.goodsId || 0,
              goodsPrice: item.goodsPrice || 0
            }
            user.coupons.push(couponItem)
            user.couponCount = user.coupons.filter(c => c.status === 'unused').length
            
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
              wx.setStorageSync("registeredUsers", registeredUsers)
            }
            
            wx.showToast({ title: '兑换成功', icon: 'success' })
          }
        }
      })
    } else {
      wx.showToast({ title: '积分不足', icon: 'none' })
    }
  }
})