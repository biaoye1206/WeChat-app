/**
 * 引入模块
 */
const common = require("../../../lib/common.js")

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		select: -1,
		money: 0,
		tradeType: '1'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// 隐藏bar
		wx.hideTabBar({
			aniamtion: true
		})
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
	onShareAppMessage: function() {

	},
	select: function(event) {
		var value = event.target.dataset.value;
		if (value != undefined) {
			var v = 0;
			this.setData({
				select: value
			})
			if (value == '0') {
				v = 20;
			} else if (value == '1') {
				v = 50;
			} else if (value == '2') {
				v = 80;
			} else if (value == '3') {
				v = 100;
			}
			this.setData({
				money: v
			});
		}

	},

	/**
	 * 创建充值订单
	 */
	orderpost() {
		var data = this.data;
		var token = wx.getStorageSync("token");
		wx.request({
			url: common.getHost() + '/order/recharge',
			method: "GET",
			header: {
				"token": token
			},
			data: {
				"orderAmount": data.money,
				"tradeType": data.tradeType,
				"index":data.select
			},
			success(res) {
				if (res.statusCode == 200 && res.data.code) {
					var data = res.data.body;
					// 调起微信支付
					common.pay(data);
				} else {
					wx.showToast({
						title: '请求错误,请稍后重试',
						icon: 'warn',
						duration: 2000,
						mask: true
					})
				}
				wx.switchTab({
					url: '/pages/index/index'
				})
			}
		})
	}
})
