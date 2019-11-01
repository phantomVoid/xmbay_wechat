// components/bargainModal/bargainModal.js
const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready(){
    this.setData({
      z_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(price,avatar) {
      this.setData({
        show: true,
        price:price,
        avatar:avatar
      })
    },
    closeBoard() {
      this.setData({
        show: false
      })
      http.post(app.globalData.applet_my_saveFormId, {
        micro_form_id: this.data.formId
      }).then(res => { })
    },
    formId(e) {
      this.data.formId = e.detail.formId
    }
  }
})