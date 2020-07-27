// const apiHost = 'http://192.168.6.183:10460';//测试环境
// const apiHost = 'http://192.168.6.160:8089';//测试环境
const apiHost = 'https://repair.bandins.com/apis';

const showErrorDialog = function (errMsg) {
	uni.showModal({
	    title: '系统提示',
	    content: errMsg,
		showCancel:false,
		confirmText:'我知道了',
	    success: function (res) {
	    }
	});
}
export default {  
    apiHost,  
    showErrorDialog,
}

