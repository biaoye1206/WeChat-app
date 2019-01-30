var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '请点击登陆'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var token = wx.getStorageSync("token");  
    if (app.user.isLogin && token != undefined && token != '') {
      this.showUserInfo();
    }else{
      this.setData({
        userInfo: {
          avatarUrl: '',
          nickName: '请点击登陆'
        }
      })
    }
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
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  /**
   * 显示用户信息
   */
  showUserInfo: function() {
    const _this = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        _this.setData({
          userInfo: res.data
        })
      },
      fail(){
        wx.navigateTo({
          url: '/pages/user/user?flag=true'
        })
      }
    })
  }
})