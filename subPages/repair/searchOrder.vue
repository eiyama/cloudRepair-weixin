<template>
  <view>   
	<u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="工单查询">
		<view class="slot-wrap">
			<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>	
		</view>			
	</u-navbar>
    <view class="cenmen">
      <view class="Order_search">
        <view id="Search_title">请至少输入或选择一个查询条件，以便快速筛选工单</view>
		
		<u-field   label="车牌号" label-width="150"  v-model="registration.plateNo"   placeholder="请输入车牌号码" >
		</u-field>		
		<u-field   label="客户姓名" label-width="150"  v-model="registration.name"   placeholder="请输入客户姓名" >
		</u-field>
		<u-field   label="手机号" label-width="150"  v-model="registration.phone"   placeholder="请输入手机号" >
		</u-field>
		<u-field   label="工单号" label-width="150"  v-model="registration.jobNumber"   placeholder="请输入工单号" >
		</u-field>
		
		<u-field   label="保险公司" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="insCorpName"  @click="opchoose_Corp" placeholder="请选择保险公司" >
		</u-field>	
		<u-select v-model="insuredVehilots" label-name="name" :list="data_Corp" mode="single-column" @confirm="Corp_confirm"></u-select>
		
		<u-field   label="工单来源" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="sourceType"  @click="issourceType = true " placeholder="请选择工单来源" >
		</u-field>	
		<u-select v-model="issourceType" label-name="description" :list="VehilotList" mode="single-column" @confirm="source_confirm"></u-select>						
		        
      </view>	   
	  <view class="btn_create" @click="seach_btn"  >
	    查询
	  </view>      
    </view>
  </view>
</template>
<script>

export default {
  data() {
    return {
      issourceType: false,
      select_index: 0,  
	  registration:{
	    plateNo: '',
	    name: '',
	    phone: '',
	    jobNumber: '',
	    insCorpCode: '',
	    sourceType: ''
	  },
      sourceTypeNames: [],
      sourceTypeCodes: [],
      insuredVehilots: false,
      id: "",
      jobNumber: "",
      corp: [{ code: 'picc', fullname: '中国人保' }],
      insCorpName: '',
      name: "",
      phone: "",
      plateNo: "",
      model: "",
      reportTime: "",
      reportAddress: "",
      canMoveCar: "",
      canMoveCarDisplay: "",
      conductorUserName: "",
      conductorOrgName: "",
      sourceTypeDisplay: "",
      orderStatus: "",
      orderStatusDisplay: "",
      trackStatusDisplay: "",
      repairsStatusDisplay: "",
      creatorName: "",
      createdTime: "",
      modifiedTime: "",
      sourceType: "",
	  data_Corp:[],
	  VehilotList:[],
      statedata: {
        insCorpName: '',
        sourceType: ''
      }
    }
  },
  onShow() {
	  uni.showLoading( );
    this.$http.get('/vi/insCompanies').then(res => {
	  uni.hideLoading();
      if (res.result) {        
        for (var i = 0; i < res.result.length; i++) {
    			  var obj = {name:'',value:''};
          if(res.result[i].code == 'picc' || res.result[i].code == 'pingan' || res.result[i].code == 'cpic' ){
    				obj.name = res.result[i].shortName;
    				obj.value = res.result[i].code;
    				this.data_Corp.unshift(obj)                          
          }else{
    				obj.name = res.result[i].shortName;
    				obj.value = res.result[i].code;
    				this.data_Corp.push(obj);                          
          }          
        }    
      }     
    });
	  uni.showLoading( );
    this.$http.get('/vi/repairOrder/getWordBooks' + '?moduleName=' + '维修管理' + '&type=' + '工单来源')
      .then((res) => {
		uni.hideLoading();
        this.VehilotList = res.result;		
      });
	  
  },
  
  methods: {
     
    openBack: function() {
     uni.navigateBack({});
    },
    
    opchoose_Corp: function() {
      //打开不回厂原因
      this.insuredVehilots = true;
    },
	
    Corp_confirm: function(e) {
      this.insCorpName = e[0].label;
      this.insuredVehilots = false;
      // this.registration.insCorpName = this.insCorpName;
      this.registration.insCorpCode = e[0].value;
    },
      
    source_confirm: function(e) {
      this.issourceType = false;
      this.sourceType = e[0].label;
      this.registration.sourceType = e[0].value;
       
    },
      
    // 提交按钮
    seach_btn: function() {
        
      if (!this.registration.plateNo && !this.registration.name && !this.registration.phone && !this.registration.jobNumber && !this.registration.insCorpCode && !this.registration.sourceType) {
        // Toast('请至少输入或选择一个查询条件，以便快速筛选工单');
		this.$refs.uToast.show({title:'请至少输入或选择一个查询条件，以便快速筛选工单'});
        return;
      };
            
      uni.setStorageSync("registration", this.registration);
	  uni.navigateTo({
	  	url:'./searchResult'
	  })
      // this.$router.push({ path: "/repair/Searchresult" });
    },

  }

}

</script>
<style lang="scss" Scoped>
.Order_search {
  background: #ffffff;
  margin: 10px;
  border: 0.5px solid #f0f0f0;
}

#Search_title {
  color: dodgerblue;
  margin: 15px 10px 5px 10px;
  font-size: 12px;
}

.mint-cell-value .mint-field-core {
  display: none;
}

.mint-field .mint-cell-title {
  padding-left: 10px;
}

.btn_search {
  background: #fff;
  border: 0.5px solid #0d82f4;
  color: #0d82f4;
  border-radius: 10px;
  font-size: 15px;
  padding: 1px 5px;
  text-align: center;
  line-height: 30px;
  margin: 30px;
}

.mint-field-other {
  width: 98%;
}

.mint-field-other input {
  width: 88%;
  color: #333;
  font-size:14px;
}

</style>
