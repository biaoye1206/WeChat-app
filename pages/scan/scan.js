Page({
  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    flag: false
  },
  goToIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 识别二维码
   */
  codeScan() {
    console.log(22222)
    var scan = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: function(res) {
        scan.setData({
          result: res.result
        })
        wx.redirectTo({
          url: '/pages/pay/pay?result=' + res.result
        })
      },
      fail: function() {
        console.log(55)
        scan.goToIndex()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.codeScan()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   //this.codeScan()
    this.goToIndex();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
  
})