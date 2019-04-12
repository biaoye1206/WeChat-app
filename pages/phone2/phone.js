var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    isLogin: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var _this = this;
    var token = wx.getStorageSync("token");
    // 如果已登陆设置页面标题为空
    if (app.user.isLogin && token != undefined && token != '') {
      wx.setNavigationBarTitle({
        title: ''
      });
      _this.setData({
        isLogin: app.user.isLogin
      })
    } else {
      console.log("获取code")
      //未登陆获取登陆code
      wx.login({
        success(res) {
          _this.setData({
            code: res.code,
            codeIsUse: true
          })
        }
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},


  /**
   * 获取用户手机信息
   */
  getPhoneNumber: function(result) {
    // 获取电话号码加密数据
    var encryptedData = result.detail.encryptedData;
    var iv = result.detail.iv;
    var code = this.data.code;
    // 获取code有效
    if (code != undefined && encryptedData != undefined && iv != undefined) {
      wx.navigateTo({
        url: '/pages/user/user?phoneData=' + encryptedData + '&phoneIv=' + iv + '&code=' + code,
      })
    }
  },
  outLogin() {
    app.user.isLogin = false;
    wx.removeStorageSync("token");
    wx.removeStorageSync("user");
    var pages = getCurrentPages();
    wx.navigateBack({
      delta: pages.length
    })
  }
})