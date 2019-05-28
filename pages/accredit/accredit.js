const app = getApp()
const http = require('../../utils/http.js')
const event = require('../../utils/event.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit: true
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
   * 获取用户信息
   */
  getUserInfo(e) {
    if (!this.data.isSubmit) {
      return
    }
    this.setData({
      isSubmit: false
    })
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.login(e)
          this.setData({
            isSubmit: true
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
          this.setData({
            isSubmit: true
          })
        }
      }
    })
  },

  /**
   * 登录
   */
  login(e) {
    if (e.detail.encryptedData == null) {
      return
    }
    wx.login({
      success: res => {
        //邀请人ID
        // let s_id = wx.getStorageSync('s_id')
        //邀请人代言ID
        let sup_id = app.globalData.sup_id
        http.post(app.globalData.login, {
          code: res.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          member_id: '',
          dev_type: 3
        }).then(res => {
          wx.hideLoading()
          //绑定代言关系
          if (sup_id != '') {
            this.getDistributionData(sup_id)
          }
          wx.setStorageSync('member_id', res.member.member_id)
          wx.setStorageSync('phone', res.member.phone == null ? '' : res.member.phone)
          wx.setStorageSync('openid', res.openid)
          wx.setStorageSync('unionId', res.unionId)
          app.globalData.member_id = res.member.member_id
          app.globalData.phone = res.member.phone == null ? '' : res.member.phone
          app.globalData.openid = res.openid
          app.globalData.unionId = res.unionId
          wx.setStorageSync('member_info', res.member)
          app.showSuccessToast('登录成功', () => {
            if (app.globalData.phone == '') {
              wx.redirectTo({
                url: '../bind_phone/bind_phone',
              })
            } else {
              let page = getCurrentPages()
              let route = page[page.length - 2].route //上一页地址
              switch (route) {
                case 'nearby_shops/good_detail/good_detail': //是否是商品详情
                  page[page.length - 2].getData()
                  break;
                case 'my/integral_good_detail/integral_good_detail':
                  page[page.length - 2].getData()
                  break;
              }

              wx.navigateBack()
              wx.nextTick(() => {
                event.emit('refreshCart')
                event.emit('refreshHome')
              })

            }
          })
          wx.nextTick(() => {
            //客服
            app.service()
          })
        }).catch(res => {
          this.setData({
            isSubmit: true
          })
        })
        
      }
    })
  },
  //获取代言信息
  getDistributionData(superior) {
    http.post(app.globalData.distribution_share_info, {
      distribution_id: 0
    }).then(res => {
      if (res.data.cur == null) {
        this.distribution_bindDistribution(superior)
      }
      app.globalData.distribution = res.data
      let member_info = wx.getStorageSync('member_info')
      if (member_info.distribution_record == null) {
        let distribution_record = {
          distribution_id: res.data.cur.distribution_id,
          audit_status: res.data.cur.audit_status
        }
        member_info.distribution_record = distribution_record
      } else {
        member_info.distribution_record.distribution_id = res.data.cur.distribution_id
        member_info.distribution_record.audit_status = res.data.cur.audit_status
      }
      wx.setStorageSync('member_info', member_info)
      this.setData({
        distribution: res.data
      })

    })
  },
  //绑定代言关系
  distribution_bindDistribution(superior) {
    http.post(app.globalData.distribution_bindDistribution, {
      superior: superior
    }).then(res => {})
  }
})