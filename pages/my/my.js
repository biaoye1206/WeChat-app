/**
 * 引入模块
 */
const common = require("../../lib/common.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
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
   this.initShow();
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
  onShareAppMessage: function() {},

  /**
   * 显示用户信息
   */
  showUserInfo: function() {
    const _this = this;
    var user = common.getLocationStorag('userInfo')
    if (user != null) {
      _this.setData({
        userInfo: user
      })
    }
  },
	/**
	 * 退出登陆
	 */
	logOut: function() {
	  common.logOut();
		this.initShow();
	},
	initShow:function(){
		 if (common.isLogin()) {
		  // 未显示个人信息
		  if (!this.show) {
		    // 显示用户信息
		    this.showUserInfo();
		    this.setData({
		      show: true
		    })
		  }
		} else {
		  this.setData({
		    userInfo: {
		      avatarUrl: '',
		      nickName: '请点击登陆'
		    },
		     show: false
		  })
		}
	}
})