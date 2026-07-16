const API_BASE = 'http://localhost:5000/api'

Page({
  data: {
    messages: [],
    inputValue: '',
    scrollToId: '',
    cartData: []
  },

  onLoad: function(options) {
    if (options.cart) {
      try {
        this.setData({
          cartData: JSON.parse(decodeURIComponent(options.cart))
        })
      } catch (e) {
        console.error('解析购物车数据失败:', e)
      }
    }

    const savedMessages = wx.getStorageSync('ai_drink_messages')
    if (savedMessages && savedMessages.length > 0) {
      this.setData({
        messages: savedMessages
      })
    }
  },

  onInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  sendMessage: function() {
    const inputValue = this.data.inputValue.trim()
    if (!inputValue) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      cartItems: this.data.cartData
    }

    const newMessages = [...this.data.messages, userMessage]
    this.setData({
      messages: newMessages,
      inputValue: '',
      scrollToId: `msg-${userMessage.id}`
    })

    this.saveMessages()
    this.requestAIRecommend(inputValue)
  },

  requestAIRecommend: function(message) {
    wx.showLoading({
      title: 'AI思考中...'
    })

    const cartItems = this.data.cartData.map(item => ({
      product_id: item.product_id || item.id,
      name: item.name,
      price: item.price
    }))

    wx.request({
      url: `${API_BASE}/ai/recommend`,
      method: 'POST',
      data: {
        message: message,
        cart_items: cartItems
      },
      timeout: 5000,
      success: (res) => {
        wx.hideLoading()
        if (res.data && res.data.code === 200) {
          this.handleAIResponse(res.data.data)
        } else {
          this.showErrorResponse(res.data.message || 'AI服务暂时不可用')
        }
      },
      fail: (err) => {
        wx.hideLoading()
        this.showErrorResponse('网络请求失败，请稍后重试')
      }
    })
  },

  handleAIResponse: function(data) {
    let responseText = ''
    
    if (data.recommendations && data.recommendations.length > 0) {
      responseText = '为你推荐以下饮品：'
    } else {
      responseText = '抱歉，没有找到适合的饮品推荐。'
    }

    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: responseText,
      recommendations: data.recommendations || [],
      pairing_suggestion: data.pairing_suggestion,
      total_savings: data.total_savings
    }

    const newMessages = [...this.data.messages, aiMessage]
    this.setData({
      messages: newMessages,
      scrollToId: `msg-${aiMessage.id}`
    })

    this.saveMessages()
  },

  showErrorResponse: function(message) {
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: message,
      recommendations: []
    }

    const newMessages = [...this.data.messages, aiMessage]
    this.setData({
      messages: newMessages,
      scrollToId: `msg-${aiMessage.id}`
    })

    this.saveMessages()
  },

  saveMessages: function() {
    wx.setStorageSync('ai_drink_messages', this.data.messages)
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  }
})