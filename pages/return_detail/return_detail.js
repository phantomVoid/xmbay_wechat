const app = getApp()
const http = require('../../utils/http.js')
const event = require('../../utils/event.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: {},
    count_down: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch,
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshReturnDetail', this, res => {
      this.getData()
    })
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
    event.remove('refreshReturnDetail', this)
    clearInterval(this.data.count_down)
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
    http.post(app.globalData.refund_details, {
      order_goods_id: this.data.id
    }).then(res => {
      this.setData({
        info: res.result
      })
      clearInterval(this.data.count_down)
      if (res.result.remaining_time > 0) {
        this.countDown()
        this.data.count_down = setInterval(() => {
          this.countDown()
        }, 1000)
      }
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    let second = this.data.info.remaining_time
    if (second == 0) {
      this.getData()
    } else {
      this.data.info['day'] = parseInt((second) / (24 * 3600))
      this.data.info['hour'] = Math.floor((second) % (24 * 3600) / 3600) < 10 ? '0' + Math.floor((second) % (24 * 3600) / 3600 / 3600) : Math.floor((second) % (24 * 3600) / 3600)
      this.data.info['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
      this.setData({
        info: this.data.info
      })
      this.data.info.remaining_time--
    }
  },

  /**
   * 撤销申请
   */
  onRevocation() {
    http.post(app.globalData.revoke_apply, {
      order_goods_id: this.data.id
    }).then(() => {
      app.showSuccessToast('撤销成功', () => {
        wx.navigateBack()
        event.emit('refreshOrderDetail')
      })
    })
  },

  /**
   * 修改申请
   */
  changeApply() {
    this.data.info.status = this.data.info.order_goods_status
    let info = {}
    let obj = {
      distribution_type: this.data.info.distribution_type,
      pay_type: this.data.info.pay_type,
    }
    // wx.navigateTo({
    //   url: `/my/service_type/service_type?info=${JSON.stringify(item)}&order_type=${JSON.stringify(obj)}`,
    // })
    for (let i in this.data.info) {
      info[i] = this.data.info[i]
    }
    info.file = encodeURIComponent(info.file)
    if (this.data.info.status == 5.2 || this.data.info.status == 5.3 || this.data.info.status == 5.4 || this.data.info.status == 5.6) {
      wx.navigateTo({
        // url: '/my/apply_refund/apply_refund?info=' + JSON.stringify(info) + '&return=1',
        url: `/my/apply_refund/apply_refund?info=${JSON.stringify(this.data.info)}&type=2`
      })
    } else {
      wx.navigateTo({
        url: `/my/apply_refund/apply_refund?info=${JSON.stringify(info)}`,
      })
    }
  },

  /**
   * 填写退货物流
   */
  fillLogistics(e) {
    wx.navigateTo({
      url: '/pages/fill_logistics/fill_logistics?id=' + this.data.info.order_goods_refund_id + '&store_id=' + this.data.info.store_id,
    })
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.phone,
    })
  },
  /**
   * 客服
   */
  service() {
    let service_info = {
      store_title: this.data.info.store_name,
      TARGET_ID: this.data.info.store_id,
      DIVERSION_ID: '1005'
    }
    wx.navigateTo({
      url: '/my/service/service?service_info=' + JSON.stringify(service_info),
    })
  },
  /**
   * 平台客服
   */
  service_pt() {
    let service_info = {
      TARGET_ID: '0',
      DIVERSION_ID: '5002'
    }
    wx.navigateTo({
      url: '/my/service/service?service_info=' + JSON.stringify(service_info),
    })
  },

})