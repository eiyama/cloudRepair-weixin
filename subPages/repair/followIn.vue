<template>
	<view>
		<u-navbar :background="background" :is-back="false" title-color="#fff" title="更新跟进状态">
			<view class="slot-wrap">
				<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>
				<!-- <view style="color:#FFFFFF;font-size: 32rpx;"></view> -->				
			</view>
		</u-navbar>
		<view style="background:#ffffff;">
			<u-field label-width="150" label="跟进状态" placeholder="请选择跟进状态" right-icon="arrow-right" v-model="status" :disabled="true" @click="insuredVehilots = true"></u-field>
			<u-select v-model="insuredVehilots" label-name="description" :list="stateDate" mode="single-column" @confirm="onVehicletype"></u-select>

			<u-field label-width="150" label="不回店原因" placeholder="请选择不回店原因" right-icon="arrow-right" v-if="Thereasonis" @click="inopReason = true" v-model="noReturnFactoryStatus" :disabled="true"></u-field>
			<u-select v-model="inopReason" mode="single-column" @confirm="onReason" label-name="description" :list="AllnoReturnStatus"></u-select>

			<view class="set_remind">
				<text class="set_remind_title">是否设置提醒</text>
				<u-switch v-model="statedata.isSetRemind" @change="changeRemind"></u-switch>			
			</view>
			<u-field label-width="150"
			 label="提醒时间" 
			 :disabled="true"
			 right-icon="arrow-right" 
			 v-if="statedata.isSetRemind" 
			 placeholder="请选择提醒时间"
			 v-model="statedata.reportTime"
			 @click="reportTime = true"
			 >			
			</u-field>		
			<u-picker mode="time" @confirm="registerDateConfirm" v-model="reportTime" :params="timeParams"></u-picker>
			
			<view class="div-formItm">
				<text>跟进内容</text>
				<textarea v-model="statedata.content" id="text_inp" rows="4" cols="50"></textarea>
			</view>
		</view>
		<view class="btn_create" @click="Preservation"  >
		  保存
		</view>
		
		<u-toast ref="uToast" />
	</view>
</template>
<script>
export default {
	data() {
		return {
			Vehilot: [],
			background: { backgroundColor: '#315ade' },
			ReasonState: [],
			insuredVehilots: false,
			remindTimedata: false,
			ReasonData: false,
			registerDate: false,
			Showthereason: false,
			inopReason: false,
			Thereasonis: false,
			startDate: new Date(),
			// registerDate: this.Common.Public.GetDateStr(0),
			timeParams:{
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: true
			},
			statedata: {
				repairOrderId: '',
				status: '',
				content: '',
				statedatastatedata: '',
				reportTime: '',
				noReturnFactoryStatus: '',
				isSetRemind: false
			},
			reportTime: false,
			description: [],
			status: '',
			// registerDate: "",
			noReturnFactoryStatus: '',
			stateDate: [],
			AllnoReturnStatus: []
		};
	},
	onShow() {
		var self = this;
		this.$http.get('/vi/repairOrder/getWordBooks?moduleName=' + '维修管理' + '&type=' + '跟进状态').then(res => {
			if (res.result) {
				this.stateDate = res.result;
				self.Vehilots = [];
				res.result.map(item => {
					var obj = {};
					obj.value = item.value;
					obj.label = item.description;
					self.Vehilots.push(obj);
				});
			}
		});
		this.$http.get('/vi/repairOrder/getWordBooks?moduleName=' + '维修管理' + '&type=' + '不回厂原因').then(res => {
			if (res.result) {
				this.AllnoReturnStatus = res.result;
				self.Reason = [];
				res.result.map(item => {
					var obj = {};
					obj.value = item.value;
					obj.label = item.description;
					self.Reason.push(obj);
				});			
			}
		});
	},
	onLoad(parmse) {
		this.statedata.repairOrderId = parmse.id;
	},
	methods: {
		// loadState: function(moduleName, type) {
		// 	Indicator.open('加载中...');
		// 	axiosGetAPI('/vi/repairOrder/Summary?moduleName=' + moduleName + '&type=' + type).then(res => {
		// 		if (res.result) {
		// 			Indicator.close();
		// 			this.stateDate = res.result;
		// 			var arr1 = [''];
		// 			var arr2 = [''];
		// 			for (var i = 0; i < this.stateDate.length; i++) {
		// 				arr1.push(this.stateDate[i].description);
		// 				arr2.push(this.stateDate[i].value);
		// 			}
		// 		}
		// 	});
		// },
		onVehicletype(e) {
			//滑动
			this.insuredVehilots = false;
			this.statedata.status = e[0].value;
			this.status = e[0].label;
			if (this.statedata.status == 'WB6366899450883613130063') {
				this.Thereasonis = true;
			} else {
				this.Thereasonis = false;
			}
		},

		// selInsureVehilots: function() {
		//   //选择状态
		//   this.insuredVehilots = false;
		//   // this.statedata.status = this.status;
		//   console.log(this.statedata.status)
		//   for (var i = 0; i < this.stateDate.length; i++) {
		//     if (this.status == this.stateDate[i].description) {
		//       this.statedata.status = this.stateDate[i].value;
		//     }
		//   }
		//   if (this.statedata.status == "WB6366899450883613130063") {
		//     this.Thereasonis = true;
		//   } else {
		//     this.Thereasonis = false;
		//   }
		// },
		onReason(e) {
			//滑动不回厂原因
			this.inopReason = false;
			this.statedata.noReturnFactoryStatus = e[0].value;
			this.noReturnFactoryStatus = e[0].label;
		},
		changeRemind(status) {
			this.statedata.isSetRemind = status;
		},
		// opReason: function() {
		//   //打开不回厂原因
		//   this.inopReason = true;
		// },
		// Determinethecause: function() {
		//   //选择不回厂原因
		//   this.inopReason = false;
		//   for (var i = 0; i < this.AllnoReturnStatus.length; i++) {
		//     if (this.noReturnFactoryStatus == this.AllnoReturnStatus[i].description) {
		//       this.statedata.noReturnFactoryStatus = this.AllnoReturnStatus[i].value;
		//     }
		//   }
		// },

		Preservation: function() {
			if (this.statedata.status == '') {
				this.$refs.uToast.show({title:'请选择跟进状态'});
				return false;
			}
			if (this.statedata.status == 'WB6366899450883613130063' && this.statedata.noReturnFactoryStatus == '') {
				this.$refs.uToast.show({title:'请选择不回店原因'});
				return false;
			} else {
				var model = this.statedata;			
				var id = this.statedata.repairOrderId;
				this.$http.post('/vi/repairOrder/saveRepairTrack', model).then(res => {
					uni.navigateBack({
						
					})
				});
			}
		},
		openBack: function() {
			uni.navigateBack({});
		},
		selRegisterDate: function() {
			// 打开报案日期选择层
			this.registerDate = true;
			this.reportTime = new Date();
			this.$refs.reportTime.open();
		},
		registerDateConfirm: function(e) {
			
			this.reportTime = false;
			this.statedata.reportTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e.second;
			// 选择报案日期
			// this.statedata.reportTime = this.Common.Public.dateString(this.reportTime);
			// this.$refs.reportTime.close();
		}
	}
};
</script>
<style lang="scss" Scoped>

