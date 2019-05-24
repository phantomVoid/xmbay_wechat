const app = getApp()
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_list: [{
      title: '交易通知',
      type: "1",
    }, {
      title: '通知',
      type: "0"
    }, {
      title: '优惠',
      type: "2"
    }],
    tab: 1,
    page: 1,
    total: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      tab: options.tab
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      list: [],
      page: 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getList()
    }
  },

  /**
   * 点击选项卡
   */
  onTab(e) {
    this.setData({
      tab: e.currentTarget.dataset.index,
      page: 1,
      list: []
    })
    this.getList()
  },

  /**
   * 获取列表
   */
  getList() {
    http.post(app.globalData.message_list, {
      type: this.data.tab,
      page: this.data.page
    }).then(res => {
      if (this.data.tab == 2) {
        for (let i = 0, len = res.result.data.length; i < len; i++) {
          if (new Date(res.result.data[i].current_time).getTime() > new Date(res.result.data[i].end_time).getTime()) {
            res.result.data[i]['finish'] = true
          } else {
            res.result.data[i]['finish'] = false
          }
        }
      }
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

  /**
   * 物流详情
   */
  onLogistics(e) {
    let info = {
      express_number: e.express_number,
      express_value: e.express_value,
      order_attach_id: e.attach_id,
      type: e.express_type
    }
    wx.navigateTo({
      url: '/my/logistics_detail/logistics_detail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 信息详情
   */
  onMessage(e) {
    let item = e.currentTarget.dataset.item
    switch (item.jump_state) {
      case "integral":
        wx.navigateTo({
          url: '/my/integral/integral',
        })
        break;
      case "packet":
        wx.navigateTo({
          url: '/my/red_pocket/red_pocket',
        })
        break;
      case "coupon":
        wx.navigateTo({
          url: '/my/coupon/coupon',
        })
        break;
      case "goods":
        wx.navigateTo({
          url: '/nearby_shops/good_detail/good_detail?goods_id=' + item.attach_id,
        })
        break;
      case "order":
        wx.navigateTo({
          url: '/my/order_detail/order_detail?id=' + item.attach_id,
        })
        break;
      case "express":
        if (item.express_type !='order'){
          return
        }
        wx.navigateTo({
          url: '/my/order_detail/order_detail?id=' + item.attach_id,
        })
        // this.onLogistics(item)
        // wx.navigateTo({
        //   url: '/my/logistics_detail/logistics_detail?express_value=' + item.express_value + '&express_number=' + item.express_number,
        // })
        break;
      case "article":
        wx.navigateTo({
          url: '/pages/info_detail/info_detail?article_id=' + item.attach_id,
        })
        break;
      case "distribution":
        http.post(app.globalData.distribution_jumpSign, {}).then(res => {
          wx.navigateTo({
            url: res.data.path
          })
        })
        break;
    }
  }
})