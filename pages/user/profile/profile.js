Page({
  data: {
    user: {},
    showEdit: false,
    editForm: {
      nickName: '',
      phone: '',
      avatar: ''
    }
  },
  onLoad() {
    const user = wx.getStorageSync("userInfo") || {}
    this.setData({ user })
  },

  editProfile() {
    const { user } = this.data
    this.setData({
      showEdit: true,
      editForm: {
        nickName: user.nickName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      }
    })
  },

  hideEditModal() {
    this.setData({ showEdit: false })
  },

  stopPropagation() {},

  inputNickName(e) {
    this.setData({
      'editForm.nickName': e.detail.value
    })
  },

  inputPhone(e) {
    this.setData({
      'editForm.phone': e.detail.value
    })
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          'editForm.avatar': tempFilePath
        })
        this.uploadAvatar(tempFilePath)
      }
    })
  },

  uploadAvatar(filePath) {
    const user = wx.getStorageSync("userInfo") || {}
    const uid = user.uid || 0
    
    wx.showLoading({ title: "上传中..." })
    wx.uploadFile({
      url: 'http://192.168.237.84/api/upload.php',
      filePath: filePath,
      name: 'avatar',
      formData: { uid: uid },
      success: (res) => {
        wx.hideLoading()
        const result = JSON.parse(res.data)
        if (result.code === 200) {
          this.setData({
            'editForm.avatar': result.data.avatar
          })
          const updatedUser = { ...this.data.user, avatar: result.data.avatar }
          wx.setStorageSync("userInfo", updatedUser)
          this.setData({ user: updatedUser })
          wx.showToast({ title: "上传成功", icon: "success" })
        } else {
          wx.showToast({ title: result.msg, icon: "none" })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: "上传失败", icon: "none" })
      }
    })
  },

  saveProfile() {
    const { editForm, user } = this.data
    if (!editForm.nickName.trim()) {
      wx.showToast({ title: "请输入昵称", icon: "none" })
      return
    }
    const updatedUser = { ...user, ...editForm }
    wx.setStorageSync("userInfo", updatedUser)
    
    let registeredUsers = wx.getStorageSync("registeredUsers") || []
    const index = registeredUsers.findIndex(u => u.phone === updatedUser.phone)
    if (index !== -1) {
      registeredUsers[index].nickName = updatedUser.nickName || ''
      registeredUsers[index].avatar = updatedUser.avatar || ''
      wx.setStorageSync("registeredUsers", registeredUsers)
    }
    
    this.setData({ user: updatedUser, showEdit: false })
    wx.showToast({ title: "保存成功", icon: "success" })
  },

  goToAddress() {
    wx.showToast({ title: "地址管理开发中", icon: "none" })
  },

  goToCoupon() {
    wx.navigateTo({ url: "/pages/user/coupon/coupon" })
  },

  goToIntegral() {
    wx.navigateTo({ url: "/pages/user/integral/integral" })
  },

  goToRecharge() {
    wx.navigateTo({ url: "/pages/user/recharge/recharge" })
  }
})