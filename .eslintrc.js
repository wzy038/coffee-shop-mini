// utils/request.js
const baseUrl = "http://localhost:8080";

export default function request(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          uni.showToast({ title: res.data.msg, icon: "none" });
          reject(res.data);
        }
      },
      fail: () => {
        uni.showToast({ title: "连接后端失败，请检查服务是否启动", icon: "none" });
        reject();
      }
    })
  })
}