Page({
  data: {},
  onLoad() {
    console.log("集点活动页面加载")
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})