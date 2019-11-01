const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_status: true,
    shopping_status: true,
    interact_status: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData()
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.integral_task, {}).then(res => {
      this.setData({
        adv_info: res.adv_info,
        info: res.result
      })
    })
  },

  /**
   * 开关账户
   */
  changeAccount() {
    this.setData({
      account_status: !this.data.account_status
    })
  },

  /**
   * 开关购物
   */
  changeShopping() {
    this.setData({
      shopping_status: !this.data.shopping_status
    })
  },

  /**
   * 开关互动
   */
  changeInteract() {
    this.setData({
      interact_status: !this.data.interact_status
    })
  },

  /**
   * 去购物
   */
  goShopping() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 去签到
   */
  onSignin() {
    wx.navigateBack({})
  },

  /**
   * 去评价
   */
  onComment() {
    wx.navigateTo({
      url: '/my/my_comment/my_comment',
    })
  },

  onAdv() {
    wx.navigateTo({
      url: '/pages/hot_spots/hot_spots',
    })
  },
  adv() {
    switch (this.data.adv_info.type) {
      case 0:
        break;
      case 1:
        wx.navigateTo({
          url: `/nearby_shops/good_detail/good_detail?goods_id=${this.data.adv_info.content}`,
          success: () => {
            http.post(app.globalData.index_adBrowseInc, {
              adv_id: this.data.adv_info.adv_id
            }).then(res => {})
          }
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/nearby_shops/shop_detail/shop_detail?store_id=${this.data.adv_info.content}`,
          success: () => {
            http.post(app.globalData.index_adBrowseInc, {
              adv_id: this.data.adv_info.adv_id
            }).then(res => {})
          }
        })
        break;
    }

  }
})