Page({
  data: {
    user: null,
    statusBarHeight: 44,
    showLogin: false,
    agreed: false,
    showWechatAccount: false,
    currentWechatUser: null,
    showPhoneLoginModal: false,
    isRegister: false,
    phone: '',
    password: '',
    confirmPassword: '',
    nickName: '',
    loginHistory: []
  },
  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 44 })
    this.loadUser()
    this.loadLoginHistory()
  },

  onShow() {
    this.loadUser()
  },

  loadUser() {
    const user = wx.getStorageSync("userInfo")
    if (user && user.coupons) {
      user.couponCount = user.coupons.filter(c => c.status === 'unused').length
    }
    this.setData({ user })
  },

  loadLoginHistory() {
    const history = wx.getStorageSync("loginHistory") || []
    this.setData({ loginHistory: history })
  },

  showLoginModal() {
    this.setData({ showLogin: true })
  },

  hideLoginModal() {
    this.setData({ showLogin: false })
  },

  toggleAgreement() {
    this.setData({ agreed: !this.data.agreed })
  },

  showWechatAccounts() {
    if (!this.data.agreed) {
      wx.showToast({ title: "请先阅读并同意用户协议", icon: "none" })
      return
    }
    this.setData({ showWechatAccount: true, currentWechatUser: null })
    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: (res) => {
        this.setData({ currentWechatUser: res.userInfo })
      },
      fail: () => {
        wx.showToast({ title: "获取微信账号信息失败", icon: "none" })
        this.setData({ showWechatAccount: false })
      }
    })
  },

  hideWechatAccount() {
    this.setData({ showWechatAccount: false })
  },

  confirmWechatLogin() {
    const userInfo = this.data.currentWechatUser
    if (!userInfo) {
      wx.showToast({ title: "请先选择微信账号", icon: "none" })
      return
    }
    wx.showLoading({ title: "登录中..." })
    setTimeout(() => {
      wx.hideLoading()
      const user = {
        uid: userInfo.nickName || 'wx_' + Date.now(),
        nickName: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        balance: 0,
        couponCount: 0,
        integral: 0,
        pointNum: 0
      }
      wx.setStorageSync("userInfo", user)
      this.setData({ user, showLogin: false, showWechatAccount: false })
      wx.showToast({ title: "登录成功", icon: "success" })
    }, 800)
  },

  switchWechatAccount() {
    this.setData({ currentWechatUser: null })
    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: (res) => {
        this.setData({ currentWechatUser: res.userInfo })
      },
      fail: () => {
        wx.showToast({ title: "获取微信账号信息失败", icon: "none" })
      }
    })
  },

  loginWechat() {
    this.showWechatAccounts()
  },

  showPhoneLogin() {
    if (!this.data.agreed) {
      wx.showToast({ title: "请先阅读并同意用户协议", icon: "none" })
      return
    }
    this.setData({ 
      showPhoneLoginModal: true, 
      isRegister: false,
      phone: '',
      password: '',
      confirmPassword: '',
      nickName: ''
    })
  },

  hidePhoneLoginModal() {
    this.setData({ showPhoneLoginModal: false })
  },

  stopPropagation() {
  },

  toggleAuthMode() {
    this.setData({ 
      isRegister: !this.data.isRegister,
      password: '',
      confirmPassword: ''
    })
  },

  onPhoneInput(e) {
    const value = e.detail.value.replace(/\D/g, '').slice(0, 11)
    this.setData({ phone: value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  onNickNameInput(e) {
    this.setData({ nickName: e.detail.value })
  },

  submitPhoneAuth() {
    const { isRegister, phone, password, confirmPassword, nickName } = this.data

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: "请输入正确的手机号", icon: "none" })
      return
    }

    if (password.length < 6) {
      wx.showToast({ title: "密码至少6位", icon: "none" })
      return
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        wx.showToast({ title: "两次密码不一致", icon: "none" })
        return
      }
      this.registerUser(phone, password, nickName)
    } else {
      this.loginUser(phone, password)
    }
  },

  registerUser(phone, password, nickName) {
    if (!nickName) {
      wx.showToast({ title: "请填写昵称", icon: "none" })
      return
    }
    
    wx.showLoading({ title: "注册中..." })
    wx.request({
      url: 'http://192.168.237.84/api/auth.php?action=register',
      method: 'POST',
      data: {
        phone,
        password,
        confirmPassword: password,
        nickName
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          let registeredUsers = wx.getStorageSync("registeredUsers") || []
          const existing = registeredUsers.find(u => u.phone === phone)
          if (!existing) {
            const memberId = 'VIP' + Date.now().toString().slice(-8) + Math.random().toString().slice(-4)
            const newUser = {
              phone,
              password: password,
              nickName,
              memberId,
              registerTime: new Date().toLocaleString(),
              integral: 0,
              balance: 0,
              coupons: [],
              couponCount: 0,
              pointNum: 0,
              avatar: ''
            }
            registeredUsers.push(newUser)
            wx.setStorageSync("registeredUsers", registeredUsers)
          }
          wx.showToast({ title: "注册成功", icon: "success" })
          this.setData({ isRegister: false, password: '', confirmPassword: '' })
        } else {
          wx.showToast({ title: res.data?.msg || "注册失败", icon: "none" })
        }
      },
      fail: () => {
        wx.hideLoading()
        this.doLocalRegister(phone, password, nickName)
      }
    })
  },

  doLocalRegister(phone, password, nickName) {
    let registeredUsers = wx.getStorageSync("registeredUsers") || []
    const existing = registeredUsers.find(u => u.phone === phone)
    if (existing) {
      wx.showToast({ title: "该账号已注册", icon: "none" })
      return
    }
    
    const memberId = 'VIP' + Date.now().toString().slice(-8) + Math.random().toString().slice(-4)
    const newUser = {
      phone,
      password: password,
      nickName,
      memberId,
      registerTime: new Date().toLocaleString(),
      integral: 0,
      balance: 0,
      coupons: [],
      couponCount: 0,
      pointNum: 0,
      avatar: ''
    }
    registeredUsers.push(newUser)
    wx.setStorageSync("registeredUsers", registeredUsers)
    
    wx.showToast({ title: "注册成功", icon: "success" })
    this.setData({ isRegister: false, password: '', confirmPassword: '' })
  },

  loginUser(phone, password) {
    wx.showLoading({ title: "登录中..." })
    wx.request({
      url: 'http://192.168.237.84/api/auth.php?action=login',
      method: 'POST',
      data: {
        phone,
        password
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode !== 200 || !res.data || !res.data.code) {
          this.doLocalLogin(phone, password)
          return
        }
        if (res.data.code === 200) {
          const userData = res.data.data
          const registeredUsers = wx.getStorageSync("registeredUsers") || []
          const savedUser = registeredUsers.find(u => u.phone === phone)
          const user = {
            uid: userData.uid || userData.phone || 'phone_' + Date.now(),
            nickName: userData.nickName || userData.nickname || 'Cocount用户',
            avatar: userData.avatar || (savedUser ? savedUser.avatar : '') || '',
            balance: userData.balance || (savedUser ? savedUser.balance : 0) || 0,
            couponCount: userData.couponCount || (savedUser ? savedUser.couponCount : 0) || 0,
            integral: userData.integral || (savedUser ? savedUser.integral : 0) || 0,
            pointNum: userData.pointNum || (savedUser ? savedUser.pointNum : 0) || 0,
            memberId: userData.memberId || '',
            phone: userData.phone || phone,
            registerTime: userData.registerTime || '',
            level: userData.level || '普通会员',
            coupons: savedUser ? savedUser.coupons || [] : [],
            balanceRecords: savedUser ? savedUser.balanceRecords || [] : []
          }
          wx.setStorageSync("userInfo", user)
          this.saveLoginHistory(user)
          this.setData({ user, showLogin: false, showPhoneLoginModal: false })
          wx.showToast({ title: "登录成功", icon: "success" })
        } else {
          if (res.data.code === 404) {
            wx.showToast({ title: "账号未注册", icon: "none" })
          } else if (res.data.code === 403) {
            wx.showToast({ title: "密码错误", icon: "none" })
          } else {
            wx.showToast({ title: res.data.msg || "登录失败", icon: "none" })
          }
        }
      },
      fail: () => {
        wx.hideLoading()
        this.doLocalLogin(phone, password)
      }
    })
  },

  doLocalLogin(phone, password) {
    const registeredUsers = wx.getStorageSync("registeredUsers") || []
    const user = registeredUsers.find(u => u.phone === phone)
    
    if (!user) {
      wx.showToast({ title: "账号未注册", icon: "none" })
      return
    }
    
    if (user.password !== password) {
      wx.showToast({ title: "密码错误", icon: "none" })
      return
    }
    
    const loginUser = {
      uid: user.memberId || 'phone_' + phone,
      nickName: user.nickName || 'Cocount用户',
      avatar: user.avatar || '',
      balance: user.balance || 0,
      couponCount: user.couponCount || 0,
      integral: user.integral || 0,
      pointNum: user.pointNum || 0,
      memberId: user.memberId || '',
      phone: user.phone,
      registerTime: user.registerTime || new Date().toLocaleString(),
      level: '普通会员',
      coupons: user.coupons || [],
      balanceRecords: user.balanceRecords || []
    }
    
    wx.setStorageSync("userInfo", loginUser)
    wx.removeStorageSync("selectedAddress")
    this.saveLoginHistory(loginUser)
    this.setData({ user: loginUser, showLogin: false, showPhoneLoginModal: false })
    wx.showToast({ title: "登录成功", icon: "success" })
  },

  doLoginSuccess(userData, phone) {
    const user = {
      uid: userData.uid || 'phone_' + phone,
      nickName: userData.nickName || 'Cocount用户',
      avatar: userData.avatar || '',
      balance: userData.balance || 0,
      couponCount: userData.couponCount || 0,
      integral: userData.integral || 0,
      pointNum: userData.pointNum || 0,
      memberId: userData.memberId || '',
      phone: phone,
      registerTime: userData.registerTime || new Date().toLocaleString(),
      level: userData.level || '普通会员',
      coupons: userData.coupons || []
    }
    wx.setStorageSync("userInfo", user)
    wx.removeStorageSync("selectedAddress")
    this.saveLoginHistory(user)
    this.setData({ user, showLogin: false, showPhoneLoginModal: false })
    wx.showToast({ title: "登录成功", icon: "success" })
  },

  saveLoginHistory(user) {
    let history = wx.getStorageSync("loginHistory") || []
    // 移除已存在的相同账号
    history = history.filter(h => h.phone !== user.phone)
    // 添加到历史记录开头
    history.unshift({
      phone: user.phone,
      nickName: user.nickName,
      avatar: user.avatar,
      lastLogin: new Date().toLocaleString()
    })
    // 最多保存10条记录
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    wx.setStorageSync("loginHistory", history)
    this.setData({ loginHistory: history })
  },

  logout() {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          const currentUser = wx.getStorageSync("userInfo") || {}
          if (currentUser.phone) {
            let registeredUsers = wx.getStorageSync("registeredUsers") || []
            const index = registeredUsers.findIndex(u => u.phone === currentUser.phone)
            if (index !== -1) {
              registeredUsers[index].integral = currentUser.integral || 0
              registeredUsers[index].balance = currentUser.balance || 0
              registeredUsers[index].coupons = currentUser.coupons || []
              registeredUsers[index].couponCount = currentUser.couponCount || 0
              registeredUsers[index].pointNum = currentUser.pointNum || 0
              registeredUsers[index].avatar = currentUser.avatar || ''
              registeredUsers[index].balanceRecords = currentUser.balanceRecords || []
              wx.setStorageSync("registeredUsers", registeredUsers)
            }
          }
          wx.removeStorageSync("userInfo")
          wx.removeStorageSync("selectedAddress")
          this.setData({ user: null })
          wx.showToast({ title: "已退出登录", icon: "success" })
        }
      }
    })
  },

  loginPhone() {
    if (!this.data.agreed) {
      wx.showToast({ title: "请先阅读并同意用户协议", icon: "none" })
      return
    }
    wx.showModal({
      title: "手机号登录",
      editable: true,
      placeholderText: "请输入手机号",
      success: (res) => {
        if (res.confirm && res.content && res.content.length === 11) {
          wx.showLoading({ title: "登录中..." })
          setTimeout(() => {
            wx.hideLoading()
            const user = {
              nickName: "Cocount用户",
              balance: 0,
              couponCount: 0,
              integral: 0,
              pointNum: 0
            }
            wx.setStorageSync("userInfo", user)
            this.setData({ user, showLogin: false })
            wx.showToast({ title: "登录成功", icon: "success" })
          }, 800)
        } else if (res.confirm) {
          wx.showToast({ title: "请输入正确的手机号", icon: "none" })
        }
      }
    })
  },

  goToOrders() {
    this.checkLogin(() => {
      wx.switchTab({ url: "/pages/order/order" })
    })
  },

  goToProfile() {
    this.checkLogin(() => {
      wx.navigateTo({ url: "/pages/user/profile/profile" })
    })
  },

  goToService() {
    wx.showToast({ title: "客服中心开发中", icon: "none" })
  },

  goToAddress() {
    this.checkLogin(() => {
      wx.navigateTo({ url: "/pages/user/address/address" })
    })
  },

  goToRecharge() {
    this.checkLogin(() => {
      wx.navigateTo({ url: "/pages/user/recharge/recharge" })
    })
  },

  goToCoupon() {
    this.checkLogin(() => {
      wx.navigateTo({ url: "/pages/user/coupon/coupon" })
    })
  },

  goToIntegral() {
    this.checkLogin(() => {
      wx.navigateTo({ url: "/pages/user/integral/integral" })
    })
  },

  checkLogin(callback) {
    const user = wx.getStorageSync("userInfo")
    if (!user) {
      wx.showModal({
        title: "提示",
        content: "请先登录后再进行操作",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            this.setData({ showLogin: true })
          }
        }
      })
      return false
    }
    callback && callback()
    return true
  }
})
