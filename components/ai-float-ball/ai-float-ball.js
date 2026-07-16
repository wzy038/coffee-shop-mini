Component({
  data: {
    ballLeft: 600,
    ballTop: 500,
    startX: 0,
    startY: 0,
    ballStartX: 0,
    ballStartY: 0,
    isDragging: false,
    screenWidth: 0,
    screenHeight: 0
  },

  lifetimes: {
    attached: function() {
      const sysInfo = wx.getSystemInfoSync()
      this.setData({
        screenWidth: sysInfo.windowWidth,
        screenHeight: sysInfo.windowHeight,
        ballLeft: sysInfo.windowWidth - 80,
        ballTop: sysInfo.windowHeight * 0.6
      })
    }
  },

  methods: {
    onTouchStart: function(e) {
      const touch = e.touches[0]
      this.setData({
        startX: touch.clientX,
        startY: touch.clientY,
        ballStartX: this.data.ballLeft,
        ballStartY: this.data.ballTop,
        isDragging: false
      })
    },

    onTouchMove: function(e) {
      const touch = e.touches[0]
      const deltaX = touch.clientX - this.data.startX
      const deltaY = touch.clientY - this.data.startY
      
      let newLeft = this.data.ballStartX + deltaX
      let newTop = this.data.ballStartY + deltaY

      const ballSize = 32
      newLeft = Math.max(0, Math.min(this.data.screenWidth - ballSize * 2, newLeft))
      newTop = Math.max(0, Math.min(this.data.screenHeight - ballSize * 2, newTop))

      this.setData({
        ballLeft: newLeft,
        ballTop: newTop,
        isDragging: true
      })
    },

    onTouchEnd: function(e) {
      if (!this.data.isDragging) {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const cartData = currentPage.data.cart || []
        
        wx.navigateTo({
          url: `/pages/ai-drink-recommend/ai-drink-recommend?cart=${encodeURIComponent(JSON.stringify(cartData))}`
        })
        return
      }

      let newLeft = this.data.ballLeft
      const screenCenter = this.data.screenWidth / 2

      if (newLeft < screenCenter) {
        newLeft = 10
      } else {
        newLeft = this.data.screenWidth - 74
      }

      this.setData({
        ballLeft: newLeft,
        isDragging: false
      })
    }
  }
})