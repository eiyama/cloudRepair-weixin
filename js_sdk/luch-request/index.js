import Request from './request'
import helper from '../../common/helper.js';

const test = new Request()
var root = helper.apiHost;
var token = '';
var appId = '';

if (uni.getStorageSync('token')) {
	token = uni.getStorageSync('token');
}
if (uni.getStorageSync('appId')) {
	appId = uni.getStorageSync('appId');
}

test.setConfig((config) => { /* 设置全局配置 */
	//设置的基地址
	config.baseUrl = root
	//设置的请求头
	config.header = {
		...config.header,
		"Authorization": token,
		"x-appId":appId
	}
})

test.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	var token = '';

	if (uni.getStorageSync('token')) {
		token = uni.getStorageSync('token');
	}
	if (uni.getStorageSync('appId')) {
		appId = uni.getStorageSync('appId');		
	}
	config.header = {
		...config.header,
		"Authorization": token,
		"x-appId":appId
	}
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
test.validateStatus = (statusCode) => {
	return statusCode === 200
}

test.interceptor.response((response) => { /* 请求之后拦截器 */
	return response
}, (response) => { // 请求错误做点什么
	return response
})

const http = new Request()

http.setConfig((config) => { /* 设置全局配置 */
	config.baseUrl = root /* 根域名不同 */
	config.header = {
		...config.header,
		"Authorization": token,
		"x-appId":appId
	}
	return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	var token = '';

	if (uni.getStorageSync('token')) {
		token = uni.getStorageSync('token');
	}
	if (uni.getStorageSync('appId')) {
		appId = uni.getStorageSync('appId');		
	}
	config.header = {
		...config.header,
		"Authorization": token,
		"x-appId":appId
	}
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	return config
})

http.interceptor.response((response) => { /* 请求之后拦截器 */
	if (response.status == 401) { // 服务端返回的状态码不等于200，则reject()
		uni.navigateTo({
			url: '/pages/tabbar/myImfor/login.vue'
		});
		return response;
	}else if(response.data.status == 200){
		return response.data;
	}else{
		return response;
	}	
}, (response) => { // 请求错误做点什么
	return response
	// helper.showErrorDialog(response.errMsg)
})

export {
	http,
	test
}
