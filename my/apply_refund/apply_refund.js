const app = getApp()
const http = require('../../utils/http.js')
const event = require('../../utils/event.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic_list: [],
    file_name: '',
    state: 1, //1 未收到货 2已收到货
    type: 1, //退款类型 1退款 2退货退款
    //退款原因
    reason: '',
    //退款金额
    price: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      type: options.type ? options.type : this.data.type,
      state: options.state ? options.state : this.data.state,
      order_type: options.order_type ? JSON.parse(options.order_type) : undefined
    })
    this.data.info = JSON.parse(options.info)
    this.data.info.file = decodeURIComponent(this.data.info.file)
    if (this.data.info.status != 0) {
      this.data.info['total'] = parseFloat((this.data.info.subtotal_price * this.data.info.quantity) + parseFloat(this.data.info.sub_freight_price) - parseFloat(this.data.info.sub_share_platform_coupon_price) - parseFloat(this.data.info.sub_share_shop_coupon_price) - parseFloat(this.data.info.subtotal_share_platform_packet_price)).toFixed(2)
      this.data.info['total'] = (Number(this.data.info['total']) + Number(this.data.info.sum_alter_goods_price)).toFixed(2)
    } else {
      this.data.info['total'] = parseFloat(parseFloat(this.data.info.subtotal_price * this.data.info.quantity) - parseFloat(this.data.info.sub_share_platform_coupon_price) - parseFloat(this.data.info.sub_share_shop_coupon_price) - parseFloat(this.data.info.subtotal_share_platform_packet_price)).toFixed(2)
      this.data.info['total'] = (Number(this.data.info['total']) + Number(this.data.info.sum_alter_goods_price)).toFixed(2)
    }

    // if (options.type) {
    //   this.data.type = options.type
    // }
    this.setData({
      info: this.data.info,

      // order_type: JSON.parse(options.order_type)
      // type: this.data.type,
      // state: 2
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
   * 选择未收到货
   */
  onNotReceive() {
    this.setData({
      state: 1
    })
  },

  /**
   * 选择已收到货 
   */
  onReceived() {
    this.setData({
      state: 2
    })
  },

  /**
   * 退款原因
   */
  reasonInput(e) {
    this.setData({
      reason: e.detail.value.replace(/ /g, '')
    })
  },

  /**
   * 退款金额
   */
  priceInput(e) {
    this.setData({
      price: e.detail.value
    })
  },

  /**
   * 选择图片
   */
  choosePic() {
    wx.chooseImage({
      count: 3 - this.data.pic_list.length,
      success: res => {
        this.setData({
          pic_list: [...this.data.pic_list, ...res.tempFilePaths]
        })
      },
    })
  },

  /**
   * 删除图片
   */
  delectPic(e) {
    this.data.pic_list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      pic_list: this.data.pic_list
    })
  },

  /**
   * 提交
   */
  submit() {
    if (this.data.reason == '') {
      app.showToast('请输入退款原因')
      return
    }
    if (this.data.price == '') {
      app.showToast('请输入退款金额')
      return
    }
    if (parseFloat(this.data.price).toFixed(2) > parseFloat(this.data.info.total)) {
      app.showToast(`最多可退款金额为${this.data.info.total}元`)
      return
    }

    this.data.file_name = ''
    wx.showLoading({
      title: '加载中...',
    })
    this.uploadImage(0)
  },

  /**
   * 上传图片
   */
  uploadImage(i) {
    if (i < this.data.pic_list.length) {
      wx.uploadFile({
        url: app.globalData.upload_pic,
        filePath: this.data.pic_list[i],
        name: 'image',
        formData: {
          type: 'goods'
        },
        success: res => {
          this.data.file_name += JSON.parse(res.data).url
          if (i != this.data.pic_list.length - 1) {
            this.data.file_name += ','
          }
          this.uploadImage(i + 1)
        }
      })
    } else {
      wx.hideLoading()
      http.post(app.globalData.refundAndReturn, {
        order_goods_id: this.data.info.order_goods_id,
        type: this.data.type,
        refund_amount: this.data.price,
        reason: this.data.reason,
        is_get_goods: this.data.state,
        multiple_file: this.data.file_name
      }).then(res => {
        app.showSuccessToast('提交成功', () => {
          wx.navigateBack()
          event.emit('refreshOrderDetail')
          event.emit('refreshReturnDetail')
        })
      })
    }
  },
})