var app = getApp();

Page({
  data: {
    query: {}
  },

  onLoad: function(query) {
    this.data.query = query;
  },
  /**
   * 获取用户信息
   */
  readUserInfo: function(result) {
    var user = result.detail.userInfo;
    var rawData = result.detail.rawData;
    var signature = result.detail.signature;
    var query = this.data.query;
    wx.setStorage({
      key: 'user',
      data: user,
      success() {
        if (query.flag) {
          wx.switchTab({
            url: '/pages/my/my'
          })
          return;
        }
        app.login(query.phoneData, query.phoneIv, query.code, rawData, signature)
      }
    });
  }
})