<template>
	<view class="map_container">
		发会
		<!-- <map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers">
		</map> -->
	</view>
	
</template>

<script>
// import amap from '../../../common/amap-wx.js'
export default{
	data(){
		return{
			amapPlugin: null,
			key:'2d4de73f65c8e8ff6ea0835e8cd16684',//高德地图应用key(小程序)
			id:0, // 使用 marker点击事件 需要填写id
			title: 'map',
			latitude: 0,
			longitude: 0,
			addressName:'',
			covers: [{
				latitude: 39.909,
				longitude: 116.39742,
				// iconPath: '../../../static/location.png'
			}, {
				latitude: 39.90,
				longitude: 116.39,
				// iconPath: '../../../static/location.png'
			}],
			
		}
	},
	onLoad(parmse) {
		this.addressName = parmse.address;
		// this.amapPlugin = new amap.AMapWX({
		// 	key: this.key
		// });
	},
	onShow(){
		this.chooseLocation();
		// this.getRegeo();
	},
	methods: {
		chooseLocation(){
			var self = this;
		    // 先判断定位权限是否开启
		    uni.getLocation({
		        success(res){
					self.latitude = res.latitude;
					self.longitude = res.longitude;
					// console.log('当前位置的经度：' + res.longitude);
					// console.log('当前位置的纬度：' + res.latitude);
		            //定位权限开启，打开地图
		            uni.openLocation({
						latitude: res.latitude,
						longitude: res.longitude,						
						scale: 18,
						address: self.addressName,//详细地址名称
					})
					// uni.chooseLocation({
					//     success: function (res) {
					//         console.log('位置名称：' + res.name);
					//         console.log('详细地址：' + res.address);
					//         console.log('纬度：' + res.latitude);
					//         console.log('经度：' + res.longitude);
					//     }
					// });
		        },
		        fail(e) {
		            // 定位权限未开启，引导设置		     
					uni.showModal({
		                title: '温馨提示',
		                content: '您已拒绝定位,请开启',
		                confirmText: '去设置',
		                success(res){
		                    if (res.confirm) {
		                        //打开授权设置
		                        this.openSetting()
		                    }
		                }
		            })
		        }
		    });					 			
		},
		openSetting(){
		    // 打开小程序的设置
		    // #ifdef MP-WEIXIN
		    uni.openSetting()
		    // #endif
		    
		    // App跳转系统的设置界面
		    // #ifdef APP-PLUS
		    uni.getSystemInfo({
		        success(res) {
		            if(res.platform=='ios'){ //IOS
		                plus.runtime.openURL("app-settings://");
		            } else if (res.platform=='android'){ //安卓
		                let main = plus.android.runtimeMainActivity();
		                let Intent = plus.android.importClass("android.content.Intent");
		                let mIntent = new Intent('android.settings.ACTION_SETTINGS');
		                main.startActivity(mIntent);
		            }
		        }
		    });
		    // #endif
		},
		
		getRegeo() {
			uni.showLoading({
				title: '获取信息中'
			});
			this.amapPlugin.getRegeo({
				success: (data) => {
					console.log(data)
					this.latitude = data[0].latitude;
					this.longitude = data[0].longitude;
					var obj = {};
					obj.latitude = data[0].latitude;
					obj.longitude = data[0].longitude;
					this.covers = [];
					this.covers.push(obj);
					this.addressName = data[0].name;
					uni.hideLoading();
					}
				});
			}
	}


}
</script>

<style scoped>
	.map_container{
	  position: absolute;
	  top: 0;
	  bottom: 0;
	  left: 0;
	  right: 0;
	}
</style>
