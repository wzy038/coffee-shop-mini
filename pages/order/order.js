Page({
  data: {
    activeTab: 'all',
    orderList: [],
    allOrders: [],
    statusBarHeight: 44
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 44 })
  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo") || {}
    const currentUserId = userInfo.nickName || 'anonymous'
    const allOrders = wx.getStorageSync("orders") || []
    const orders = allOrders.filter(order => order.userId === currentUserId)
    this.setData({
      allOrders: orders,
      orderList: orders
    })
    this.filterOrders()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
    this.filterOrders()
  },

  filterOrders() {
    const { activeTab, allOrders } = this.data
    let list = []
    if (activeTab === 'all') {
      list = allOrders
    } else if (activeTab === 'pending') {
      list = allOrders.filter(item => item.status === '待取餐' || item.status === '待配送')
    } else if (activeTab === 'done') {
      list = allOrders.filter(item => item.status === '已完成')
    }
    this.setData({ orderList: list })
  },

  goOrder() {
    wx.switchTab({ url: "/pages/goods/goods" })
  },

  handleOrder(e) {
    const id = e.currentTarget.dataset.id
    const order = this.data.allOrders.find(item => item.id === id)
    if (order.status === '待取餐') {
      order.status = '已完成'
      const allOrdersCache = wx.getStorageSync("orders") || []
      const orders = allOrdersCache.map(item => item.id === id ? order : item)
      wx.setStorageSync("orders", orders)
      const userInfo = wx.getStorageSync("userInfo") || {}
      const currentUserId = userInfo.nickName || 'anonymous'
      this.setData({ allOrders: orders.filter(o => o.userId === currentUserId) })
      this.filterOrders()
      wx.showToast({ title: "已完成取餐", icon: "success" })
    } else if (order.status === '待配送') {
      order.status = '已完成'
      order.orderStatus = '已送达'
      const allOrdersCache = wx.getStorageSync("orders") || []
      const orders = allOrdersCache.map(item => item.id === id ? order : item)
      wx.setStorageSync("orders", orders)
      const userInfo = wx.getStorageSync("userInfo") || {}
      const currentUserId = userInfo.nickName || 'anonymous'
      this.setData({ allOrders: orders.filter(o => o.userId === currentUserId) })
      this.filterOrders()
      wx.showToast({ title: "已确认送达", icon: "success" })
    } else {
      wx.switchTab({ url: "/pages/goods/goods" })
    }
  },

  contactShop() {
    wx.showToast({ title: "联系门店功能开发中", icon: "none" })
  },

  applyRefund(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: "申请退款",
      content: "确定要申请退款吗？",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: "退款申请已提交", icon: "success" })
        }
      }
    })
  }
})
