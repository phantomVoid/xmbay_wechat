const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址id
    id: '',
    //收货人
    name: '',
    //手机号码
    phone: '',
    //地址
    address: '',
    //收货地址
    location: '',
    //经纬度
    latitude: '',
    longitude: '',
    //楼门
    detail: '',
    //选择地址
    address_board: false,
    //默认地址
    is_default: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
    if (options.id) {
      this.data.id = options.id
      wx.setNavigationBarTitle({
        title: '编辑收货地址',
      })
      this.getData()
    } else {
      wx.setNavigationBarTitle({
        title: '新增收货地址',
      })
    }
    this.data.pages = getCurrentPages()
    console.log(this.data.pages)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('changeLocation', this, location => {
      console.log(location)
      this.setData({
        location: location.location,
        latitude: location.latitude,
        longitude: location.longitude
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    event.remove('changeLocation', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.address_find, {
      member_address_id: this.data.id
    }).then(res => {
      this.setData({
        name: res.result.name,
        phone: res.result.phone,
        address: {
          province: res.result.province,
          province_id: res.result.province_id,
          city: res.result.city,
          city_id: res.result.city_id,
          area: res.result.area,
          area_id: res.result.area_id,
          street: res.result.street,
          street_id: res.result.street_id,
        },
        latitude: res.result.lat,
        longitude: res.result.lng,
        location: res.result.location_address,
        detail: res.result.address,
        is_default: res.result.is_default
      })
    })
  },
  /**
   * 收货人
   */
  nameInput(e) {
    this.data.name = e.detail.value
  },

  /**
   * 手机号码
   */
  phoneInput(e) {
    this.data.phone = e.detail.value
  },

  /**
   * 选择所在地区
   */
  onAddress() {
    this.setData({
      address_board: true
    })
  },

  /**
   * 选择收货地址
   */
  onLocation() {
    let address
    if (this.data.address.province != undefined) {
      // if (this.data.location) {
      //   address = `/my/map/map?address=${this.data.location}`
      // } else {
      address = `/my/map/map?address=${JSON.stringify(this.data.address)}`
      // }
    } else {
      address = `/my/map/map`
    }
    wx.navigateTo({
      url: address,
    })
  },

  /**
   * 确认所在地区
   */
  confirmAddress(e) {
    this.setData({
      address: e.detail
    })
  },

  /**
   * 详细地址
   */
  detailInput(e) {
    this.setData({
      detail: e.detail.value
    })
  },

  /**
   * 设置默认
   */
  changeDefault() {
    this.setData({
      is_default: !this.data.is_default
    })
  },

  /**
   *  保存
   */
  save() {
    if (this.data.name.length == 0) {
      app.showToast('请输入联系人')
      return
    }
    if (this.data.phone == '') {
      app.showToast('请输入手机号码')
      return
    }
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确的手机号码')
      return
    }
    if (!this.data.address) {
      app.showToast('请选择所在地区')
      return
    }
    if (this.data.location == '') {
      app.showToast('请选择收货地址')
      return
    }
    if (this.data.detail.length == 0) {
      app.showToast('请输入详细地址')
      return
    }
    let url = app.globalData.address_create
    if (this.data.id != '') {
      url = app.globalData.address_update
    }
    http.post(url, {
      member_address_id: this.data.id,
      name: this.data.name,
      phone: this.data.phone,
      province: this.data.address.province,
      city: this.data.address.city,
      area: this.data.address.area,
      street: this.data.address.street,
      address: this.data.detail,
      location_address: this.data.location,
      is_default: this.data.is_default ? 1 : 0,
      lat: this.data.latitude,
      lng: this.data.longitude
    }).then(res => {
      event.emit('refresh_address')
      for (let i = 0, len = this.data.pages.length; i < len; i++) {
        if (this.data.pages[i].route == 'pages/confirm_order/confirm_order' && i != this.data.pages.length) {
          if (this.data.id != '') {
            this.data.pages[i].data.member_address_id = this.data.id
          } else {
            this.data.pages[i].data.member_address_id = res.data.address_id
          }
          console.log(this.data.pages[i])

          this.data.pages[i].getData()
          wx.navigateBack({
            delta: this.data.pages.length -1 - i
          })
          break;
        } else if (this.data.pages[i].route == 'pages/cart_confirm_order/cart_confirm_order' && i != this.data.pages.length) {
          if (this.data.id != '') {
            this.data.pages[i].data.member_address_id = this.data.id
          } else {
            this.data.pages[i].data.member_address_id = res.data.address_id
          }

          this.data.pages[i].getData()
          wx.navigateBack({
            delta: i + 1
          })
          break;
        } else if (i == this.data.pages.length - 1) {
          console.log('asdfasdfdf')
          wx.navigateBack()
        }
      }
      // return
      // app.showSuccessToast(res.message, () => {
      //   wx.navigateBack()
      // })
    })
  }
})