<template>
	<view>
		<u-navbar :background="background" :is-back="false" title-color="#fff" title=" 工单详情">
			<view class="slot-wrap">
				<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>								
			</view>
		</u-navbar>
		<view class="main">
			<view class="orderDetails_title">
			  <view class="quote">
			    <view class="_mt-list-top">
			      <text>工单号:{{orderdetails.jobNumber}}</text>
			      <text>{{orderdetails.createdTime}}</text>
			    </view>
			    <h4>
			      {{orderdetails.plateNo ? (orderdetails.name ? (orderdetails.plateNo + " -- " +orderdetails.name) : orderdetails.plateNo): (orderdetails.name ? orderdetails.name: "")}}
			    </h4>
			    <text>{{orderdetails.model}}</text>
			    <span>{{orderdetails.orderStatusName}}</span>
			  </view>
			  <view class="bottom_image">				  
				<image style="width: 100%;height: 48rpx;" src="../../static/img/ic_detail_banner.png" mode=""></image>
			</view>
			</view>
			<view>
			  <view class="Followuprecord" @click="Followuprecord">
			    <text class="followHistory">跟进记录：</text>
			    <view class="Followup_detail">
			      <view class="detail_text">最后一次跟进：{{lastfollowTime}}</view>
			      <view class="detail_text">内容：{{lastfollowContent}}</view>
			    </view>
				<image  style="width:30rpx;height: 30rpx;"  src="../../static/img/right_icon.png" mode=""></image>		     
			  </view>
			  <view class="information_detail">
			    <text class="title">短信内容：</text>
			    <view class="detail" v-html="orderdetails.smsContent"></view>
			  </view>
			  <view class="information-date">
			    <view class="infotmation_title">
			      <text class="title">保险报案信息：</text>
			    </view>
				
				<view class="" style="padding:10px;font-size:14px;width: 100%;">
					<view>
					  <view class="flex inforItem">
					    <text style="color:#999;text-align:left;font-weight:normal">保险公司：</text>
					    <text style="color:#333;text-align:left">{{orderdetails.insCorpShortName}}</text>
					  </view>					  
					  <view class="flex inforItem">
					    <text style="color:#999;text-align:left;font-weight:normal">报案号：</text>
					    <text style="color:#333;text-align:left">{{orderdetails.reportNo}}</text>
					  </view>
					  <view class="flex inforItem">
					    <text style="color:#999;text-align:left;font-weight:normal">报案时间：</text>
					    <text style="color:#333;text-align:left">{{orderdetails.reportTime ? orderdetails.reportTime : ''}}</text>
					  </view>
					  <view class="flex inforItem" v-show="orderdetails.phone"> 
						   <text style="color:#999;text-align:left;font-weight:normal" >客户电话：</text>
						   <view class="" @click="callPhone(orderdetails)">
							<image  style="width:30rpx;height: 30rpx;"  src="../../static/img/phone.png" mode=""></image>
							{{orderdetails.phone ? orderdetails.phone : ''}}
						  </view>	
					  </view>
					  <view class="flex inforItem"  @click="toMap(orderdetails.reportAddress)">
					    <view style="width:120px;color:#999;text-align:left;font-weight:normal">出险地址：</view>
					    <view style="color:#315ade;text-align:left;word-break: break-all; word-wrap: break-word;">
							{{orderdetails.reportAddress ? orderdetails.reportAddress  : ''   }}						 
						</view>												 
					  </view>
					  <view v-show="orderdetails.reportAddress" class=""  @click="toMap(orderdetails.reportAddress)">
						<image style="height: 140px;width: 100%;" src="../../static/img/map.png" mode=""></image>
					  </view>
					</view>
				</view>										    
			  </view>
			</view>
			<view>			 
			  <view class="information-date">
			    <view class="infotmation_title">
			      <text class="title">车辆服务状况：</text>
			    </view>
				<view class="" style="padding:10px;font-size:14px;width: 100%;">
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal">是否可行驶：</text>
					  <text v-if="panduan=='Travel'" style="color:#333;text-align:left">
						  是
					  </text>
					  <text v-else style="color:#333;text-align:left">
					  	 否
					  </text>
					</view>					  
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal">是否需要接车：</text>
					  <text v-if="panduan=='Travel'" style="color:#333;text-align:left">
						否
					  </text>
					  <text v-else style="color:#333;text-align:left">
					  	 是
					  </text>
					</view>	
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal">接车员：</text>
					  <text  style="color:#333;text-align:left">
						{{orderdetails.conductorUserName}}
					  </text>					 
					</view>						
				</view>			    
			  </view>
			</view>
			<view v-show="Fixedloss">
				
			 <view class="information-date">
			    <view class="infotmation_title">
			      <text class="title"> 车辆定损情况：</text>
			    </view>
				<view class="" style="padding:10px;font-size:14px;width: 100%;">				
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal">定损状态：</text>
					  <text style="color:#333;text-align:left">
						  {{fixedTime}}
						  <text class="tddeta" style="margin-left: 20px;" @click="toLossrecord">定损记录</text>
					  </text>
					</view>
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal">定损金额：</text>
					  <text style="color:#333;text-align:left">
						 ￥{{orderdetails.fixedAmount}}
					  </text>
					</view>				
				</view>			   
			  </view>
			</view>
			<view v-show="Maintenance">
			  <view class="information-date">
			    <view class="infotmation_title">
			      <text class="title">车辆维修情况：</text>
			    </view>
				<view class="" style="padding:10px;font-size:14px;width: 100%;">
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal">维修状态：</text>
					  <text style="color:#333;text-align:left">
						  {{orderdetails.repairsStatusName}}
						  <!-- <text class="tddeta" style="margin-left: 20px;" @click="Maintenancerecord">维修记录</text> -->
					  </text>
					</view>	
					<view class="flex inforItem" v-if="orderdetails.paymentAmount">
					  <text style="color:#999;text-align:left;font-weight:normal">维修金额：</text>
					  <text style="color:#333;text-align:left">
						 ￥{{orderdetails.paymentAmount}}
					  </text>
					</view>					
				</view>			    				
			  </view>
			</view>
			<view v-show="Trafficcondition">
			  <view class="information-date">
			    <view class="infotmation_title">
			      <text class="title">交车情况</text>
			    </view>
				<view class="" style="padding:10px;font-size:14px;width: 100%;">					
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal;width: 120px;">实际支付维修费：</text>
					  <text style="color:#333;text-align:left">
						 ￥{{orderdetails.paymentAmount}}
					  </text>
					</view>	
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal;width: 120px;">费用承担方：</text>
					  <text style="color:#333;text-align:left">
						 ￥{{orderdetails.payModeName}}
					  </text>
					</view>
					<view class="flex inforItem">
					  <text style="color:#999;text-align:left;font-weight:normal;width: 120px;">交车状态：</text>
					  <text style="color:#333;text-align:left">
						 ￥{{orderdetails.paiedTime}}
					  </text>
					</view>					
				</view>			    
			  </view>
			</view>
			<view class="status_btn" v-show="btn">
			   <button shape="square" size="mini" v-show="orderdetails.orderStatus=='TobeConfirmed' || orderdetails.orderStatus=='Following'|| orderdetails.orderStatus=='Repaireing'" @click='Tocompile'>编辑</button>				 
			  <button @click="allocation" shape="square" size="mini" v-show="allocation_status">转单</button>
			  <button @click="actionSheet" shape="square" size="mini" v-show="follow_up">跟进</button>
			  <button @click="Lossstate" shape="square" size="mini" v-show="loss_assessment">定损</button>
			  <button @click="Carrepairstate" shape="square" size="mini" v-show="maintain">维修</button>
			  <button @click="Turninacar" shape="square" size="mini" v-show="handIn_car">交车</button>
			  <button @click="Close" shape="square" size="mini" v-show="close_btn">关闭</button>
			  
			</view>
		</view>			
	</view>
