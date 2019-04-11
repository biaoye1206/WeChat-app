/**
 * 引入模块
 */
const common = require("../../lib/common.js");
Page({
	data: {
		orderDetil: {
			facId: ''
		},
		pay: {
			amount: 0,
			usrCouponId: "",
			payType: 0,
		}

	},
	onLoad(options) {
		wx.showLoading({
			title: '拉取订单中',
			mask: true
		})
		/**
		 * 临时使用
		 */
		this.setData({
			'orderDetil.facId': options.result
		})
		// 隐藏bar
		wx.hideTabBar({
			aniamtion: true
		})
		var _this = this;
		var token = wx.getStorageSync("token");

		wx.request({
			url: common.getHost() + '/order/detail',
			header: {
				"token": token
			},
			method: "GET",
			data: {
				"code": options.result
			},
			success(res) {
				if (res.statusCode == 200) {
					var data = res.data;
					if (data.code == 1001) {
						_this.setData({
							orderDetil: data.body,
							'pay.amount': data.body.amount
						})
					} else if (data.code == 1003) {
						common.logOut();
						wx.navigateBack({
							delta: getCurrentPages.length - 1
						})
						wx.showToast({
							title: '请重新登陆',
							icon: 'info',
							duration: 2000,
							mask: true
						})
					}
				}
			}
		})
		wx.hideLoading();
	},
	onHide() {
		wx.showTabBar({
			animation: true
		})
	},
	/**
	 * 支付方式改变
	 */
	pickerChange(e) {
		this.setData({
			"pay.payType": e.detail.value
		})
	},
	/**
	 * 创建订单
	 */
	orderPost() {
		var data = this.data;
		var token = wx.getStorageSync("token");
		wx.request({
			url: common.getHost() + '/order/create',
			method: "GET",
			header: {
				"token": token
			},
			data: {
				"orderAmount": data.orderDetil.amount,
				"orderAmount": data.pay.amount,
				"usrCouponId": data.pay.usrCouponId,
				"payType": data.pay.payType,
				"facilityId": data.orderDetil.facilityId,
				"serviceStationId": data.orderDetil.serviceStationId,
				"tradeType": "0"
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
