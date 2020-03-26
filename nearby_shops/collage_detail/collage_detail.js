const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //拼团id
    id: '',
    //商品id
    goods_id: '',
    count_down: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.app_DIY(() => {
      this.blendent()
    }, this)
    this.setData({
      id: options.id
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
    event.on('refreshCollageDetail', this, () => {
      this.getData()
    })
    this.getData()
    this.setData({
      member_id: app.globalData.member_id
    })
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
    event.remove('refreshCollageDetail', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') { } else { }
    return {
      title: this.data.info.goods_name,
      path: '/nearby_shops/collage_detail/collage_detail?id=' + this.data.id,
      success: res => {
        wx.showToast({
          title: '转发成功',
        })
      },
      fail: res => {
        wx.showToast({
          title: '转发失败',
          icon: 'none'
        })
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取信息
   */
  getData() {
    http.post(app.globalData.group_view, {
      group_activity_attach_id: this.data.id
    }).then(res => {
      res.result['need'] = res.result.group_num - res.result.participant.length
      for (let i = 0, len = res.result.participant.length; i < len; i++) {
        if (res.result.participant[i].member_id == res.result.owner) {
          let item = res.result.participant[i]
          res.result.participant.splice(i, 1)
          let array = []
          array.push(item)
          array = [...array, ...res.result.participant]
          res.result.participant = array
        }
      }
      this.setData({
        info: res.result,
        goods_id: res.result.goods_id,
        group_list: res.group_list,
      })
      clearInterval(this.data.count_down)
      this.countDown()
      this.data.count_down = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    let second = this.data.info.continue_time
    if (second == 0 && this.data.info.status != 2) {
      this.data.info.status = 3
      this.setData({
        info: this.data.info
      })
    } else {
      this.data.info['hour'] = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600)
      this.data.info['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
      this.data.info['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
      this.data.info['hour_first'] = this.data.info['hour'].toString().substring(0, 1)
      this.data.info['hour_second'] = this.data.info['hour'].toString().substring(1, 2)
      this.data.info['min_first'] = this.data.info['min'].toString().substring(0, 1)
      this.data.info['min_second'] = this.data.info['min'].toString().substring(1, 2)
      this.data.info['sec_first'] = this.data.info['sec'].toString().substring(0, 1)
      this.data.info['sec_second'] = this.data.info['sec'].toString().substring(1, 2)
      this.data.info.continue_time--;
      this.setData({
        info: this.data.info
      })
    }
  },

  /**
   * 更多
   */
  onMoreGood() {
    wx.navigateTo({
      url: '/nearby_shops/collage_buy/collage_buy',
    })
  },

  /**
   * 商品
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 我要参团
   */
  onOffered() {
    if (app.login()) {
      http.post(app.globalData.goods_view, {
        goods_id: this.data.goods_id
      }).then(res => {
        this.setData({
          goods_info: res.result,
          discount: res.discount == null ? 100 : res.discount,
        })
        http.post(app.globalData.applet_my_saveFormId, {
          micro_form_id: this.data.formId
        }).then(res => { })
        let obj = {
          order_type: 2
        }
        this.selectComponent("#buy_board").show(obj)
      })
    }
  },

  /**
   * 我的拼团
   */
  onMyCollage() {
    wx.redirectTo({
      url: '/my/my_collage/my_collage',
    })
  },

  /**
   * 去逛逛其他拼团
   */
  onOtherCollage() {
    wx.redirectTo({
      url: '/nearby_shops/collage_buy/collage_buy',
    })
  },
  /**
   * 在开一团
   */
  onAgainCollage() {
    wx.redirectTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + this.data.info.goods_id,
    })
  },

  onCollageRule() {
    wx.navigateTo({
      url: '/my/web_view/web_view?id=20',
    })
  },
  /**
   * DIY配色
   */
  blendent() {
    let obj = {
      diy_color: app.globalData.diy_color
    }
    this.selectComponent("#buy_board").blendent(obj)
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})