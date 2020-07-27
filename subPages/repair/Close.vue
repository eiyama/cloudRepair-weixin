<template>
  <view style="height: 100vh;background-color: #FFFFFF;">    
	<u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title=" 关闭">
		<view class="slot-wrap">
			<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>	
		</view>			
	</u-navbar>
    <view class="cenmen">
      <u-field :required="true" label="关闭原因" label-width="190" :disabled="true" right-icon="arrow-right"
        v-model="closedCategory"  @click="openVehilots" placeholder="请选择关闭原因" >
      </u-field>	
      <u-select v-model="insuredVehilots" mode="single-column" @confirm="selInsureVehilots" label-name="description" :list="closeList"></u-select>
      
	  <u-field :required="true" type="textarea" label="关闭描述" label-width="190"  v-model="registration.closeRemark"  placeholder="请填写关闭描述" >
	  </u-field>	
			       
    </view>
	<view class="btn_create" @click="Preservation"  >
	  关闭
	</view>
	<u-toast ref="uToast" />
  </view>
</template>
<script>

export default {
  name: "Newwork",
  data() {
    return {
      insuredVehilots: false,
      registration: { repairOrderId: "", closedCategory: "", closeRemark: "" },
      closedCategory: "",
      closeStatus: [],
      closeDescription: [],
	  closeList:[],
    };
  },
  onShow() {
    var self = this;
	uni.showLoading({
		title: '加载中...'
	});
    this.$http.get(
      "/vi/repairOrder/getWordBooks?moduleName=" +
      "维修管理" +
      "&type=" +
      "关闭原因"
    ).then(res => {
		uni.hideLoading();
      if (res.result) {
		  this.closeList = res.result;
        for (var i = 0; i < res.result.length; i++) {
          this.closeDescription.push(res.result[i].description);
          this.closeStatus.push(res.result[i].value);
        }
      }
    });
    
  },
  onLoad(data){
	this.registration.repairOrderId = data.id;  
  },
  computed: {   
  },
  methods: {   
    openVehilots: function() {
      this.insuredVehilots = true;
    },
    selInsureVehilots: function(e) {
	  this.closedCategory = e[0].label;
      this.insuredVehilots = false;
      this.registration.closedCategory = e[0].value;	   
    },
    Preservation: function() {
      //点击保存
      if (this.closedCategory == "") {
        // Toast("请选择关闭原因");
		this.$refs.uToast.show({title:'请选择关闭原因'});
        return false;
      }
      if (this.registration.closeRemark == "") {
        // Toast("请填写关闭描述");
		this.$refs.uToast.show({title:'请填写关闭描述'});
        return false;
      } 
        var registration = this.registration;
        // console.log(registration)
		uni.showLoading({
			title: '请稍等'
		});
        this.$http.post("/vi/repairOrder/close", registration).then(res => {
			uni.hideLoading();
          uni.navigateBack({  });
        });
      
    },
    openBack: function() {
      uni.navigateBack({ });
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

/* .cenmen{margin-top: 64px;} */
.textarea {
  height: 60px;
  width: 245px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.mint-cell:last-child {
  background: #ffffff;
}

.btn_allocation {     
     color: #315ade;
     background: rgb(255, 255, 255);
     border: 1px solid #315ade;
	 margin:10px;
	 margin-top: 30px;
}
</style>
