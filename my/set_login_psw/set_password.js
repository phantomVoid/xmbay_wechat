const http = require('../../utils/http.js')
const app = getApp()
const event = require('../../utils/event.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    p_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      p_type: options.type
    })
    if (this.data.p_type == 'login') {
      wx.setNavigationBarTitle({
        title: '设置登录密码'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 密码输入
   */
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 设置密码
   */
  finish() {
    if (this.data.p_type != 'login') {
      if (this.data.password.length < 6) {
        app.showToast('请输入6位数字支付密码')
        return
      }
      http.encPost(app.globalData.set_password, {
        pay_password: this.data.password
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          event.emit('setPassword')
          wx.navigateBack()
        })
      })
    } else {
      this.login()
    }

  },
  login() {
    let re = /^[0-9a-zA-Z]{6,16}$/
    if (!re.test(this.data.password)) {
      app.showToast('请输入6位-16位字母、数组密码')
      return
    }
    http.encPost(app.globalData.set_password_login, {
      password: this.data.password
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        // event.emit('setPassword')
        wx.navigateBack()
      })
    })
  }
})