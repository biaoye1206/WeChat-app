// 引入SDK核心类
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const common = require("../../lib/common.js")
Page({
	data: {
		latitude: 22.9693437321,
		longitude: 113.1251102686,
		polyline: {},
		scale: 13,
		markers: [],
		hiddenInfo: true,
		info: {
			distance: 0,
			name: '',
			address: '',
			lat: 0,
			long: 0,
			status: 0
		},
		taskNum: 0
	},
	onLoad: function() {
		this.getCurrentLocation();
		qqmapsdk = new QQMapWX({
			// 实例化API核心类
			key: 'BSIBZ-NGOC5-LCYI6-Q4D3C-4YT77-V2FYA'
		});
	},


	onshow: function() {
		this.moveToLocation();
	},


	onReady: function() {
		this.mapCtx = wx.createMapContext('mapCase');
		this.getServicesPoi();
	},


	/**
	 * 移动地图中心点到当前位置
	 */
	moveToLocation: function() {
		this.setData({
			scale: 13
		})
		this.mapCtx.moveToLocation();
	},


	/**
	 * 获取当前位置坐标
	 */
	getCurrentLocation: function() {
		const map = this;
		// 获取当前位置
		wx.getLocation({
			type: "gcj02", // 设置坐标系
			success(res) {
				map.setData({
					longitude: res.longitude,
					latitude: res.latitude
				})
			}
		})
	},

	/**
	 * 获取视野内的服务点
	 */
	getServicesPoi: function() {
		const _this = this
		// 获取地图当前屏幕范围
		_this.mapCtx.getRegion({
			success(res) {
				const sou = res.southwest
				const nor = res.northeast
				wx.showNavigationBarLoading();
				wx.request({
					url: common.getHost() + '/svr/findServicePointsByScope',
					method: 'GET',
					data: {
						'souLon': sou.longitude,
						'souLat': sou.latitude,
						'norLon': nor.longitude,
						'norLat': nor.latitude
					},
					success(res) {
						if (res.statusCode === 200 && res.data.code === 1001) {
							_this.setData({
								markers: res.data.body
							})
						}
					},
					fail(e) {
						wx.showModal({
							title: '错误',
							content: '请求超时',
						})
					},
					complete() {
						// wx.hideLoading();
						wx.hideNavigationBarLoading();
					}
				})
			}
		})
	},


	/**
	 * 视野范围改变，建立获取服务点任务
	 */
	regionChange: function(e) {
		// 任务ID不为0表示有事件正在获取，直接清除任务
		if (this.data.taskNum != 0) {
			clearTimeout(this.data.taskNum);
		}
		// 创建获取服务点信息延时任务
		this.setData({
			taskNum: setTimeout(this.getServicesPoi, 1200)
		})
	},


	/**
	 * 点击服务点标志
	 */
	clickMarker: function(e) {
		const _this = this;
		wx.request({
			url: common.getHost() + '/svr/findServicePointById',
			data: {
				id: e.markerId
			},
			success(res) {
				if (res.statusCode === 200 && res.data.code === 1001) {
					var result = res.data.body;
					_this.getDistance(result.latitude, result.longitude);
					_this.setData({
						"info.address": result.address,
						"info.name": result.name,
						"info.lat": result.latitude,
						"info.long": result.longitude,
						"info.status": result.status
					})
					_this.setData({
						hiddenInfo: false
					})
				}
			}
		})
	},
	/**
	 * 关闭标志点提示信息
	 */
	closeInfo: function() {
		if (!this.hiddenInfo) {
			this.setData({
				hiddenInfo: true
			})
		}
	},


	/**
	 * 计算地图上两点之间距离
	 */
	getDistance: function(lat, lng) {
		var _this = this;
		qqmapsdk.calculateDistance({
			mode: 'driving',
			from: '',
			to: [{
				latitude: lat,
				longitude: lng
			}],
			success: function(res) {
				// 获取距离转换为公里
				var dis = res.result.elements[0].distance / 1000;
				var str = '';
				// 判断距离是否大于1公里，做出不同的显示
				if (dis > 1) {
					str = dis.toFixed(2) + "公里";
				} else {
					str = res.result.elements[0].distance + "米";
				}
				_this.setData({
					"info.distance": str
				})
			}
		});
	},


	/**
	 * 打开导航
	 */
	toNavigate: function() {
		const that = this;
		wx.openLocation({
			latitude: that.data.info.lat,
			longitude: that.data.info.long,
			name: that.data.info.name,
			scale: 28
		})
	},

	// //事件回调函数
	// driving: function() {
	//   var _this = this;
	//   //网络请求设置
	//   var opt = {
	//     //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
	//     url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=' + _this.data.latitude + ',' + _this.data.longitude + '&to=' + _this.data.info.lat + ',' + _this.data.info.long +'116.436195&key=BSIBZ-NGOC5-LCYI6-Q4D3C-4YT77-V2FYA',
	//     method: 'GET',
	//     dataType: 'json',
	//     //请求成功回调
	//     success: function(res) {
	//       var ret = res.data
	//       if (ret.status != 0) return; //服务异常处理
	//       var coors = ret.result.routes[0].polyline,
	//         pl = [];
	//       //坐标解压（返回的点串坐标，通过前向差分进行压缩）
	//       var kr = 1000000;
	//       for (var i = 2; i < coors.length; i++) {
	//         coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
	//       }
	//       //将解压后的坐标放入点串数组pl中
	//       for (var i = 0; i < coors.length; i += 2) {
	//         pl.push({
	//           latitude: coors[i],
	//           longitude: coors[i + 1]
	//         })
	//       }
	//       //设置polyline属性，将路线显示出来
	//       _this.setData({
	//         polyline: [{
	//           points: pl,
	//           color: '#FF0000DD',
	//           width: 2
	//         }]
	//       })
	//     }
	//   };
	//   wx.request(opt);
	// }
})
