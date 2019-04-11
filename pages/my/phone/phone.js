/**
 * 引入模块
 */
const common = require("../../../lib/common.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // 如果已登陆设置页面标题为空
    if (common.isLogin()) {
      this.setData({
        isLogin: common.isLogin()
      })
      wx.setNavigationBarTitle({
        title: '个人中心'
      });
    }else{
       common.getTempLoginCode();
    }
  },
  /**
   * 获取用户手机信息
   */
  getPhoneNumber: function(result) {
    // 获取电话号码加密数据
    var encryptedData = result.detail.encryptedData;
    var iv = result.detail.iv;
    var error = result.detail.errMsg;
    // 获取code有效
		console.info(error.match("ok"))
    if (error.match("ok") != null) {
      var phone={
        "phoneData": encryptedData,
        "iv": iv
      }
      if(common.setLocationStorag("phone",phone)){
        common.readyLogin();
      }
			return;
    }
		var pages = getCurrentPages();
		wx.navigateBack({
		  delta: pages.length
		})
  }
})