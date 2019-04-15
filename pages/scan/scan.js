/**
 * 引入模块
 */
const common = require("../../lib/common.js")
Page({
  /**
   * 页面的初始数据
   */
  
  /**
   * 识别二维码
   */
  codeScan() {
    if (!common.isLogin()) {
      wx.showToast({
        title: '请先登陆',
        icon: 'info',
        duration: 1500,
        mask: true
      })
      return;
    }
    var scan = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: function(res) {
        wx.navigateTo({
          url: '/pages/pay/pay?result=' + res.result
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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