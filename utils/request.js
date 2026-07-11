// ===== wx.request 请求已禁用，纯前端模式 =====
// const baseUrl = "http://localhost:8080"

// function request(url, data = {}, method = "GET") {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: baseUrl + url,
//       data: data,
//       method: method,
//       header: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       },
//       success(res) {
//         if (res.data.code === 200) {
//           resolve(res.data)
//         } else {
//           wx.showToast({ title: res.data.msg, icon: "none" })
//           reject(res.data)
//         }
//       },
//       fail() {
//         wx.showToast({ title: "接口请求超时", icon: "none" })
//         reject()
//       }
//     })
//   })
// }

module.exports = {
  // request // 已禁用
}