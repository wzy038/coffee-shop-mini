// const { request } = require("../../utils/request.js") // 已禁用后端请求
const QR = require("../../utils/qrcode.js")
Page({
  data: {
    balance: 0,
    integral: 0,
    couponCount: 0,
    showMemberCode: false,
    userInfo: {},
    qrcodeReady: false,
    statusBarHeight: 44
  },
  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 44 })
  },
  onShow() {
    this.loadUserInfo()
  },
  loadUserInfo() {
    const user = wx.getStorageSync("userInfo") || {}
    this.setData({
      balance: user.balance || 0,
      integral: user.integral || 0,
      couponCount: user.couponCount || 0
    })
  },
  goOrder() {
    wx.navigateTo({ 
      url: "/pages/goods/goods" 
    })
  },
  goTakeaway() {
    wx.navigateTo({ url: "/pages/takeaway/takeaway" })
  },
  goCoupon() {
    wx.navigateTo({ url: "/pages/user/coupon/coupon" })
  },
  goRecharge() {
    wx.navigateTo({ url: "/pages/user/recharge/recharge" })
  },
  goIntegral() {
    wx.navigateTo({ url: "/pages/user/integral/integral" })
  },
  goPoint() {
    wx.navigateTo({ url: "/pages/user/point/point" })
  },
  goMine() {
    wx.switchTab({ url: "/pages/mine/mine" })
  },
  goBalance() {
    wx.navigateTo({ url: "/pages/user/recharge/recharge" })
  },
  goMemberCode() {
    const user = wx.getStorageSync("userInfo") || {}
    console.log('goMemberCode called, user:', user)
    this.setData({ 
      showMemberCode: true,
      userInfo: user,
      qrcodeReady: false
    })
    setTimeout(() => {
      console.log('Calling generateQRCode after delay')
      this.generateQRCode()
    }, 500)
  },
  closeMemberCode() {
    this.setData({ showMemberCode: false })
  },
  preventClose() {},
  generateQRCode() {
    const user = wx.getStorageSync("userInfo") || {}
    const qrText = `Cocount://member/${user.phone || user.uid || 'guest'}`
    console.log('Generating QR code for:', qrText)
    
    wx.showLoading({ title: '生成中...' })
    
    try {
      const qr = QR.create(qrText)
      console.log('QR data created, size:', qr.size)
      
      console.log('Top-left finder:', qr.modules[0][0], qr.modules[3][3], qr.modules[6][6])
      console.log('Top-right finder:', qr.modules[0][14], qr.modules[3][17], qr.modules[6][20])
      console.log('Bottom-left finder:', qr.modules[14][0], qr.modules[17][3], qr.modules[20][6])
      
      const ctx = wx.createCanvasContext('qrcodeCanvas')
      QR.draw(qr, ctx, 500)
      
      ctx.draw(false, () => {
        wx.hideLoading()
        this.setData({ qrcodeReady: true })
        console.log('QR code drawn successfully')
      })
    } catch (e) {
      console.error('QR generation failed:', e)
      wx.hideLoading()
      this.drawSimpleQR()
    }
  },
  drawSimpleQR() {
    const ctx = wx.createCanvasContext('qrcodeCanvas')
    const size = 240
    const cell = size / 21
    
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, size, size)
    ctx.setFillStyle('#000000')
    
    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        const x = c * cell
        const y = r * cell
        
        if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) {
          if ((r < 6 && c < 6) || (r < 6 && c > 14) || (r > 14 && c < 6)) {
            if (!((r > 1 && r < 5 && c > 1 && c < 5))) ctx.fillRect(x, y, cell, cell)
          } else if (r === 6 || c === 6) ctx.fillRect(x, y, cell, cell)
        } else if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) ctx.fillRect(x, y, cell, cell)
        } else {
          const hash = (r * 21 + c) * 9973
          if (hash % 3 === 0) ctx.fillRect(x, y, cell, cell)
        }
      }
    }
    
    ctx.draw(() => {
      this.setData({ qrcodeReady: true })
    })
  }
})