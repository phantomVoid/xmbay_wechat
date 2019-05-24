// components/modal/modal.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    content: String,
    tip: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    is_show: false
  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideModal() {
      this.setData({
        is_show: !this.data.is_show
      })
    },
    //展示弹框
    showModal(e) {
      console.log(e)
      this.setData({
        data: e,
        is_show: !this.data.is_show
      })
    },

    /**
     * 确定
     */
    _onConfirm() {
      this.setData({
        is_show: false
      })
      this.triggerEvent("confirm",this.data.data)
    },

    /**
     * 取消
     */
    _onCancel() {
      this.setData({
        is_show: false
      })
      this.triggerEvent("cancel")
    },

  }
})