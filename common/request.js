const isProduction = false

const baseUrl = isProduction 
  ? "https://coffee-mini-api.onrender.com" 
  : "http://192.168.1.100:5000"

export function request(url, data = {}, method = "GET") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: method,
            data: data,
            header: {
                "Content-Type": "application/json"
            },
            timeout: 10000,
            success: (res) => {
                if (res.statusCode === 200) {
                    if (res.data.code === 200) {
                        resolve(res.data)
                    } else {
                        wx.showToast({ title: res.data.message || "请求失败", icon: "none" })
                        reject(res.data)
                    }
                } else {
                    wx.showToast({ title: `HTTP错误: ${res.statusCode}`, icon: "none" })
                    reject(res)
                }
            },
            fail: (err) => {
                wx.showToast({ title: "网络连接失败，请检查网络", icon: "none" })
                reject(err)
            }
        })
    })
}

export default request
