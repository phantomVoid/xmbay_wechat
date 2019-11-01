const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tab_list: [{
      goods_classify_id: 0,
      title: '推荐'
    }],
    current_tab: 0,
    page: 1,
    good_list: [],
    total: ''
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
    this.getClassify()
    this.getChoiceness()
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
   * 获取一级列表
   */
  getClassify() {
    http.post(app.globalData.classify_parent).then(res => {
      this.setData({
        tab_list: [...this.data.tab_list, ...res.result]
      })
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
    if (this.data.current_tab == 0) {
      this.getChoiceness()
    } else {
      this.getGoodList()
    }
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
      current_tab: e.currentTarget.dataset.id
    })
    if (this.data.current_tab == 0) {
      this.getChoiceness()
    } else {
      this.getGoodList()
    }
  },

  /**
   * 获得精选列表
   */
  getChoiceness() {
    http.post(app.globalData.choiceness_list, {}).then(res => {
      this.setData({
        discount: res.discount == null ? 100 : res.discount,
        choiceness: res.result
      })
    })
  },

  /**
   * 获取商品
   */
  getGoodList() {
    http.post(app.globalData.good_recommend_list, {
      goods_classify_id: this.data.current_tab,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          discount: res.discount == null ? 100 : res.discount,
          good_list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          good_list: [...this.data.good_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 商品详情
   */
  onGoods(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  }

})