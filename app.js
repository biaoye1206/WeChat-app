//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userLocation"]){
          wx.authorize({
            scope: 'scope.userLocation',
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
  
})