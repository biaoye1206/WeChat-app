/**
 * 远程主机地址
 */
const remoteHost = "https://www.cntjzz.com:8008/autowash";
//const remoteHost =  'https://localhost:8008/autowash';

/**
 * 版本更新管理器
 */
const update = wx.getUpdateManager();

/**
 * Session状态
 */
var sessionStatus = false;
/**
 * 获取用户token
 */
function getToken() {
	return getLocationStorag("token");
}

/**
 * 通过key获取本地缓存数据
 * 
 * return: 成功返回value,失败或未找到返回null
 */
function getLocationStorag(key) {
	var value = null;
	try {
		value = wx.getStorageSync(key)
	} catch (e) {}
	if (value === undefined || value === '') {
		value = null;
	}
	return value;
}
/**
 * 设置本地缓存数据
 * 
 * return: 成功返回true,失败返回false
 */
function setLocationStorag(key, value) {
	var result = true;
	try {
		wx.setStorageSync(key, value)
	} catch (e) {
		result = false;
	}
	return result;
}
/**
 * 删出本址缓存数据
 * 
 * return: 成功返回true,失败返回false
 */
function removeStorage(key) {
	var result = true;
	try {
		wx.removeStorageSync(key)
	} catch (e) {
		result = false;
	}
	return result;
}

/**
 * 检测小程序版本更新
 */
function checkUpdate() {

	update.onCheckForUpdate(function(res) {
		// 请求完新版本信息的回调
		console.info("检查是否有更新: " + res.hasUpdate);
	});

	update.onUpdateReady(function() {
		wx.showModal({
			title: '新版本更新',
			content: '应用将自动重启安装更新',
			showCancel: false,
			confirmText: "确定",
			success: function(res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					update.applyUpdate()
				}
			}
		})
	});
}
/**
 * 准备登陆数据
 */
function readyLogin() {
	var phone = getLocationStorag("phone");
	// 获取手机信息
	if (phone == null) {
		wx.redirectTo({
			url: '/pages/phone/phone',
		})
		return;
	}
	var user = getLocationStorag("user");
	// 获取用户信息
	if (user == null) {
		wx.redirectTo({
			url: '/pages/my/user/user',
		});
		return;
	}
	// 获取登陆临时Code
	var code = getLocationStorag("code");

	var data = {
		phoneData: phone.phoneData,
		phoneIv: phone.iv,
		code: code,
		userData: user.rawData,
		userSignature: user.signature
	}
	login(data);
}

/**
 * 获取登陆临时Code
 */
function getTempLoginCode() {
	wx.login({
		success(res) {
			setLocationStorag("code", res.code);
		}
	})
}
/**
 * 用户登陆
 */
function login(data) {
	wx.request({
		url: getHost() + '/wechat/login',
		method: "GET",
		data: {
			phoneData: data.phoneData,
			phoneIv: data.phoneIv,
			code: data.code,
			userData: data.userData,
			userSignature: data.userSignature
		},
		success(res) {
			var data = res.data;
			if (res.statusCode === 200 && data.code === 1001) {
				var token = data.body.token;
				wx.setStorage({
					key: 'token',
					data: token,
				})
				setLocationStorag("isLogin", true);
			} else {
				wx.showToast({
					title: '登陆失败,请稍后重试',
					icon: 'warn',
					duration: 2000,
					mask: true
				})
			}
		},
		fail(res) {
			wx.showToast({
				title: '登陆失败,请稍后重试',
				icon: 'warn',
				duration: 2000,
				mask: true
			})
		},
		complete() {
			// 清理登陆数据
			removeStorage("phone");
			removeStorage("code");
			removeStorage("user");
			// 页面跳转
			wx.switchTab({
				url: '/pages/my/my'
			})
		}
	})
}

/**
 * 获取主机地址
 */
function getHost() {
	return remoteHost;
}
/**
 * 检查session状态是否有效
 */
function checkSession() {
	wx.checkSession({
		success() {
			console.info("isLogin true")
			setLocationStorag("isLogin", true);
		},
		fail() {
			console.info("isLogin false")
			setLocationStorag("isLogin", false);
		}
	});
}
/**
 * 是否登陆
 */
function isLogin() {
	var token = getLocationStorag("token");
	var isLogin = getLocationStorag("isLogin");
	return isLogin && token != null && token != '';
}
/**
 * 退出登陆
 */
function logOut() {
	setLocationStorag("isLogin", false);
	removeStorage("token");
	removeStorage("userInfo");
}
/**
 * 权限不足提示
 */
function showAuthModel() {
	wx.showModal({
		title: "出错啦",
		content: "未登陆或已下线，请先登陆",
		showCancel: false
	})
	this.logOut();
}
/**
 * 请求数据
 */

/** function httpRequest(header, data, url, method) {
 console.log("httpRequest")
   if (header == null) {
     header = {
       "content-type": "application/json"
     };
        };
   var token = wx.getStorageSync("token");
   if(token != null){
     header.token = token;
   }
   var result;
   wx.request({
     url: common.getHost() + url,
     header: header,
     method: method,
     data: data,
     success(res) {
       if (res.statusCode == 200) {
         result = res.data;
         if (result.code === 1001) {
           return result;
         } else if (result.code === 1003) {
          wx.showModal({
            title: '权限',
            content: result.data.msg,
                       })
        } else {
           wx.showModal({
             title: '请求失败',
             content: result.data.msg,
           })
         }
       }
     },
     fail(e) {
       wx.showModal({
         title: '请求失败',
         content: e.errMsg,
       })
     }
   })
   return null;
 }
*/

/**
 * 调起微信支付界面
 */
function pay(data) {
	console.info(data.id)
	const _this = this;
	wx.requestPayment({
		timeStamp: data.timeStamp,
		nonceStr: data.nonceStr,
		package: data.package,
		signType: data.signType,
		paySign: data.paySign,
		success(e) {
			wx.showToast({
				title: '支付成功，请稍候....',
				icon: 'info',
				duration: 500
			})
		},
		fail(e) {
			wx.showToast({
				title: '您已取消支付',
				icon: 'warn',
				duration: 500
			})
			
			wx.request({
				url: getHost() + "/order/update",
				method: "POST",
				header: {
					"token": _this.getToken()
				},
				data: {
					"id": data.orderId,
					"orderResult": '1'
				}
			})
		}
	})
}

/**
 * 导出函数列表
 */
module.exports = {
	checkUpdate: checkUpdate,
	setLocationStorag: setLocationStorag,
	getLocationStorag: getLocationStorag,
	removeStorage: removeStorage,
	getToken: getToken,
	getHost: getHost,
	isLogin: isLogin,
	logOut: logOut,
	readyLogin: readyLogin,
	getTempLoginCode: getTempLoginCode,
	checkSession: checkSession,
	showAuthModel: showAuthModel,
	pay: pay
}
