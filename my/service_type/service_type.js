// pages/service_type/service_type.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.info = JSON.parse(options.info)
    this.data.info.file = decodeURIComponent(this.data.info.file)
    this.setData({
      diy_color: app.globalData.diy_color,
      info: this.data.info,
      order_type: JSON.parse(options.order_type)
    })
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
   * 退款
   * state 是否收到货 1未收到货 2已收到货
   * type: 退款类型 1退款 2退货退款
   */
  onRefund() {
    this.data.info.file = encodeURIComponent(this.data.info.file)
    wx.redirectTo({
      url: `/my/apply_refund/apply_refund?info=${JSON.stringify(this.data.info)}&type=1&order_type=${JSON.stringify(this.data.order_type)}`
    })
  },

  /**
   * 退货退款
   * state 是否收到货 1未收到货 2已收到货
   * type: 退款类型 1退款 2退货退款
   */
  onRefundProduct() {
    this.data.info.file = encodeURIComponent(this.data.info.file)
    wx.redirectTo({
      url: `/my/apply_refund/apply_refund?info=${JSON.stringify(this.data.info)}&type=2&order_type=${JSON.stringify(this.data.order_type)}&state=2`
    })
  }
})