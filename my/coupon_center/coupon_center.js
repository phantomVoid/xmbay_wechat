const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tab_list: [{
      goods_classify_id: '',
      title: '精选'
    }],
    current_tab: '',
    page: 1,
    list: [],
    total: '',
    count_down: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getClassify()
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
    if (this.data.total > this.data.list.length) {
      this.data.page++
        this.getConponList()
    }
  },

  /**
   * 换券
   */
  onChangeCoupon() {
    wx.redirectTo({
      url: '../change_coupon/change_coupon',
    })
  },

  /**
   * 获取一级列表
   */
  getClassify() {
    http.post(app.globalData.classify_parent).then(res => {
      this.setData({
        classify: this.data.tab_list.concat(res.result)
      })
      this.getConponList()
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getConponList()
  },

  /**
   * 分类更多
   */
  onMore() {
    this.setData({
      more_board: true
    })
  },

  /**
   *  关闭更多
   */
  closeBoard() {
    this.setData({
      more_board: false
    })
  },

  /**
   * 点击更多选项
   */
  onTabMoreItem(e) {
    this.closeBoard()
    this.setData({
      sroll_id: 'a-' + e.currentTarget.dataset.index,
      current_tab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getConponList()
  },

  /**
   * 获取优惠券列表
   */
  getConponList() {
    http.post(app.globalData.coupon_center, {
      category: this.data.current_tab,
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
      this.countDown()
      clearInterval(this.data.count_down)
      this.data.count_down = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      if (this.data.list[i].distance_start_time > 0) {
        let second = this.data.list[i].distance_start_time
        this.data.list[i]['hour'] = Math.floor((second) % (24 * 3600) / 3600) < 10 ? '0' + Math.floor((second) % (24 * 3600) / 3600) : Math.floor((second) % (24 * 3600) / 3600)
        this.data.list[i]['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
        this.data.list[i]['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
        this.data.list[i].distance_start_time--
      }
    }
    this.setData({
      list: this.data.list
    })
  },

  /**
   * 立即领取
   */
  onGetCoupon(e) {
    if (!app.login()) {
      return
    }
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index
    http.post(app.globalData.get_coupon, {
      coupon_id: item.coupon_id,
      goods_classify_id: item.type == 1 ? item.classify_str : '',
      store_id: item.type == 0 ? item.classify_str : '',
    }).then(res => {
      this.data.list[index].member_state = 1
      this.setData({
        list: this.data.list
      })
      app.showSuccessToast('领取成功')
    })
  },

  goUse(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.configSwitch.version_info.one_more == 0) {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods',
      })
      return
    }
    if (item.type == 0) {
      wx.navigateTo({
        url: '/nearby_shops/shop_detail/shop_detail?store_id=' + item.classify_str,
      })
    } else {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods?goods_classify_id=' + item.classify_str,
      })
    }
  }

})