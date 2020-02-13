const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      show: app.globalData.configSwitch.version_info.one_more == 0 && app.globalData.configSwitch ? false : true
    })
    wx.setNavigationBarTitle({
      title: app.globalData.configSwitch.version_info.one_more == 0 && app.globalData.configSwitch ? '' : '商家入驻',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 立即入驻
   */
  settle() {
    if (app.login()) {
      http.post(app.globalData.my_getInState, {}).then(res => {
        let data = res.result
        switch (data.in_state) {
          case -1:
            wx.navigateTo({
              url: '/my/merchant/merchant',
            })
            break;
          case 0:
            app.showToast(data.state_msg, () => {})
            break;
          case 1:
            app.showToast(data.state_msg, () => {})
            break;
          case 2:
            app.showToast(data.state_msg, () => {
              wx.navigateTo({
                url: '/my/merchant/merchant',
              })
            })
            break;
          case 3:
            app.showToast(data.state_msg, () => {})
            break;
          case 4:
            app.showToast(data.state_msg, () => {})
            break;
          case 5:
            app.showToast(data.state_msg, () => {})
            break;
          case 6:
            app.showToast(data.state_msg, () => {})
            break;
        }
      })
    }
  }
})