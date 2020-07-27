<template>
	<view class="login">
		<view class="login-images">
		    <image style="  width:100%;height: 160px;margin-bottom: 15px;" src="../../../static/img/login-banner.png" alt="">
			</image>
		</view>
		<view class="box">			
			<text class="mint-login-hd">			       
			    欢迎登录{{title}}
			</text>
			<view class="" style="margin-top: 30px;">
				<u-field  label="账号" label-width="150"  v-model="form.userName"   placeholder="请输入账号" > </u-field>
				<u-field  type="password"  label="密码" label-width="150"  v-model="form.password"   placeholder="请输入密码" > </u-field>
			</view>			
			<view class="submitBtn">
				<u-button  shape="square" type="info"   style="background: #357bfd;color:#FFFFFF;" @click="submit">登录</u-button>
			</view>
		</view>			
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import helper from './../../../common/helper.js';
	export default {
		data() {
			return {
				form: {
					userName: '',
					password: '',
				},
				appId:'',
				title:''
			};
		},
		 
		onLoad(params) {
			// console.log(params)
			var self = this;
			if(params.appId){				
				const appId = params.appId;
				this.appId = appId;
				uni.setStorageSync('appId', appId);	
			}
			if(uni.getStorageSync('appId')){
				this.appId = uni.getStorageSync('appId');				
			}
		},
		onShow(){	
			
			  this.$http.get('/apis/apps/' + this.appId  + "/H5").then((res) => {			       
			      this.title = res.result.name;
			    });
		},
		methods: {
			submit() {
					if(!this.form.userName){
						this.$refs.uToast.show({title:'请输入用户名'});  
						return;
					}
					if(!this.form.password){
						this.$refs.uToast.show({title:'请输入密码'});  
						return;
					}
						this.$http.post('/token',this.form).then(res=>{
							if(res.status == 200){
								uni.setStorageSync('token', res.result.token);
								uni.setStorageSync('conductorUserId', res.result.userId);
								this.$http.get('/Users/Me/Permissions').then((res) => {
								  if (res.result) {
									for (var i = 0; i < res.result.permissions.length; i++) {
									  if (res.result.permissions[i] == "SiteOwner" || res.result.permissions[i] == "LookRepairOrderManage") {
										uni.setStorageSync('hasManage', true)
										return;
									  } else {
										uni.setStorageSync('hasManage', false)
									  }
									}
								  }
								});
								
								this.$http.get("/Users/Me").then(res => {
								  if (res.result) {
									var respersonal =  res.result;
									uni.setStorageSync('personal', respersonal);
								  }
								});
										
								uni.switchTab({
									url: '/pages/tabbar/repair/index'
								});
							}else {
									helper.showErrorDialog(res.data.errMsg);
								}
						}).catch(err => {
								// console.log(err);
								helper.showErrorDialog(res.data.errMsg);
						});
				 
			},						   			
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
		},
		
		
	}
</script>

<style scoped lang="scss">
	.login{				 
		background-color: #FFFFFF;
		height: 100vh;		
	}
	.box{
		 padding: 50rpx;
	}
	.submitBtn{
		margin-top: 100rpx;
	}
	.mint-login-hd{
		font-size: 28px;
		color: #333;
		font-weight: 700;	
	}
</style>
