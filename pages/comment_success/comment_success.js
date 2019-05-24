const app = getApp()
const http = require('../../utils/http.js')
const event = require('../../utils/event.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: [],
    total: -1,
    //当前评价的
    index: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
    if (options.write) {
      wx.setNavigationBarTitle({
        title: '写评价',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('commentSuccess', this, () => {
      wx.navigateBack()
      // that.data.list.splice(that.data.index, 1)
      // that.setData({
      //   list: that.data.list
      // })
    })
    this.getList()
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
    event.remove('commentSuccess', this)
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
   * 列表
   */
  getList() {
    http.post(app.globalData.orderEvaluateList, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  comment(e) {
    let index = this.data.index = e.currentTarget.dataset.index
    for (let i = 0, len = this.data.list[index].order_goods_evaluate.length; i < len; i++) {
      this.data.list[index].order_goods_evaluate[i].file = encodeURIComponent(this.data.list[index].order_goods_evaluate[i].file)
    }
    wx.navigateTo({
      url: '/pages/comment/comment?info=' + JSON.stringify(this.data.list[index].order_goods_evaluate),
    })
  },

  myComment() {
    wx.redirectTo({
      url: '/my/my_comment/my_comment',
    })
  }
})