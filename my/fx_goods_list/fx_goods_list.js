const app = getApp()
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索关键字
    search_key: '',
    //单列 1 双列2
    columns: 1,
    //选项卡
    current_tab: 1,
    //价格 高低
    rank: '',
    //综合列表框
    classify_board: false,
    //选中综合
    compre_type: 1,
    //选中综合文字
    compre: '综合',
    //筛选列表显示
    filtrate_board: false,
    //筛选状态
    is_filtrate: false,
    //参数
    goods_classify_id: '',
    brand_id: '',
    shop: '',
    freight_status: '',
    is_freight: '',
    goods_number: '',
    minimum_price: '',
    top_price: '',
    //数据
    good_list: [],
    total: '',
    page: 1,
    loading: true,
    distribution: '',
    distribution_type: 0 //0正常列表 1购买指定列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
    })
    let obj = {}
    //搜索关键字
    if (options.key) {
      obj.search_key = options.key
    }
    if (options.goods_classify_id) {
      obj.goods_classify_id = options.goods_classify_id
    }
    if (options.brand_id) {
      obj.brand_id = options.brand_id
    }
    this.setData(obj)
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
    this.setData({
      sup_id: app.globalData.sup_id
    })
    // if (app.globalData.member_id != '') {
    this.getDistributionData()
    // }
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
   * 页面滑动 返回顶部是否显示
   */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    this.setData({
      scroll_top: 0
    })
  },

  /**
   * 搜索框输入
   */
  searchInput(e) {
    this.data.search_key = e.detail.value
  },

  /**
   *搜索框聚焦 
   */
  inputFocus() {
    this.closeSynthesisList()
  },

  /**
   * 清空输入框
   */
  onClearKey() {
    this.setData({
      search_key: ''
    })
  },

  /**
   * 搜索
   */
  onSearch() {
    this.setData({
      shop: '',
      freight_status: '',
      is_freight: '',
      goods_number: '',
      minimum_price: '',
      top_price: '',
      page: 1
    })
    this.getData()
  },

  /**
   * 改变单列双列
   */
  changeColums() {
    if (!this.closeSynthesisList()) {
      this.setData({
        columns: this.data.columns == 1 ? 2 : 1
      })
    }
  },

  /**
   * 获取数据
   */
  getData() {
    console.log('get')
    let parameter = '';
    //综合排序    
    if (this.data.current_tab == 1) {
      switch (this.data.compre_type) {
        //综合
        case 1:
          parameter = ''
          break;
        case 2:
          //新品
          parameter = 'create_time'
          break;
        case 3:
          //评论
          parameter = 'comments_number'
          break;
      }
    } else if (this.data.current_tab == 2) {
      //销量
      parameter = 'sales_volume'
    } else {
      //价格
      parameter = 'shop_price'
    }
    http.postList(app.globalData.good_list, {
      goods_classify_id: this.data.goods_classify_id,
      brand_id: this.data.brand_id,
      parameter: parameter,
      rank: this.data.rank,
      shop: this.data.shop,
      freight_status: this.data.freight_status,
      keyword: this.data.search_key,
      goods_number: this.data.goods_number,
      minimum_price: this.data.minimum_price,
      top_price: this.data.top_price,
      is_freight: this.data.is_freight,
      is_distributor: this.data.distribution_type == 1 ? 2 : 0,
      is_distribution: this.data.distribution_type == 1 ? 2 : 2,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.onBackTop()
        this.setData({
          good_list: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount,
        })
      } else {
        this.setData({
          good_list: [...this.data.good_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 综合
   */
  onComposite() {
    //列表框
    if (this.data.current_tab == 1) {
      this.setData({
        classify_board: !this.data.classify_board,
      })
    } else {
      //点击综合
      this.setData({
        current_tab: 1,
        rank: ''
      })
      this.data.page = 1
      this.getData()
    }

  },

  /**
   * 销量
   */
  onSaleClick() {
    //关闭综合列表框
    if (!this.closeSynthesisList()) {
      this.setData({
        current_tab: 2,
        rank: 'desc'
      })
      this.data.page = 1
      this.getData()
    }
  },

  /**
   * 价格
   */
  onPriceClick() {
    if (!this.closeSynthesisList()) {
      //价格正序倒序
      if (this.data.rank == 'desc') {
        this.data.rank = 'asc'
      } else {
        this.data.rank = 'desc'
      }
      this.setData({
        parameter: '',
        current_tab: 3,
        rank: this.data.rank
      })
      this.data.page = 1
      this.getData()
    }
  },

  /**
   * 筛选
   */
  OnChangeFilter() {
    if (!this.closeSynthesisList()) {
      this.setData({
        filtrate_board: true
      })
    }
  },

  /**
   * 综合排序
   */
  onCompreRank() {
    this.setData({
      compre_type: 1,
      compre: '综合'
    })
    this.closeSynthesisList()
    this.data.page = 1
    this.getData()
  },

  /**
   * 新品优先
   */
  onNew() {
    this.setData({
      compre_type: 2,
      compre: '新品',
      rank: 'desc'
    })
    this.closeSynthesisList()
    this.data.page = 1
    this.getData()
  },

  /**
   * 评论数
   */
  onComment() {
    this.setData({
      compre_type: 3,
      compre: '评论'
    })
    this.closeSynthesisList()
    this.data.page = 1
    this.getData()
  },

  /**
   * 关闭综合列表
   */
  closeSynthesisList() {
    if (this.data.classify_board) {
      this.setData({
        classify_board: false
      })
      return true;
    }
    return false;
  },

  /**
   * 关闭弹出窗
   */
  closeTrans() {
    this.setData({
      classify_board: false,
      filtrate_board: false
    })
  },

  /**
   * 筛选重置
   */
  onFiltrateReset() {
    this.setData({
      filtrate_board: false,
      is_filtrate: false,
      parameter: '',
      rank: '',
      shop: '',
      freight_status: '',
      is_freight: '',
      goods_number: '',
      minimum_price: '',
      top_price: '',
      page: 1
    })
    this.getData()
  },

  /**
   * 筛选确定
   */
  onFiltrateConfirm(e) {
    this.setData({
      filtrate_board: false,
      is_filtrate: true,
      page: 1
    })
    this.data.shop = e.detail.shop
    this.data.freight_status = e.detail.freight_status
    this.data.goods_number = e.detail.goods_number
    this.data.is_freight = e.detail.is_freight
    this.data.minimum_price = e.detail.minimum_price
    this.data.top_price = e.detail.top_price
    this.getData()
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.good_list.length) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 商品详情
   */
  onGoods(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 店铺详情
   */
  onShop(e) {
    wx.navigateTo({
      url: '/pages/shop_detail/shop_detail?store_id=' + e.currentTarget.dataset.id,
    })
  },

  addCart(e) {
    this.setData({
      info: e.detail,
    })
    this.selectComponent("#buy_board").show()
  },
  /**
   * 成为代言人
   */
  goFx() {
    if (app.login()) {
      wx.navigateTo({
        url: '/my/fx_cwdy/fx_cwdy',
      })
    }
  },

  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distribution_share_info, {
      distribution_id: app.globalData.sup_id == '' ? 0 : app.globalData.sup_id
    }).then(res => {
      try {
        this.setData({
          distribution: res.data,
          distribution_type: res.data.click != "appointSpeaker" ? 0 : 1
        })
        this.getData()
        app.globalData.distribution = res.data
        let member_info = wx.getStorageSync('member_info')
        if (member_info.distribution_record == null) {
          let distribution_record = {
            distribution_id: res.data.cur == null ? null : res.data.cur.distribution_id,
            audit_status: res.data.cur == null ? null : res.data.cur.audit_status
          }
          member_info.distribution_record = distribution_record
        } else {
          member_info.distribution_record.distribution_id = res.data.cur == null ? null : res.data.cur.distribution_id
          member_info.distribution_record.audit_status = res.data.cur == null ? null : res.data.cur.audit_status
        }
        wx.setStorageSync('member_info', member_info)
      } catch (e) {}
    })
  },
})