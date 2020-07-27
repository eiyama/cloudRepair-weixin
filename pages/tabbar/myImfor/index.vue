<template>
	<view class="main">		
		 <u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="个人中心">
		 	 		
		 </u-navbar>		   
		    <view class="_wrap-content">
		      <view class="_my-info" @click="TomyInfo">
		        <view class="_mt-my-head">
		          <image class="_my-head" src="../../../static/img/icon-profile.svg" alt>
			      </image>
		        </view>
		        <view class="_my-detail">
		          <view>{{accountName}}</view>
		          <text id="department">{{sellerName}}-{{sellerDeptName}}</text>
		        </view>
		        <span></span>
		      </view>
		      <view class="display_Orderfrom">
		        <text>
		          显示工单来源分析
		        </text>
					<u-switch v-model="orderFrom" @change="order_From"></u-switch>
		        <!-- <mt-switch v-model="orderFrom" @change="order_From"></mt-switch> -->
		      </view>
		      <view class="display_Orderfrom">
		        <text>
		          显示外拓到店率分析
		        </text>
				<u-switch v-model="tostoreRate" @change="tostore_Rate"></u-switch>
		        <!-- <mt-switch v-model="tostoreRate" @change="tostore_Rate"></mt-switch> -->
		      </view>
		      <!-- @click="Signout" -->
		    </view>			
		  <button class="text-center" style=" margin:60px 15px;" @click="tologin">
				退出登录
		  </button>		 
		
	</view>
</template>

<script>
	import helper from './../../../common/helper.js';
	export default {
		data() {
			return {
				  tostoreRate: false,
				  orderFrom: false,
				  selected: "1",
				  plante: "myInfo",
				  title: "",
				  accountName: "",
				  sellerName: "",
				  sellerDeptName: "",
				  token: "",
				  hide: true
			};
		},
		onLoad(params) {
			// console.log(params)
			if(params.appId){				
				const appId = params.appId;
				uni.setStorageSync('appId', appId);	
			}
		},
		onShow(){			
				this.orderFrom = this.$store.state.isOrderFrom;
			    this.tostoreRate = this.$store.state.isOutside;
			    var authMode = uni.getStorageSync("authMode");
			    if (authMode == "SingleUserMode") {
			      this.hide = false;
			    }
			    var localToken =  uni.getStorageSync("token");			     
			    let param = {
			      token: localToken
			    };
			    this.$http.post("/vi/account", param).then(res => {
			      this.accountName = res.result.accountName;
			      this.sellerName = res.result.sellerOrgName;
			      this.sellerDeptName = res.result.sellerDeptName;
			    });
		},
		methods: {
				tologin(){
					uni.removeStorageSync('registration');
					uni.removeStorageSync('orderdetails');
					uni.removeStorageSync('token');
					uni.removeStorageSync('hasManage');
					uni.removeStorageSync('personal');
					uni.navigateTo({
						url: './login'
					});				
				},			    
			    order_From() {
					this.$store.commit("orderFrom",  this.orderFrom);
			      // store.commit(, this.orderFrom);			    			     
			    },
			    tostore_Rate() {
					this.$store.commit("outside",  this.tostoreRate);			       
			    },
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$http.post('/token',this.form).then(res=>{
							if(res.status == 200){
								uni.setStorageSync('token', res.result.token);
								uni.switchTab({
									url: '/pages/tabbar/repair/index'
								});
							}else {
									helper.showErrorDialog(res.errMsg);
								}
						}).catch(err => {
								// console.log(err);
								helper.showErrorDialog(err);
						});
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style>
	
	._my-head{
		height:46px;
		width: 46px;
	}
	._my-info {
	  /* margin-top: 44px; */
	  height: 100px;
	  width: 100%;
	  padding: 10px;
	  display: flex;
	  align-items: center;
	  position: relative;
	  background: #ffffff
	}
	
	._my-info ._my-detail {
	  margin: 15px;
	}
	
	._my-info ._my-detail #department {
	  color: #666666
	}
	
	._my-info span {
	  font-size: 18px;
	  position: absolute;
	  color: #a4a4a4;
	  right: 40px;
	}
	
	.display_Orderfrom {
	  margin: 20px 10px;
	  border-radius: 5px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  background: #ffffff;
	  padding: 0 10px;
	  min-height: 100rpx;
	  
	}
	
	
	
</style>
