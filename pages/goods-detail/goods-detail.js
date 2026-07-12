Page({
  data: {
    goods: {},
    selectedSize: 'large',
    selectedTemp: 'ice',
    selectedBean: 'italian',
    selectedConcentration: 'normal',
    selectedSugar: 'none',
    quantity: 1,
    finalPrice: 0
  },

  onLoad(options) {
    const goodsData = JSON.parse(decodeURIComponent(options.goods))
    this.setData({
      goods: goodsData,
      finalPrice: goodsData.price
    })
  },

  goBack() {
    wx.showTabBar()
    wx.navigateBack()
  },

  saveTaste() {
    wx.showToast({ title: "已保存口味", icon: "success" })
  },

  selectSize(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedSize: value })
    this.calcPrice()
  },

  selectTemp(e) {
    this.setData({ selectedTemp: e.currentTarget.dataset.value })
  },

  selectBean(e) {
    this.setData({ selectedBean: e.currentTarget.dataset.value })
  },

  selectConcentration(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedConcentration: value })
    this.calcPrice()
  },

  selectSugar(e) {
    this.setData({ selectedSugar: e.currentTarget.dataset.value })
  },

  calcPrice() {
    let price = this.data.goods.price
    if (this.data.selectedSize === 'xlarge') {
      price += 3
    }
    if (this.data.selectedConcentration === 'extra') {
      price += 3
    }
    this.setData({ finalPrice: price })
  },

  plus() {
    this.setData({ quantity: this.data.quantity + 1 })
  },

  minus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 })
    }
  },

  addToCart() {
    const goods = {
      id: this.data.goods.id,
      name: this.data.goods.name,
      price: this.data.finalPrice,
      img: this.data.goods.img,
      num: this.data.quantity,
      spec: this.getSpecText()
    }
    
    let cart = wx.getStorageSync("cart") || []
    const existIndex = cart.findIndex(item => item.id === goods.id)
    if (existIndex !== -1) {
      cart[existIndex].num += goods.num
    } else {
      cart.push(goods)
    }
    wx.setStorageSync("cart", cart)
    wx.showToast({ title: "加入购物车成功", icon: "success" })
  },

  buyNow() {
    this.addToCart()
    wx.navigateTo({ url: "/pages/checkout/checkout" })
  },

  getBeanName(value) {
    const beanMap = { italian: '意式拼配', deep: '深烘拼配', ethiopia: '埃塞金烘' }
    return beanMap[value] || ''
  },

  getConcentrationName(value) {
    const concMap = { normal: '默认浓度', extra: '加单份浓缩' }
    return concMap[value] || ''
  },

  getSugarName(value) {
    const sugarMap = { standard: '标准甜', less: '少甜', lesser: '少少甜', micro: '微甜', none: '不另外加糖' }
    return sugarMap[value] || ''
  },

  getSpecText() {
    let spec = ''
    const sizeMap = { large: '大杯', xlarge: '超大杯' }
    const tempMap = { ice: '冰', hot: '热' }
    const beanMap = { italian: '意式拼配', deep: '深烘拼配', ethiopia: '埃塞俄金' }
    const concMap = { normal: '默认浓度', extra: '加单份浓缩' }
    const sugarMap = { standard: '标准甜', less: '少甜', lesser: '少少甜', micro: '微甜', none: '不另外加糖' }
    
    spec += `${sizeMap[this.data.selectedSize]}/${tempMap[this.data.selectedTemp]}/${beanMap[this.data.selectedBean]}/${concMap[this.data.selectedConcentration]}/${sugarMap[this.data.selectedSugar]}`
    return spec
  },

  onUnload() {
    wx.showTabBar()
  }
})