</template>

<script>
	import QQMapWX from '../static/qqmap-wx-jssdk.min.js';
	export default {
		data() {
			return {
				background: { backgroundColor: '#315ade' },
				active: "tab-container1",			
				condition: [
					{ name: "更新跟进状态" },
					{ name: "更新维修状态" },
					{ name: "更新交车状态" }
				  ],
				  sheetVisible: false,
				  lastfollowTime: '',
				  lastfollowContent: '',
				  Servicestatus: false,
				  btn: true,
				  allocation_status: false,
				  follow_up: false,
				  loss_assessment: false,
				  maintain: false,
				  handIn_car: false,
				  close_btn: false,
				  fixedAmount: 0,
				  Fixedloss: false,
				  Trafficcondition: true,
				  Maintenance: false,
				  fixedTime: "",
				  panduan: '',
				  itemId:'',
				  latitude:'',
				  longitude:'',
				  qqmapsdk:null,
				  orderdetails: [
					[{
					  id: "",
					  jobNumber: "",
					  sourceType: "",
					  pushRepairType: "",
					  isolationCode: "",
					  insCorpCode: "",
					  reportNo: "",
					  reportTime: "",
					  reportAddress: "",
					  phone: "",
					  smsContent: "",
					  plateNo: "",
					  model: "",
					  name: "",
					  orderStatus: "",
					  canMoveCar: "",
					  conductorUserId: "",
					  conductorConfirmTime: "",
					  conductorOrgCode: "",
					  fixedAmount: "",
					  fixedTime: "",
					  repairsStatus: "",
					  repairsTime: "",
					  payMode: "",
					  paiedTime: "",
					  paymentAmount: "",
					  closedTime: "",
					  closedCategory: "",
					  closeRemark: "",
					  isCurrentUser: "",
					  sourceTypeName: "",
					  sourceTypeText: "",
					  pushRepairTypeName: "",
					  repairsStatusName: "",
					  orderStatusName: "",
					  payModeName: "",
					  insCorpShortName: "",
					  organizationName: "",
					  creatorName: "",
					  conductorUserName: "",
					  modifiedTime: "",
					  createdTime: "",					 
					  repairOrderTrackDescription: "",
					  fixedItem: [{ repairItem: "", createdTime: "" }],
					  repairAttachment: [{ id: "", filePath: "" }],
					  repairTrackStatus: [{
						status: "",
						content: "",
						isSetRemind: "",
						remindTime: "",
						createdTime: ""
					  }],
			
				}]
				  ]
			};
		},
		onLoad(parms){
			this.itemId = parms.id;
			this.qqmapsdk = new QQMapWX({
			    key: 'XZ4BZ-EKKHS-LINOK-6BZWP-UNZG3-OMBYK'
			});
						 
		},
		onShow(){
			 var self = this;	
			  uni.showLoading({
				title: '加载中...'
			  });
			    this.$http.get("/vi/repairOrder/getRepairOrder?repairOrderId=" + this.itemId).then(res => {
					 uni.hideLoading();
			        this.orderdetails = res.result;
			        self.lastfollowContent = self.orderdetails.repairTrackStatus[0].content;
			        self.lastfollowTime = self.orderdetails.repairTrackStatus[0].createdTime;
					if(self.orderdetails.smsContent){
						var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
						self.orderdetails.smsContent = self.orderdetails.smsContent.replace(reg,"<a href='$1$2'>$1$2</a>");
						// console.log(self.orderdetails.smsContent);
					}													
															
			        if (this.orderdetails.canMoveCar == false) {
			          this.orderdetails.canMoveCar = "否";
			        }
			        if (this.orderdetails.canMoveCar == true) {
			          this.orderdetails.canMoveCar = "是";
			        }
			        if (this.orderdetails.paiedTime) {
			          this.orderdetails.paiedTime = "已交车";
			        }
			        if (this.orderdetails.fixedTime != undefined) {
			          this.fixedTime = "已定损";
			          this.Fixedloss = true;
			        }
			        if (
			          this.orderdetails.paymentAmount == undefined &&
			          this.orderdetails.payModeName == undefined &&
			          this.orderdetails.paiedTime == undefined
			        ) {
			          this.Trafficcondition = false;
			        }
			        if (this.orderdetails.repairsStatusName != undefined) {
			          this.Maintenance = true;
			        }
			        if (
			          this.orderdetails.orderStatus == "TobeConfirmed" ||
			          this.orderdetails.orderStatus == "Following"
			        ) {
			          // 待领取
			          this.follow_up = true;
			        } else if (this.orderdetails.orderStatus == "TobePendingLoss") {
			          // 待定损
			          // 定损按钮
			          // 关闭按钮
			          this.loss_assessment = true;
			          this.close_btn = true;
			        } else if (this.orderdetails.orderStatus == "TobeRepaired") {
			          // 待维修
			          // 定损按钮
			          // 维修按钮
			          // 关闭按钮
			          // this.loss_assessment = true;
			          this.maintain = true;
			          this.close_btn = true;
			        } else if (this.orderdetails.orderStatus == "Repaireing") {
			          // 维修中
			          // 维修按钮
			          this.maintain = true;
			          // this.loss_assessment = false;
			        } else if (this.orderdetails.orderStatus == "PendingVehicle") {
			          // 待交车
			          // 交车按钮
			          this.handIn_car = true;
			        } else {
			          this.btn = false;
			        }
			        if (this.orderdetails.orderStatus != "Closed" && this.orderdetails.orderStatus != 'Done' ) {
			          this.allocation_status = true;
			        }
			        this.panduan = this.orderdetails.canMoveCarStatus
			      }
			    );
		},
		methods:{
				Tocompile(){	
					uni.setStorageSync('orderdetails', this.orderdetails);					 					 
					uni.navigateTo({
						url:'./editOrder'
					})
				},
				toMap(e){
					if(e){
						this.chooseLocation(e);
					}
				},
				callPhone(item){
					uni.makePhoneCall({
						phoneNumber: item.phone //仅为示例
					});
				},
			    openBack: function() {
			     uni.navigateBack({
			     	
			     });
			    },
			    actionSheet: function() {
			      //跟进客户
			      var self = this;
			      var id = self.orderdetails.id;
			      uni.navigateTo({
			      	url:'./followIn?id=' + id
			      })
			    },
			    Lossstate: function() {
			      this.loss_assessment = false;
			      //定损
			      var self = this;
			      var id = self.orderdetails.id;
			      // var fixedAmount = self.orderdetails.fixedAmount
				  uni.navigateTo({
				  		url: "./Lossstate?id=" + id
				  })	
			      // this.$router.push({ path: "/repair/Lossstate?id=" + id });
			    },
				chooseLocation(addressName){
					var self = this;	
					uni.showLoading({
						title: '正在打开导航...'
					});
					self.qqmapsdk.geocoder({
						//获取表单传入地址							 
						address:  addressName, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
						success: function(res) {//成功后的回调						 
						  var res = res.result;
						  self.latitude = res.location.lat;
						  self.longitude = res.location.lng;
						  uni.hideLoading();
						  // 先判断定位权限是否开启
						  uni.getLocation({
						      success(res){									
						          //定位权限开启，打开地图
						          uni.openLocation({
						  			latitude: self.latitude,
						  			longitude: self.longitude,						
						  			scale: 18,
						  			address:  addressName,//详细地址名称
						  		})					 
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
					  })
					 
				},
			    Carrepairstate: function() {
			      //修车
			      var self = this;
			      var id = self.orderdetails.id;
			      // this.$router.push({ path: "/repair/Carrepairstate?id=" + id });
				  uni.navigateTo({
				  		url:  "./Carrepairstate?id=" + id 
				  })	
			    },
			    Turninacar: function() {
			      //交车
			      var self = this;
			      var id = self.orderdetails.id;
				  uni.navigateTo({
				  		url:"./Turninacar?id=" + id
				  })			      
			    },
			    Followuprecord: function() {
			      //跟进记录
			      var self = this;
			      var id = self.orderdetails.id;
				  uni.navigateTo({
						url:"./followInRecord?id=" + id
				  })
			  
			    },
			    Maintenancerecord: function() {
			      //维修记录
			      var self = this;
			      var id = self.orderdetails.id;
			      this.$router.push({ path: "./Maintenance?id=" + id });
			    },
			    toLossrecord: function() {
					console.log('23')
			      var self = this;
			      var id = self.orderdetails.id;
			      uni.navigateTo({
			      	url:"./Lossrecord?id=" + id
 			      })
			    },
			    allocation() {
			      var self = this;
			      var id = self.orderdetails.id;
				  uni.navigateTo({
				  	url:"./allocation?id=" + id
				  })
			      // this.$router.push({ path: "./Allocation?id=" + id });
			    },
			    Close: function() {
			      var self = this;
				  console.log('adsf');
			      var id = self.orderdetails.id;
				  uni.navigateTo({
				  	url:"./Close?id=" + id
				  })
			      // this.$router.push({ path: "./Close?id=" + id });
			    },
			   
		}
		
	}
</script>

<style lang="scss" scoped>
.slot-wrap {
	display: flex;
	padding: 0 30rpx;
	justify-content: space-between;
	align-items: center;
	flex: 1;
}

._mt-list-top {
  height: 40px;
  padding: 0 5px;
  line-height: 40px;
  /* margin-top: 40px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

._mt-list-top p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quote {
  width: 100%;
  text-align: center;
  background: #ffffff;
  padding-bottom: 20px;
}

.quote h4 {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-top: 20px;
}

.quote p {
  font-size: 14px;
  color: #666;
  line-height: 20px;
}

.quote span {
  color: #6699ff;
  margin-top: 6px;
  display: block;
  margin-bottom: 0;
}

.information {
  height: 25px;
  background-color: rgba(242, 242, 242, 1);
  padding-left: 10px;
  font-size: 12px;
  color: #999999;
  line-height: 25px;
}

.information_detail {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 10px 10px;
  border: 5px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.information_detail .title {
  font-size: 15px;
  color: #333;
  padding: 5px 10px;
  font-weight: bold;
  border-bottom: 0.5px solid #eee;
}

.information_detail .detail {
  font-size: 24rpx;
  color: #3a3a3a;
  padding: 20rpx;
  min-height: 20rpx;
}

.information-date {
  padding: 10px 0;
  margin: 10px 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
}

.information-date .infotmation_title {
  border-bottom: 0.5px solid #eee;
  padding: 0px 10px 10px 10px; 
}

 .infotmation_title .title {
 
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.tddeta {
  float: right;
  margin-right: 25px;
  color: #0066ff;
}

.footer {
  height: 15px;
  background: #eeeeee;
}

.status_btn {
  background: #fff;
  font-size: 15px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 80rpx;
}

.status_btn button {
  background: #fff;
  // border: none;
  color: #0066ff;
}

.mint-header.def-header {
  background: #0070d3;
}

.mint-header-title {
  height: 20px;
  color: #fff;
}

.mintui {
  color: #ffffff;
}

.foore {
  height: 40px;
}

.Followuprecord {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin: 10px 10px;
  min-height: 50px;
  padding: 20rpx;
  border: 1px solid #eee;
  border-radius: 5px;
  
}

.Followuprecord .followHistory {
  font-size: 15px;
  color: #333;
  font-weight: bold;
  width: 200rpx;
}

.Followuprecord .Followup_detail {
  width: 250px;
}

.Followuprecord .Followup_detail .detail_text {
  font-size: 12px;
  color: #6699ff;
}

.bottom_image img {
  width: 100%;
}
.main{
	margin-bottom: 100rpx;
}
.inforItem{
	min-height:60rpx;	
}
.inforItem text:nth-child(1){
	width: 120px;
}


</style>
