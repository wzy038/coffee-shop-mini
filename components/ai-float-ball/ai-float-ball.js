Component({
  data: {
    ballStyle: {
      left: 580,
      top: 1200
    },
    startX: 0,
    startY: 0,
    ballLeft: 580,
    ballTop: 1200
  },

  attached() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({
      screenWidth: sysInfo.windowWidth,
      screenHeight: sysInfo.windowHeight,
      ballStyle: {
        left: sysInfo.windowWidth - 80,
        top: sysInfo.windowHeight - 200
      },
      ballLeft: sysInfo.windowWidth - 80,
      ballTop: sysInfo.windowHeight - 200
    })
  },

  methods: {
    onTouchStart(e) {
      const touch = e.touches[0]
      this.setData({
        startX: touch.clientX,
        startY: touch.clientY,
        isDragging: false
      })
    },

    onTouchMove(e) {
      const touch = e.touches[0]
      const deltaX = touch.clientX - this.data.startX
      const deltaY = touch.clientY - this.data.startY
      
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        this.setData({ isDragging: true })
      }
      
      let newLeft = this.data.ballLeft + deltaX
      let newTop = this.data.ballTop + deltaY
      
      const ballWidth = 64
      const ballHeight = 64
      
      if (newLeft < 0) newLeft = 0
      if (newLeft > this.data.screenWidth - ballWidth) newLeft = this.data.screenWidth - ballWidth
      if (newTop < 0) newTop = 0
      if (newTop > this.data.screenHeight - ballHeight) newTop = this.data.screenHeight - ballHeight
      
      this.setData({
        ballStyle: {
          left: newLeft,
          top: newTop
        },
        ballLeft: newLeft,
        ballTop: newTop
      })
    },

    onTouchEnd() {
      if (!this.data.isDragging) {
        wx.navigateTo({
          url: '/pages/ai-drink-recommend/ai-drink-recommend'
        })
        return
      }
      
      let newLeft = this.data.ballLeft
      const screenWidth = this.data.screenWidth
      
      if (newLeft > screenWidth / 2) {
        newLeft = screenWidth - 64
      } else {
        newLeft = 0
      }
      
      this.setData({
        ballStyle: {
          left: newLeft,
          top: this.data.ballTop
        },
        ballLeft: newLeft,
        isDragging: false
      })
    }
  }
})
