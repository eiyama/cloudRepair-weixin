<template>
  <view>
    <u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="交车">
    	<view class="slot-wrap">
    		<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>
    		 
    	</view>			
    </u-navbar>
    <view class="cenmen">
		<u-field label-width="180" label="实际支付费用" placeholder="请输入"  v-model='Turninacar.paymentAmount' ></u-field>
		<u-field label-width="180" :disabled="true" label="费用承担方" placeholder="请选择" right-icon="arrow-right" @click="insuredVehilots = true" v-model="paymentModeType" ></u-field>
		<u-select v-model="insuredVehilots"   :list="TurninacarList" mode="single-column" @confirm="oninsCorpCode"></u-select>    
    </view>
	<u-toast ref="uToast" />
	<view class="btn_create" @click="Preservation"  >
	  保存
	</view>
  </view>
</template>
<script>
export default { 
  data() {
    return {
      insuredVehilots: false,
      registerDate: false,
	  paymentModeType:'',
      Turninacar: { "repairOrderId": "", "paymentModeType": "", "paymentAmount": "" },
	  TurninacarList: [{label: '保险公司', value: 'InsCorp'}, {label: '车主', value: 'Customer'}, {label: '双方共担', value: 'Common'}]
    }
  },
  onShow: function() {
    var self = this;    
	 uni.showLoading({ title: '加载中...' });
    this.$http.get('/vi/repairOrder/getRepairOrder?repairOrderId=' + self.Turninacar.repairOrderId)
      .then((res) => {
		   uni.hideLoading();
        this.orderdetails = res.result
        this.Turninacar.paymentAmount = this.orderdetails.fixedAmount
      })
  },
  onLoad(parmse){
	this.Turninacar.repairOrderId = parmse.id;
  },
  methods: {
    openBack: function() {
      uni.navigateBack({ });
    },
	oninsCorpCode(e){
		this.paymentModeType = e[0].label;
		this.Turninacar.paymentModeType = e[0].value;
	},	
    Preservation: function() {
      if (this.Turninacar.paymentAmount == '') {   
		this.$refs.uToast.show({title:'请输入实际支付费用'});
        return false;
      } else {
        if (!this.Turninacar.paymentAmount) {        
		  this.$refs.uToast.show({title:'输入有误'});
          return false;
        }
      }
      if (this.Turninacar.paymentModeType == '') {       
		 this.$refs.uToast.show({title:'请选择费用承担方'});
        return false;
      } else {
        var Turninacar = this.Turninacar;
        var id = this.Turninacar.repairOrderId
        // this.$router.push({path:"/quoteManagement/orderdetails?id"+id})
        this.$http.post("/vi/repairOrder/payment", Turninacar).then(res => {
          // var id = this.statedata.repairOrderId;
          uni.navigateBack({ });
        })
      }
    }
  }
}

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
  border-bottom: 0.5px solid #E6E6E6;
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
  width: 100%
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
  border-bottom: 0.5px solid #E6E6E6;
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

/* .cenmen{margin-top: 64px;} */
.mint-radio-label {
  font-size: 13px;
}

.mint-radiolist-label {
  padding: 0;
}

</style>
