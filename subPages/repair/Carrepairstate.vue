<template>
  <view>
    <u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="维修登记">
    	<view class="slot-wrap">
    		<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>    		 
    	</view>			
    </u-navbar>
    <view class="cenmen">
		<u-field label-width="150" label="维修状态" placeholder="请选择维修状态" right-icon="arrow-right" v-model="repairsStatus" :disabled="true" @click="openVehilots"></u-field>
		<u-select v-model="insuredVehilots"   :list="Vehilots" mode="single-column" @confirm="oninsCorpCode"></u-select>      
    </view>
	<view class="btn_create" @click="Preservation"  >
	  保存
	</view>
	<u-toast ref="uToast" />
  </view>
</template>

<script>
var code = [ "准备配件", "维修中", "质检中", "维修完成"];
export default {  
  data() {
    return {
      // telephone:'',
      Vehilots: [ {value:'PrepareParts',label:'准备配件'},{value:'InMaintenance',label:'维修中'},{value:'QualityTesting',label:'质检中'},{value:'RepairFinish',label:'维修完成'}],
      insuredVehilots: false,
      registration: {
        repairOrderId: "",
        repairsStatus: "",
        smsContent: "",
        hasSendSMS: "",
        phone: ""
      },
      repairsStatus: "",
      checked:"false",
    };
  },
  onShow() {
    var self = this;
	uni.showLoading({
		title: '加载中...'
	});
    var id = self.registration.repairOrderId;
    this.$http.get("/vi/repairOrder/getRepairSchedule?repairOrderId=" + id).then(	
      res => {
		  uni.hideLoading();
        this.registration = res.result;
      }
    );
  },
  onLoad(parmese){
	    this.registration.repairOrderId = parmese.id;
  },
  methods: {
    oninsCorpCode(e) {
	  this.insuredVehilots = false;
	  this.registration.repairsStatus = e[0].value;
	  this.repairsStatus = e[0].label;		  	
	  this.registration.hasSendSMS = this.checked;
	  var repairsStatus = this.registration.repairsStatus;
	  var id = this.registration.repairOrderId;
	  uni.showLoading({ title: '加载中...' });
	  this.$http.get( "/vi/repairOrder/getRepairSchedule?repairOrderId=" +  id +
	      "&repairsStatus=" +
	      repairsStatus
	  ).then(res => {
		  uni.hideLoading();
	    this.registration.smsContent = res.result.smsContent;
	  });
    },
	
    openVehilots: function() {
      this.insuredVehilots = true;
    },  
    Preservation: function() {
      //点击保存
      if (this.repairsStatus == "") {
        // Toast("请选择维修状态");
		this.$refs.uToast.show({title:'请选择维修状态'});
        return false;
      }
      var registration = this.registration;
      this.$http.post("/vi/repairOrder/repairSchedule", registration).then(
        res => {
          uni.navigateBack({});          
        }
      );
    },
    openBack: function() {
      uni.navigateBack({});
    }
  }
};
</script>
<style Scoped>
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
.mint-formItm {
  padding-left: 20px;
}
.mint-cell-text {
  color: #333333;
}
.mint-radiolist .mint-cell {
  float: left;
  width: 33%;
}
.mint-radiolist-label {
  padding: 0;
}
.mint-radio-label {
  margin-left: 0;
}
/* .mt-radio{
  border: 0px;
} */
.textarea {
  position: relative;
  right: 0px;
  top: 0px;
  width: 100%;
  border: 1px solid #eeeeee;
}
.cenmen{margin-top: 0px;}
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
.view-formItm {
  background: #ffffff;
  line-height: 20px;
  padding: 15px;
  color: #999999;
  font-size: 14px;
}
.view-formItm #text_inp {
  height: 100px;
  width: 100%;
  border: 1px solid #eeeeee;
  margin-top: 10px;
  padding: 5px;
}
</style>