.information {
	height: 25px;
	background-color: rgba(242, 242, 242, 1);
	padding-left: 10px;
	font-size: 12px;
	color: #999999;
	line-height: 20px;
	padding-top: 15px;
	border-bottom: 0.5px solid #e6e6e6;
}

.ils {
	margin-top: 44px;
}

.mint-field-core {
	display: none;
}

.mint-cell-wrapper {
	border-bottom: none;
}

.mint-formItm {
	padding-left: 20px;
}

.mint-cell-text {
	color: #333333;
}

.div-formItm {
	background: #ffffff;
	line-height: 20px;
	padding: 15px;
	color: #999999;
	font-size: 14px;
}

.div-formItm #text_inp {
	height: 100px;
	width: 100%;
	border: 1px solid #eeeeee;
	margin-top: 10px;
	padding: 5px;
}

.mint-radiolist-label {
	padding: 0;
}

.mint-radio-label {
	margin-left: 0;
}

.foore {
	height: 45px;
	background-color: rgba(242, 242, 242, 1);
	font-size: 12px;
	border-bottom: 0.5px solid #e6e6e6;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.btn {
	width: 90%;
	height: 70%;
	border-radius: 3px;
	background-color: rgba(0, 102, 255, 1);
	display: block;
	line-height: 25px;
	text-align: center;
	color: #fff;
	font-size: 16px;
}

.picker-items view:nth-child(4) {
	display: none;
}

.picker-items view:nth-child(5) {
	display: none;
}

.picker-slot-wrapper view:nth-child(4) {
	display: block;
}

.picker-slot-wrapper view:nth-child(5) {
	display: block;
}

.set_remind {
	font-size: 14px;
	padding: 10px 14px;
	display: flex;
	background: #ffffff;
	color: #303133;
	justify-content: space-between;
	align-content: center;
	border-bottom: 1rpx solid #e4e7ed;
	
}

.set_remind_title {
	display: flex;
	align-items: center;
}

.set_remind_body {
	display: flex;
	align-items: center;
	margin-left: 15px;
}

.set_remind_body input {
	margin-left: 15px;
}

/* .mint-cell:last-child{display: block; z-index: 99} */
</style>
