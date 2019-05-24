const app = getApp()
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    list: [],
    state: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      obj: JSON.parse(options.info),
      diy_color: app.globalData.diy_color
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

  getData() {
    http.post(app.globalData.express_view, {
      express_value: this.data.obj.express_value,
      express_number: this.data.obj.express_number,
      order_id: this.data.obj.order_attach_id,
      type: this.data.obj.type
    }).then(res => {
      let obj = {
        info: res.goods_view,
        address: res.address,
        state: res.result.state ? res.result.state : res.result.message
      }
      if (res.result.status == '200') {
        for (let i = 0, len = res.result.data.length; i < len; i++) {
          res.result.data[i]['date'] = res.result.data[i].time.substring(5, 10)
          res.result.data[i]['timer'] = res.result.data[i].time.substring(11, 16)
        }
        obj.list = res.result.data
      }
      this.setData(obj)
    })
  }
})