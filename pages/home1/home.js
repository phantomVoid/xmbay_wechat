// pages/home/home.js
const app = getApp();
const event = require('../../utils/event.js');
const http = require('../../utils/http.js');
const navBar = require('../../components/navBar/navBar.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
  key: app.globalData.MapKey
});

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    //轮播图当前第几张
    current_banner: 0,
    current_popularity: 0,
    //计时器
    count_down: {},
    limit_time: '',
    popularity: [],
    //为你推荐
    recommend_list: [],
    //专享优惠
    exclusive_board: true,
    popup_adv_status: 1,
    encrypt: '',
    isBanner: true,
    isCurrent_banner: false,
    isHot_list: true,
    label: '',
    location: '全国',
    isNavMore: false, //更多
    isApplication: false //是否第一次进入应用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.nav_type = 'more_0'
    // this.test()
    console.log(options)
    console.log(options.scene)
    // 分享按钮上级id
    // if (options.id) {
    //   wx.setStorage({
    //     key: 's_id',
    //     data: options.id
    //   })
    // }
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshHome', this, () => {
      this.getData()
    })
    app.app_DIY(() => {
      this.location()
    })
    let timestamp = new Date().getTime()
    this.setData({
      Math_random: timestamp,
      model: app.globalData.model
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isBanner: true,
      isHot_list: true
    })
    if (this.data.isApplication && this.data.configSwitch.show_switch.is_limit == 1) {
      this.index_curLimitList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isBanner: false,
      isHot_list: false,
      isApplication: true
    })
    clearInterval(this.data.count_down)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.isApplication = true //第一次进入应用
    event.remove('refreshHome', this)
    clearInterval(this.data.count_down)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData()
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
   * 轮播图播放第几张
   */
  bannerChange(e) {
    this.setData({
      current_banner: e.detail.current,
      current_banner_img: this.data.banner[e.detail.current].file
    })
  },

  /**
   * 好物推荐轮播
   */
  popularityChange(e) {
    this.setData({
      current_popularity: e.detail.current,
      popularity_info: this.data.popularity[e.detail.current]
    })
  },

  /**
   * 页面滑动
   */
  onPageScroll(e) {
    //标题栏
    if (e.scrollTop > 40) {
      this.setData({
        black_title: true
      })
    } else {
      this.setData({
        black_title: false
      })
    }

    //返回顶部
    if (e.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
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
   * 限时抢购
   */
  index_curLimitList() {
    clearInterval(this.data.count_down)
    http.post(app.globalData.index_curLimitList, {}).then(res => {
      this.setData({
        limit: res.result, //限时抢购
        limit_time: res.result.time.count_down, //倒计时时间
      })
      this.countDown()
      this.data.count_down = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 点击地理位置
   */
  onLocation() {
    wx.navigateTo({
      url: '/nearby_shops/city_select/city_select',
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
   * 打开新人礼包
   */
  onNewGift() {
    this.closeExclusive()
    wx.nextTick(() => {
      wx.navigateTo({
        url: '/nearby_shops/new_gift/new_gift'
      })
    })
  },

  /**
   * 关闭新人礼包
   */
  closeExclusive() {
    this.data.popup_adv_status.popup_adv_status = 0
    this.setData({
      popup_adv_status: this.data.popup_adv_status
    })
  },

  /**
   * 搜索
   */
  onSearch() {
    wx.navigateTo({
      url: '/nearby_shops/search/search?type=1',
    })
  },

  /**
   * 导航条
   */
  onNavigation(e) {
    let item = e.currentTarget.dataset.item;
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
              url: `/nearby_shops/invitation/invitation?token=${this.data.encrypt}`,
            })
          }
          break;
        case 'group': //拼团
          wx.navigateTo({
            url: '/nearby_shops/collage_buy/collage_buy',
          })
          break;
        case 'cut': //砍价
          wx.navigateTo({
            url: '/nearby_shops/bargain_list/bargain_list',
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
            url: '/nearby_shops/rank_good/rank_good',
          })
          break;
        case 'brand': //品牌甄选
          wx.navigateTo({
            url: '/nearby_shops/brand_select/brand_select',
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
          //   console.log(res.data.cur)
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
        url: `/nearby_shops/search_goods/search_goods?goods_classify_id=${item.name}`
      })
    }
  },

  /**
   * 导航条更多
   */
  navMore() {
    this.setData({
      isNavMore: !this.data.isNavMore
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.index, {}).then(res => {
      this.setData({
        nav: res.data.nav,
        discount: res.data.info.discount == null ? 100 : res.data.info.discount,
        banner: res.data.banner, //banner
        current_banner_img: res.data.banner.length == 0 ? '' : res.data.banner[this.data.current_banner].file,
        theme: res.data.theme, //主题图片
        hot_list: res.data.hot_list, //热点新闻
        limit: res.data.limit, //限时抢购
        limit_time: res.data.limit.time.count_down, //倒计时时间
        adv_list: res.data.adv_list, //中间广告
        popularity: res.data.popularity, //好物推荐
        current_popularity: 0,
        popularity_info: res.data.popularity.length == 0 ? '' : res.data.popularity[0],
        class_list: res.data.class_list, //推荐分类商品
        recommend_list: res.data.recommend_list, //好物推荐
        popup_adv_status: res.data.set, //弹出广告
        encrypt: res.data.parameter
      }, () => {
        this.setData({
          finish: true
        })
      })
      
      if (this.data.configSwitch.show_switch.is_limit == 1) {
        clearInterval(this.data.count_down)
        this.countDown()
        this.data.count_down = setInterval(() => {
          this.countDown()
        }, 1000)
      }
    })
  },

  /**
   * 限时抢购倒计时
   */
  countDown() {
    if (this.data.limit_time == -1) {
      this.index_curLimitList()
      return
    }
    let hour = Math.floor(this.data.limit_time / 3600) < 10 ? '0' + Math.floor(this.data.limit_time / 3600) : Math.floor(this.data.limit_time / 3600),
      min = Math.floor(this.data.limit_time / 60 % 60) < 10 ? '0' + Math.floor(this.data.limit_time / 60 % 60) : Math.floor(this.data.limit_time / 60 % 60),
      sec = Math.floor(this.data.limit_time % 60) < 10 ? '0' + Math.floor(this.data.limit_time % 60) : Math.floor(this.data.limit_time % 60)
    this.data.limit_time--;
    this.setData({
      hour: hour,
      min: min,
      sec: sec
    })
  },

  /**
   * 头条
   */
  onHotSpot() {
    wx.navigateTo({
      url: '/nearby_shops/hot_spots/hot_spots',
    })
  },

  /**
   * 限时抢购
   */
  onFlashSale() {
    wx.navigateTo({
      url: '/nearby_shops/flash_sale/flash_sale',
    })
  },

  /**
   * 好物推荐
   */
  onRecommend() {
    wx.navigateTo({
      url: '/nearby_shops/recommend/recommend',
    })
  },

  /**
   * 广告点击
   */
  onAdv(e) {
    let item = e.currentTarget.dataset.item;
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
   * 内容
   */
  onContent(e) {
    wx.navigateTo({
      url: '/nearby_shops/info_detail/info_detail?article_id=' + e.currentTarget.dataset.id,
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
   * 分类
   */
  onClassify(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/nearby_shops/search_goods/search_goods?goods_classify_id=' + item.goods_classify_id,
      success: () => {
        if (e.currentTarget.dataset.adv == 1) {
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
    this.setData({
      info: e.detail,
    })
    this.selectComponent("#buy_board").show()
  },
  /**
   * 证照信息
   */
  credentials() {
    wx.navigateTo({
      url: '/my/credentials/credentials',
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
    if (this.data.recommend_list.length != 0) {
      this.selectComponent("#good_list").blendent(obj)
    }
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
      configSwitch: app.globalData.configSwitch
    })
    wx.nextTick(() => {
      this.getData()
      this.blendent()
      navBar.tabbar("tabBar", 0, this) //0首页
      wx.setNavigationBarTitle({
        title: this.data.configSwitch.app_info.title
      })
    })
  },
  onLabel(e) {
    wx.navigateTo({
      url: `/nearby_shops/good_detail/good_detail?goods_id=${e.currentTarget.dataset.goods_id}&label=${e.currentTarget.dataset.id}`,
    })
  }

})