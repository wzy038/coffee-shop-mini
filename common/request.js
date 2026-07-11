// 后端基础地址，本地调试用localhost
const baseUrl = "http://localhost:8080"

/**
 * 通用请求封装
 * @param {String} url 接口路径
 * @param {Object} data 请求参数
 * @param {String} method 请求方式 GET/POST
 * @returns Promise
 */
export function request(url, data = {}, method = "GET") {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            method: method,
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (res) => {
                resolve(res.data)
            },
            fail: (err) => {
                uni.showToast({
                    title: "网络请求失败",
                    icon: "none"
                })
                reject(err)
            }
        })
    })
}