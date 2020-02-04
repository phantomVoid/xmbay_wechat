// pages/home/home.js
const app = getApp();
const event = require('../../utils/event.js');
const http = require('../../utils/http.js');
const navBar = require('../../components/navBar/navBar.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
  key: app.globalData.MapKey
});
const Base64 = require('../../utils/base64.min.js').Base64;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: null, //首页数据
    banner_swiper_idx: 1, //banner当前轮播下标
    location: '全国', //默认定位
    limit_index: 0, //限时选中下标
    isApplication: true, //是否第一次进入应用
    isBannerAutoplay: true, //首页banner是否自动滚动
    isRefresh: false //首页是否刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.nav_type = 'only_2'
    this.getSystemInfo()
    let obj = null;
    //代言id
    if (options.sup_id) {
      wx.setStorage({
        key: 'sup_id',
        data: options.sup_id
      })
    }
    // 分享二维码
    if (options.scene) {
      let obj = http.scene(options.scene)
      console.log(obj)
      //上级id
      let s_id = obj.member
      wx.setStorage({
        key: 's_id',
        data: s_id
      })
      //上级代言id
      let sup_id = obj.sup_id
      wx.setStorage({
        key: 'sup_id',
        data: sup_id
      })
    }
    // obj = {
    //   isApplication: false
    // }
    // this.setData(obj)
    app.app_DIY(() => {
      this.location()
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshHome', this, () => {
      this.setData({
        isRefresh: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isBannerAutoplay: true,
      isHotAutoplay: true,
    })
    if (this.data.isRefresh) {
      this.location()
    }
    if (!this.data.isApplication) {
      this.index_curLimitList()
      this.countDown() //倒计时
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isBannerAutoplay: false,
      isApplication: false,
      isHotAutoplay: false,
      isRefresh: false
    })
    clearInterval(this.data.count_down)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      isBannerAutoplay: false,
      isHotAutoplay: false,
      isApplication: true,
      isRefresh: false
    })
    clearInterval(this.data.count_down)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.location()
  },
  /**
   * 页面滑动
   */
  onPageScroll(e) {
    this.nav()
    //返回顶部
    if (e.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取系统信息
   */
  getSystemInfo() {
    this.setData({
      model: app.globalData.model
    })
  },
  /**
   * 获取数据
   * pattern
   */
  getData() {
    http.post(app.globalData.index, {
      pattern: 2
    }).then(res => {
      this.setData({
        dataInfo: res.data,
      })
      this.countDown() //倒计时
      this.navAttr()
    })
  },

  /**
   * 定位
   */
  location() {
    qqmapsdk.reverseGeocoder({
      success: res => {
        app.globalData.lat = res.result.location.lat
        app.globalData.lng = res.result.location.lng
        app.globalData.location = res.result.address_component.city
        app.globalData.current_location = res.result.address_component.city
        this.setData({
          location: res.result.address_component.city
        })
      },
      fail: res => {
        this.setData({
          location: app.globalData.location
        })
      },
      complete: () => {

      }
    })
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch,
      model: app.globalData.model
    })
    wx.nextTick(() => {
      this.getData()
      this.blendent()
      navBar.tabbar("tabBar", 0, this) //0首页
      wx.setNavigationBarTitle({
        title: this.data.configSwitch.app_info.title
      })

    })

    let iconPath = `<svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 210 90" style="enable-background:new 0 0 210 90;" xml:space="preserve"><style type="text/css">	.st0{fill:#222222;}</style><g>	<path class="st0" d="M0,0v84.3C0,87.4,2.5,90,5.6,90h198.7c3.1,0,5.6-2.5,5.6-5.6V0c-30.6,10.6-66.6,16.7-105,16.7		C66.6,16.7,30.6,10.6,0,0z"/></g></svg>`

    iconPath = Base64.encode(iconPath.split('#222222').join(app.globalData.diy_color.z_color))
    this.setData({
      iconPath: iconPath
    })
  },

  /**
   * DIY配色
   */
  blendent() {
    let obj = {
      diy_color: app.globalData.diy_color
    }
    this.selectComponent("#cart").blendent(obj)
    this.selectComponent("#buy_board").blendent(obj)
  },
  /**
   * banner
   */
  bannerChange(e) {
    this.setData({
      banner_swiper_idx: e.detail.current + 1
    })
  },
  /**
   * swiper禁止滑动
   */
  stopTouchMove() {
    return false
  },

  /**
   * 回到顶部
   */
  onBackTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 限时抢购选择场次
   */
  limitTap(e) {
    this.setData({
      limit_index: e.currentTarget.dataset.idx
    })
  },
  /**
   * 倒计时
   */
  countDown() {
    clearInterval(this.data.count_down)
    this.data.limitTime = this.data.dataInfo.limit.time.count_down
    this.count_callback()
    this.data.count_down = setInterval(() => {
      this.data.limitTime--;
      this.setData({
        limitTime: this.data.limitTime
      })
      this.count_callback()
    }, 1000)
  },
  /**
   * 倒计时回调
   */
  count_callback() {
    if (this.data.limitTime <= 0) {
      this.index_curLimitList()
      return
    }
  },
  /**
   * 点击地理位置
   */
  onLocation() {
    wx.navigateTo({
      url: '/pages/city_select/city_select',
    })
  },
  /**
   * 搜索
   */
  onSearch() {
    wx.navigateTo({
      url: '/pages/search/search?type=1',
    })
  },
  /**
   * 扫一扫
   */
  onScan() {
    wx.scanCode({
      success(res) {
        console.log(res)
        // return
        let scene = decodeURIComponent(res.path.split("=")[1])
        let obj = http.scene(scene)
        console.log(obj)
        let data = scene.split("-")[0]
        console.log(data.split(",")[0])
        switch (data.split(",")[0]) {
          case 'goods':
            wx.navigateTo({
              url: '/nearby_shops/good_detail/good_detail?goods_id=' + obj.goods
            })
            break;
          case 'store':
            wx.navigateTo({
              url: '/nearby_shops/shop_detail/shop_detail?store_id=' + obj.store
            })
            break;
        }
      }
    })
  },

  /**
   * 付款码
   */
  onPayCode() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/vip_card/vip_card?&tab=1`
      })
    }
  },
  /**
   * 广告点击
   */
  onAdv(e) {
    let item = e.currentTarget.dataset.item
    switch (item.type) {
      case 1: //商品
        wx.navigateTo({
          url: '/nearby_shops/good_detail/good_detail?goods_id=' + item.content,
          success: () => {
            http.post(app.globalData.index_adBrowseInc, {
              adv_id: item.adv_id
            }).then(res => {})
          }
        })
        break;
      case 2: //店铺
        return
        wx.navigateTo({
          url: '/nearby_shops/shop_detail/shop_detail?store_id=' + item.content,
          success: () => {
            http.post(app.globalData.index_adBrowseInc, {
              adv_id: item.adv_id
            }).then(res => {})
          }
        })
        break;
    }
  },
  /**
   * 导航条
   */
  onNavigation(e) {
    let item = e.currentTarget.dataset.item
    if (item.type == 1) {
      switch (item.name) {
        case 'sign_in': //签到
          wx.navigateTo({
            url: '/my/integral/integral',
          })
          break;
        case 'invit': //邀请有礼
          if (app.login()) {
            wx.navigateTo({
              url: `/pages/invitation/invitation?token=${this.data.dataInfo.parameter}`,
            })
          }
          break;
        case 'group': //拼团
          wx.navigateTo({
            url: '/pages/collage_buy/collage_buy',
          })
          break;
        case 'cut': //砍价
          wx.navigateTo({
            url: '/pages/bargain_list/bargain_list',
          })
          break;
        case 'coupon': //领券
          wx.navigateTo({
            url: '/my/coupon_center/coupon_center',
          })
          break;
        case 'recharge': //充值
          wx.navigateTo({
            url: '/my/account_recharge/account_recharge',
          })
          break;
        case 'ranking': //排行榜
          wx.navigateTo({
            url: '/pages/rank_good/rank_good',
          })
          break;
        case 'brand': //品牌甄选
          wx.navigateTo({
            url: '/pages/brand_select/brand_select',
          })
          break;
        case 'merchant': //商家入驻
          if (app.login()) {
            wx.navigateTo({
              url: '/my/merchant_guide/merchant_guide',
            })
          }
          break;
        case 'distribution': //代言
          // http.post(app.globalData.distribution_share_info, {
          //   distribution_id: 0
          // }).then(res => {
          //   if (res.data.cur == null) {
          //     wx.navigateTo({
          //       url: '/my/fx_cwdy/fx_cwdy',
          //     })
          //   } else {
          //     wx.navigateTo({
          //       url: '/my/fx_goods_list/fx_goods_list',
          //     })
          //   }
          // })

          http.post(app.globalData.distribution_jumpSign, {}).then(res => {
            wx.navigateTo({
              url: res.data.path
            })
          })
          break;
        case 'vip': //会员卡
          if (app.login()) {
            wx.navigateTo({
              url: '/my/vip_card/vip_card',
            })
          }
          break;
      }
    } else if (item.type == 2) { //分类
      wx.navigateTo({
        url: `/pages/search_goods/search_goods?goods_classify_id=${item.name}`
      })
    }
  },
  /**
   * 获取导航
   */
  navAttr() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          'navAttr.windowWidth': res.windowWidth
        })
      }
    })
    wx.createSelectorQuery().selectAll('.nav-indicator-con').boundingClientRect(rect => {
      this.setData({
        'navAttr.indicatorWidth': rect[0].width
      })
    }).exec()
  },
  /**
   * 导航
   */
  navScroll(e) {
    this.navAttr()
    this.setData({
      navScroll: e.detail
    })
  },
  /**
   * 头条
   */
  onHotSpot() {
    wx.navigateTo({
      url: '/pages/hot_spots/hot_spots',
    })
  },
  /**
   * 头条内容
   */
  onHotSpotContent(e) {
    wx.navigateTo({
      url: '/pages/info_detail/info_detail?article_id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 限时抢购
   */
  onLimit() {
    wx.navigateTo({
      url: '/pages/flash_sale/flash_sale',
    })
  },
  /**
   * 限时抢购商品
   */
  onLimitGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 限时抢购
   * type 0老版 1新版多店
   */
  index_curLimitList() {
    http.post(app.globalData.index_curLimitList, {
      type: 2
    }).then(res => {
      this.setData({
        'dataInfo.limit': res.result, //限时抢购
        limitTime: res.result.time.count_down //倒计时时间
      })
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
   * 好物推荐
   */
  onRecommend() {
    wx.navigateTo({
      url: '../recommend/recommend',
    })
  },

  /**
   * 新品上市
   */
  onNew() {
    wx.navigateTo({
      url: '/pages/search_goods/search_goods?key=' + '&type=new',
    })
  },
  /**
   * 大牌推荐
   */
  onBrand() {
    wx.navigateTo({
      url: '/pages/rank_good/rank_good'
    })
  },
  /**
   * 今日爆款
   */
  onRank() {
    wx.navigateTo({
      url: '/pages/search_goods/search_goods?key=' + '&type=evaluate',
    })
  },
  /**
   * 分类
   */
  onClassify(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/search_goods/search_goods?goods_classify_id=' + item.goods_classify_id,
      success: () => {
        if (item.adv) {
          http.post(app.globalData.index_adBrowseInc, {
            adv_id: item.adv_id
          }).then(res => {})
        }
      }
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
      }).then(res => {
        event.emit('refreshCart')
        event.emit('refreshCartNumber')
        app.showSuccessToast('添加购物车成功')
      })
    } else {
      this.setData({
        info: item
      })
      this.selectComponent("#buy_board").show()
    }
  },
  /**
   * 打开新人礼包
   */
  onNewGift() {
    this.closeExclusive()
    wx.navigateTo({
      url: '/pages/new_gift/new_gift'
    })
  },

  /**
   * 关闭新人礼包
   */
  closeExclusive() {
    this.setData({
      'dataInfo.set.popup_adv_status': 0
    })
  },
  nav() {
    const query = wx.createSelectorQuery()
    query.selectViewport().scrollOffset((res) => {
      this.setData({
        scrollTop: res.scrollTop
      })
    })
    query.exec()
  },
  onLabel(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/nearby_shops/good_detail/good_detail?goods_id=${e.currentTarget.dataset.goods_id}&label=${e.currentTarget.dataset.id}`,
    })
  }

})