Page({
  data: {
    balance: 0,
    availableBalance: 0,
    frozenBalance: 0,
    showModal: false,
    showDetailModal: false,
    money: "",
    giftAmount: 0,
    quickAmounts: [20, 50, 100, 200],
    balanceRecords: []
  },
  onLoad() {
    this.loadBalance()
  },
  loadBalance() {
    const user = wx.getStorageSync("userInfo") || {}
    const balance = user.balance || 0
    this.setData({
      balance: balance,
      availableBalance: balance,
      frozenBalance: 0
    })
  },
  showRechargeModal() {
    this.setData({ showModal: true, money: "" })
  },
  hideRechargeModal() {
    this.setData({ showModal: false })
  },
  showDetail() {
    this.loadBalanceRecords()
    this.setData({ showDetailModal: true })
  },
  hideDetailModal() {
    this.setData({ showDetailModal: false })
  },
  loadBalanceRecords() {
    const user = wx.getStorageSync("userInfo") || {}
    const records = user.balanceRecords || []
    this.setData({ balanceRecords: records })
  },
  preventClose() {},
  inputMoney(e) {
    this.setData({ money: e.detail.value })
  },
  selectAmount(e) {
    this.setData({ money: e.currentTarget.dataset.amount })
  },
  selectOption(e) {
    const amount = e.currentTarget.dataset.amount
    const gift = e.currentTarget.dataset.gift
    const giftAmount = gift ? parseInt(gift) : 0
    if (giftAmount > 0) {
      wx.showModal({
        title: '充值优惠',
        content: `充值¥${amount}，赠送¥${gift}，实际到账¥${parseInt(amount) + giftAmount}`,
        confirmText: '确认充值',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.setData({ money: amount, giftAmount: giftAmount })
            this.showRechargeModal()
          }
        }
      })
    } else {
      this.setData({ money: amount, giftAmount: 0 })
      this.showRechargeModal()
    }
  },
  confirmRecharge() {
    const money = parseFloat(this.data.money)
    const giftAmount = this.data.giftAmount || 0
    if (!money || money <= 0) {
      wx.showToast({ title: "请输入有效金额", icon: "none" })
      return
    }
    
    let user = wx.getStorageSync("userInfo") || {}
    const oldBalance = user.balance || 0
    const totalAmount = money + giftAmount
    user.balance = oldBalance + totalAmount
    
    if (!user.balanceRecords) {
      user.balanceRecords = []
    }
    
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    const recordType = giftAmount > 0 ? `余额充值(赠¥${giftAmount})` : '余额充值'
    
    user.balanceRecords.unshift({
      id: Date.now(),
      type: 'income',
      typeName: recordType,
      amount: totalAmount,
      time: timeStr,
      beforeBalance: oldBalance,
      afterBalance: user.balance
    })
    
    wx.setStorageSync("userInfo", user)
    
    let registeredUsers = wx.getStorageSync("registeredUsers") || []
    const index = registeredUsers.findIndex(u => u.phone === user.phone)
    if (index !== -1) {
      registeredUsers[index].balance = user.balance || 0
      registeredUsers[index].balanceRecords = user.balanceRecords || []
      wx.setStorageSync("registeredUsers", registeredUsers)
    }
    
    this.loadBalance()
    this.hideRechargeModal()
    
    if (giftAmount > 0) {
      wx.showToast({ title: `充值成功，到账¥${totalAmount}元(含赠¥${giftAmount})`, icon: "success" })
    } else {
      wx.showToast({ title: `充值成功，余额+${money}元`, icon: "success" })
    }
  }
})
