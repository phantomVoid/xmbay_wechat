// my/fx_withdrawal/fx_withdrawal.js
const app = getApp()
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //提现方式
    way_index: 1,
    way_type: '',
    way_list: [],
    //注意事项
    notice_list: [],
    //提现金额
    withdrawal_price: 0,
    tx_price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
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
    this.getData()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 选择提现方式
   */
  way(e) {
    this.setData({
      way_index: e.currentTarget.dataset.index,
      way_type: e.currentTarget.dataset.index
    })
  },

  /**
   * bindinput
   */
  bindinput(e) {
    this.setData({
      withdrawal_price: e.detail.value
    })
  },

  /**
   * 立即提现
   */
  submit() {
    if (parseFloat(this.data.withdrawal_price) < parseFloat(this.data.info.rule.min_price)) {
      wx.showToast({
        title: '提现金额不可低于' + this.data.info.rule.min_price + '元',
        icon: 'none'
      })
      return
    }
    if (parseFloat(this.data.withdrawal_price) > parseFloat(this.data.tx_price)) {
      wx.showToast({
        title: '提现金额不可大于当前收益',
        icon: 'none'
      })
      return
    }
    http.post(app.globalData.distribution_withdrawal_to_apply, {
      distribution_id: app.globalData.distribution.cur.distribution_id,
      price: this.data.withdrawal_price,
      distribution_type: this.data.way_type
    }).then(res => {
      wx.redirectTo({
        url: '/my/fx_tx_over/fx_tx_over',
      })
    })
  },

  /**
   * 提现记录
   */
  record() {
    wx.navigateTo({
      url: '/my/fx_record_list/fx_record_list',
    })
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distribution_withdrawal_index, {
      distribution_id: app.globalData.distribution.cur.distribution_id
    }).then(res => {
      this.setData({
        info: res.data,
        withdrawal_price: res.data.close_brokerage,
        tx_price: res.data.close_brokerage,
        notice_list: res.data.notify_explain,
        way_index: res.data.rule.type[0],
        way_type: res.data.rule.type[0],
      })
      let way_list = [],
        yue = {
          way_type: 1,
          way_img: app.globalData.HTTP + 'mobile/small/image/syt-qb.png',
          title: '余额'
        },
        wx = {
          way_type: 2,
          way_img: app.globalData.HTTP + 'mobile/small/image/syt-wx.png',
          title: '微信'
        }
      for (let i = 0, len = res.data.rule.type.length; i < len; i++) {
        if (res.data.rule.type[i] == 1) {
          way_list.push(yue)
        } else if (res.data.rule.type[i] == 2) {
          way_list.push(wx)
        }
      }
      this.setData({
        way_list: way_list
      })
    })
  }

})