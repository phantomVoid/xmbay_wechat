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
    //退款原因
    reason: '',
    //退款金额
    price: '',
    dataInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.dataInfo = JSON.parse(options.dataInfo)
    this.data.dataInfo.info.file = decodeURIComponent(this.data.dataInfo.info.file)
    if (this.data.dataInfo.status == 2 || this.data.dataInfo.status == 3 || this.data.dataInfo.status == 4) {
      this.data.dataInfo.info.subtotal_price = parseFloat(this.data.dataInfo.info.subtotal_price - this.data.dataInfo.info.sub_freight_price).toFixed(2)
    } else {
      this.data.dataInfo.info.subtotal_price = parseFloat(this.data.dataInfo.info.subtotal_price).toFixed(2)
    }
    this.setData({
      diy_color: app.globalData.diy_color,
      dataInfo: this.data.dataInfo
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
      'dataInfo.state': 1
    })
  },

  /**
   * 选择已收到货 
   */
  onReceived() {
    this.setData({
      'dataInfo.state': 2
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
    if (parseFloat(this.data.price) <= 0) {
      app.showToast('请输入正确退款金额')
      return
    }
    if (parseFloat(this.data.price).toFixed(2) > parseFloat(this.data.dataInfo.info.subtotal_price)) {
      app.showToast(`最多可退款金额为${this.data.dataInfo.info.subtotal_price}元`)
      return
    }

    this.data.file_name = ''
    wx.showLoading({
      title: '加载中...',
    })
    this.uploadImage(0)
    http.post(app.globalData.applet_my_saveFormId, {
      micro_form_id: this.data.formId
    }).then(res => {})
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
      http.post(app.globalData.refundAndReturn, {
        order_goods_id: this.data.dataInfo.info.order_goods_id,
        type: this.data.dataInfo.type,
        refund_amount: this.data.price,
        reason: this.data.reason,
        is_get_goods: this.data.dataInfo.status != 2 ? this.data.dataInfo.state : 2,
        multiple_file: this.data.file_name
      }).then(res => {
        wx.hideLoading()
        app.showSuccessToast('提交成功', () => {
          event.emit('refreshOrderDetail')
          event.emit('refreshReturnDetail')
          const page = getCurrentPages()
          for (let i = 0, len = page.length; i < len; i++) {
            if (page[i].route == 'my/order_detail/order_detail') {
              console.log(i)
              wx.navigateBack({
                delta: page.length - i - 1
              })
              return
              break;
            }
          }
        })
      })
    }
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})