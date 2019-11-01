const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    columns: {
      type: Number,
      default: 2,
      observer: function () {
        this.setData({
          columns: this.data.columns
        })
      }
    },
    discount: Number,
    //排行榜
    rank: Boolean
  },
  ready() {
    if (app.globalData.diy_color != null && this.data.diy_color == null) {
      this.setData({
        diy_color: app.globalData.diy_color
      })
    }
    this.setData({
      configSwitch: app.globalData.configSwitch
    })    
  },

  /**
   * 组件的初始数据
   */
  data: {
    diy_color:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    blendent(obj) {
      this.setData({
        diy_color: obj.diy_color
      })
    },
    /**
     * 商品
     */
    onGoods(e) {
      wx.navigateTo({
        url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
      })
    },

    onShop(e) {
      wx.navigateTo({
        url: '/nearby_shops/shop_detail/shop_detail?store_id=' + e.currentTarget.dataset.id,
      })
    },

    /**
     * 加入购物车
     */
    addCart(e) {
      if (!app.login()) {
        return
      }
      let item = e.currentTarget.dataset.item
      item.add_cart_type = 2
      item['attr'] = item.attribute_list
      if (item.goods_number == 0) {
        app.showToast('该商品已经卖光了')
        return
      }
      if (item['attr'].length == 0) {
        http.encPost(app.globalData.cart_create, {
          store_id: item.store_id,
          goods_id: item.goods_id,
          goods_name: item.goods_name,
          file: item.cart_file,
          number: 1,
          products_id: '',
          attr: '',
          goods_attr: '',
        }).then(res=> {
          event.emit('refreshCart')
          event.emit('refreshCartNumber')
          app.showSuccessToast('添加购物车成功')
        })
      } else {
        this.triggerEvent("addCart", item)
      }
    },
    onLabel(e) {
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: `/nearby_shops/good_detail/good_detail?goods_id=${e.currentTarget.dataset.goods_id}&label=${e.currentTarget.dataset.id}`,
      })
    }
  }
})