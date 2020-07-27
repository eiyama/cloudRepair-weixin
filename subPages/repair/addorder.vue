<template>
  <view style="margin-bottom: 100rpx;">
	  <u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="创建留修工单">
	  	<view class="slot-wrap">
	  		<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>	
	  	</view>			
	  </u-navbar>
    <view class="cenmen">
      <view class="smsContent_box">
        <view class="smsContent_title">
          <text>短信内容</text>
          <view class="smsAnalysis" @click="smsAnalysis">智能解析</view>
        </view>
        <view class="textarea_Box">
          <textarea class="text_inp"  v-model="registration.smsContent"></textarea>
        </view>
      </view>
      <view class="order_message">
        <view class="order_message_title">
          <text>留修工单信息</text>
        </view>
		<u-field :required="true" label="工单来源" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="sourceType"  @click="openchoose_type" placeholder="请选择工单来源" >
		</u-field>	
		<u-select v-model="issourceType" label-name="description" :list="VehilotList" mode="single-column" @confirm="source_confirm"></u-select>
    	
		<u-field :required="true" label="客户姓名" label-width="150"  v-model="registration.name"   placeholder="请输入客户(车主或联系人)姓名" >
		</u-field>
		<u-field :required="true" type="number" label="手机号" label-width="150"  v-model="registration.phone"   placeholder="请输入手机号" >
		</u-field>
		<u-field   label="车牌号" label-width="150"  v-model="registration.plateNo"   placeholder="请输入车牌号码" >
		</u-field>
		<u-field   label="品牌型号" label-width="150"  v-model="registration.model"   placeholder="请输入品牌型号" >
		</u-field>
		
        <u-field :required="true" label="保险公司" label-width="150" :disabled="true" right-icon="arrow-right"
          v-model="insCorpName"  @click="opchoose_Corp" placeholder="请选择保险公司" >
        </u-field>	
		<u-select v-model="insuredVehilots" label-name="name" :list="data_Corp" mode="single-column" @confirm="Corp_confirm"></u-select>
		
		<u-field   label="报案号" label-width="150"  v-model="registration.reportNo"   placeholder="请输入报案号" >
		</u-field>
		
		<u-field label-width="150"
		 label="报案时间" 
		 :disabled="true"
		 right-icon="arrow-right" 		 
		 placeholder="选择报案时间"
		 v-model="registration.reportTime"
		 @click="showPicker = true"
		 >			
		</u-field>		
		<u-picker mode="time" @confirm="registerDateConfirm" v-model="showPicker" :params="timeParams"></u-picker>
		
		<u-field   label="出险地址" label-width="150"  v-model="registration.reportAddress"   placeholder="请输入出险地址" >
		</u-field>
		
		<u-field :required="true" label="留修类型" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="pushRepairType"  @click="opchoose_Ordertype" placeholder="请选择留修类型" >
		</u-field>	
		<u-select v-model="type_order" label-name="name" :list="Order_type" mode="single-column" @confirm="type_confirm"></u-select>
		<view class="" style="margin: 0 10px;">
			<u-form-item label-width="150" label="车辆现状">
				<u-radio-group :shape="square" v-model="current"  @change="radioGroupChange" >
					<u-radio v-for="(item, index) in canMoveCarList"   :key="index" :name="item.name"  :value="item.value" >
						{{ item.name }}
					</u-radio>			
				</u-radio-group>
			</u-form-item>
		</view>
				
		<view class="conductorUser">
		  <view class="conductorUser_title">
		    接车员信息
		  </view>
		  
			<u-field :required="true" label="接车机构" label-width="150" :disabled="true" right-icon="arrow-right"
			  v-model="conductorOrg"  @click="opchoose_conductorOrg" placeholder="请选择接车机构" >
			</u-field>	
			<u-select v-model="conductorOrg_status" label-name="name" :list="dataCompany" mode="single-column" @confirm="conductorOrg_confirm"></u-select>		  
					
			<u-field :required="true" label="接车部门" label-width="150" :disabled="true" right-icon="arrow-right"
			  v-model="Department"  @click="opchoose_Department" placeholder="请选择接车部门" >
			</u-field>	
			<u-select v-model="Department_status" label-name="name" :list="departmentstate" mode="single-column" @confirm="Department_confirm"></u-select>		  		
			
			<u-field :required="true" label="接车员" label-width="150" :disabled="true" right-icon="arrow-right"
			  v-model="pickupcatPart"  @click="opchoose_pickupcatPart" placeholder="请选择接车员" >
			</u-field>	
			<u-select v-model="pickupcatPart_status" label-name="name" :list="pickupcatPart_Name" mode="single-column" @confirm="pickupcatPart_confirm"></u-select>		  
											 
		  </view>
    
      </view>
      <view class="btn_create" @click="btn_create" :disabled="isDisable">
        创建
      </view>
    </view>
		<u-toast ref="uToast" />
  </view>
</template>
<script>
export default {
  data() {
    return {
      isDisable: false,
      pickupcatPart_status: false,
      Department_status: false,
      conductorOrg_status: false,
      type_order: false,
      issourceType: false,
      Vehilot: [],
      data_Corp: [],
      insuredVehilots: false,
	  canMoveCarList:[
		  {
			value:'Unknown',
			name:'未知'
		  },
		  {
			value:'Travel',
			name:'可行驶'
		  },
		  {
			value:'NoTravel',
			name:'不可行驶'
		  }
	  ],
	  current:'',
      registration: {
        pushRepairType: "",
        insCorpCode: "",
        reportNo: "",
        reportTime: "",
        reportAddress: "",
        name: "",
        phone: "",
        pushRepairSMSId: "",
        plateNo: "",
        model: "",
        canMoveCar: "",
        sourceType: "",
        smsContent: "",
        conductorUserId: "",
        conductorOrgCode: "",
        conductorUserPhone: "",
        hasNotify: "",
        notifyContent: "",
        conductorOrg: "",
        Department: '',
        pickupcatPart: '',
        isSetRemind: ''
      },
	  timeParams:{
	  	year: true,
	  	month: true,
	  	day: true,
	  	hour: true,
	  	minute: true,
	  	second: true
	  },
      insCorpName: '',
      sourceType: '',
      insCorpCode: ['', 'picc', 'pingan', 'cpic', 'guoshou', 'dadi', 'sinosig', 'sinosafe', 'cic', 'edhic', 'acic', 'tianan', 'apiins', 'axatp', 'union'],
      pushRepairType: '',
      Order_type: [],
      OrganizationsData: [],
      dataDepartment: [],
      dataCompany: [],
      shopName: [],
      departmentName: [],
      conductorOrg: '',
      data_Name: [],
      Department: '',
      departmentstate: [],
      pickupcatPart: '',
      pickupcatPart_data: [],
      pickupcatPart_Name: [],
      orderType_code: [],
      source_values: [],
      startDate: new Date(),
      reportTime: '',
      showPicker: false,
      minDate: new Date(2015, 1, 1),
      maxDate: new Date(2020, 1, 1),
      currentDate: new Date(),
	  VehilotList:[]
    }
  },
  onShow() {
	var self = this;
    this.Order_type = [ {name:'送修',value:'Repair'}, {name:'返修',value:'Rework'},{name:'其他',value:'Other'}];
      this.$http.get('/vi/insCompanies').then(res => {
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
    uni.showLoading( );;
    this.$http.get('/Organizations/Currs').then((res) => {
      uni.hideLoading();
        this.OrganizationsData = res.result[0];
        this.deepTraversal(this.OrganizationsData);
		// console.log(this.departmentName);
		// console.log(this.dataDepartment);
		// console.log(this.shopName);
		// console.log(this.dataCompany);
		 // self.shopName.push(name)
		 // self.dataCompany.push(_data)
      })

    this.$http.get('/vi/repairOrder/getWordBooks' + '?moduleName=' + '维修管理' + '&type=' + '工单来源')
      .then((res) => {
        this.VehilotList = res.result;		
      });
  },
   
  methods: {
	radioGroupChange(e){
		// console.log(e);
		this.canMoveCarList.map(item=>{
			if(item.name == e){
				this.registration.canMoveCar = item.value
			}
		})
		// console.log(this.registration.canMoveCar);
	},
    cancel() {
      this.showPicker = false;
    },
    confirm(value) {
      this.registration.reportTime = this.Common.Public.datetimeString(value);
      this.cancel();
    },
	registerDateConfirm: function(e) {		
		this.showPicker = false;
		this.registration.reportTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e.second;
		// 选择报案日期
		// this.statedata.reportTime = this.Common.Public.dateString(this.reportTime);
		// this.$refs.reportTime.close();
	},
    deepTraversal(node) {
      let self = this;
      var data = { value: '', name: '', id: '' }
      data.value = node.code;
      data.name = node.name;
      data.id = node.id;
      var name = node.name;
      self.shopName.push(name)
      self.dataCompany.push(data)
      let nodes = [];
      if (node != null) {
        let stack = []; //同来存放将来要访问的节点
        stack.push(node);
        while (stack.length != 0) {
          let item = stack.pop(); //正在访问的节点
          nodes.push(item);
          if (item.children != undefined && item.children != '') {
            let childrens = item.children;
            for (let i = 0; i < childrens.length; i++) //将现在访问点的节点的子节点存入stack，供将来访问
            {
              if (childrens[i]) {
                stack.push(childrens[i]);
                if (childrens[i].type == "Department") {
                  var Data = { value: '', name: '', id: '', parentId: '' }
                  Data.value = childrens[i].code;
                  Data.name = childrens[i].name;
                  Data.id = childrens[i].id;
                  Data.parentId = childrens[i].parentId;
                  self.departmentName.push(childrens[i].name);
                  self.dataDepartment.push(Data)
                } else if (childrens[i].type == "Shop" || childrens[i].type == "Company") {
                  var _data = { value: '', name: '', id: '' }
                  _data.value = childrens[i].code;
                  _data.name = childrens[i].name;
                  _data.id = childrens[i].id;
                  var name = childrens[i].name;
                  self.shopName.push(name)
                  self.dataCompany.push(_data)
                }
              }
            }
          }
        }
      }
    },


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
      this.registration.insCorpName = this.insCorpName;
	  this.registration.insCorpCode = e[0].value;
    },
    // 工单类型
    onchoose_type(picker, values) {
      //滑动不回厂原因
      this.sourceType = values[0];
    },
    openchoose_type() {
      //打开不回厂原因
      this.issourceType = true;
    },
    source_confirm: function(e) {
      this.issourceType = false;
	  this.sourceType = e[0].label;
	  this.registration.sourceType = e[0].value;
      // for (var i = 0; i < this.Vehilot.length; i++) {
      //   if (this.sourceType == this.Vehilot[i]) {
      //     // console.log(this.source_values)
      //     this.registration.sourceType = this.source_values[i];
      //     // console.log(this.registration.sourceType)
      //   }
      // }
    },


    opchoose_Ordertype() {
      //打开不回厂原因
      this.type_order = true;
    },
    type_confirm: function(e) {
	  this.pushRepairType = e[0].label;
      this.type_order = false;
	  this.registration.pushRepairType = e[0].value;

    },
 
    opchoose_conductorOrg() {
      //打开不回厂原因
      this.conductorOrg_status = true;
    },
    conductorOrg_confirm(e) {
      var self = this;
	  this.conductorOrg  = e[0].label;
      this.conductorOrg_status = false;
      this.registration.conductorOrg = this.conductorOrg;
      for (var j = 0; j < this.dataCompany.length; j++) {
        if (this.conductorOrg == this.dataCompany[j].name) {
          var id = this.dataCompany[j].id;
          self.data_Name = [];
          self.departmentstate = [];
          for (var k = 0; k < this.dataDepartment.length; k++) {
            if (id == this.dataDepartment[k].parentId) {
              var data = { name: '', value: '' }
              data.name = this.dataDepartment[k].name;
              data.value = this.dataDepartment[k].value;
              self.departmentstate.push(data)
              self.data_Name.push(this.dataDepartment[k].name)
            }
          }
        }
      }
    },
    opchoose_Department() {
      //打开不回厂原因
      this.Department_status = true;
    },
    Department_confirm: function(e) {
      var self = this;
	  this.Department = e[0].label;
	  this.registration.conductorOrgCode = e[0].value;
	  var orgCode = e[0].value;
      this.Department_status = false;
      this.registration.Department = this.Department;
      self.pickupcatPart_Name = [];
      for (var key = 0; key < this.departmentstate.length; key++) {
        if (this.Department == this.departmentstate[key].name) {           
          this.$http.get('/Employees?orgCode=' + orgCode)
            .then((res) => {
              self.pickupcatPart_data = res.result;
              for (var num = 0; num < res.result.length; num++) {
				 var obj = {name:'', value:''}
				   obj.name = res.result[num].realName;
				   obj.value = res.result[num].userId;
				 self.pickupcatPart_Name.push(obj);
				
              }
            })
        }
      }
    },
    opchoose_pickupcatPart() {
      //打开不回厂原因
      this.pickupcatPart_status = true;
    },
    pickupcatPart_confirm: function(e) {
      var self = this;
	  this.pickupcatPart = e[0].label;
      this.pickupcatPart_status = false;
      this.registration.pickupcatPart = this.pickupcatPart;
      for (var i = 0; i < this.pickupcatPart_data.length; i++) {
        if (this.pickupcatPart == this.pickupcatPart_data[i].realName) {
          self.registration.conductorUserId = self.pickupcatPart_data[i].userId;
          self.registration.conductorUserPhone = self.pickupcatPart_data[i].mobile;
        }
      }
    },

    smsAnalysis() {
      var self = this;
      if (!this.registration.smsContent) {
		this.$refs.uToast.show({title:'请输入短信内容'});        
        return;
      };
      var ParsingSMSWSModel = { smsContent: '' };
      ParsingSMSWSModel.smsContent = this.registration.smsContent;
	  uni.showLoading({ title: '解析中...' });
	   	   
      this.$http.post("/vi/repairOrder/parsingSMS", ParsingSMSWSModel).then(res => {
		   uni.hideLoading();
        if (res.result) {
          self.registration.pushRepairType = res.result.pushRepairType;
          self.registration.insCorpCode = res.result.insCorpCode;
          self.registration.insCorpShortName = res.result.insCorpShortName;
          self.registration.plateNo = res.result.plateNo;
          self.registration.model = res.result.model;
          self.registration.phone = res.result.phone;
          self.registration.name = res.result.name;
          self.registration.reportNo = res.result.reportNo;
          self.registration.reportAddress = res.result.reportAddress;
          self.registration.reportTime = res.result.reportTime;
          self.registration.reportRemark = res.result.reportRemark;
          self.registration.smsContent = res.result.smsContent;
        };
      });
    },

    btn_create() {
      this.isDisable = true;
      // var index = 0;
      // for (var i = 0; i <= this.data_Corp.length; i++) {
      //   if (this.registration.insCorpName == this.data_Corp[i]) {
      //     index = i;
      //   }
      // };
      // this.registration.insCorpCode = this.insCorpCode[index];
      var registration = this.registration;      
      if (this.registration.sourceType == "") {        
		this.$refs.uToast.show({title:'请选择工单来源'});
        return false;
      }
      if (this.registration.name == "") {      
		this.$refs.uToast.show({title:'请填写客户姓名'});
        return false;
      }
      if (this.registration.phone == "") {       
		this.$refs.uToast.show({title:'请填写手机号'});
        return false;
      }
      if (this.registration.insCorpCode == "") {       
		this.$refs.uToast.show({title:'请选择保险公司'});
        return false;
      }
      if (this.registration.pushRepairType == "") {       
		this.$refs.uToast.show({title:'请选择留修类型'});
        return false;
      }
      if (this.registration.conductorOrg == "") {       
		this.$refs.uToast.show({title:'请选择接车机构'});
        return false;
      }
      if (this.registration.Department == "") {
		this.$refs.uToast.show({title:'请选择接车部门'});
        return false;
      }
      if (this.registration.pickupcatPart == "") {        
		this.$refs.uToast.show({title:'请选择接车员'});
        return false;
      }

      // Indicator.open();
	    uni.showLoading();
      this.$http.post("/vi/repairOrder/saveRepairOrder", registration).then(res => {
		uni.hideLoading();
        this.isDisable = false;
		if(res.status == 200){
			uni.navigateBack({});
		}
        // Indicator.close();
        // window.history.back();
      });

    },
  },
}

</script>
<style lang="scss" Scoped>
.order_message {
  background: #ffffff;
  margin: 10px;
  border-bottom: 0.5px solid #f0f0f0;
  border-radius: 5px;
}

.order_message .order_message_title {
  padding-left: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.order_message .order_message_title text {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  height: 40px;
  line-height: 40px;
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

.mint-cell-wrapper {
  border: 0;
}


.smsContent_box {
  background-color: #ffffff;
  margin: 20px 10px 10px 10px;
  border: 0.5px solid #eeeeee;
  border-radius: 5px;
}

.smsContent_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
  border-bottom: 0.5px solid #f0f0f0;
  padding: 0 10px;
  font-weight: bold;
}

.text_inp {
  border: 1px solid #f0f0f0;
  width: 100%;
  height: 150rpx;
  padding: 5px;
}

.textarea_Box {
  padding: 10px 5px;
}

.mint-field-other {
  width: 98%;

}

.mint-field-other input {
  width: 88%;
  color: #333333;
}

.conductorUser {
  background-color: #ffffff;
  margin: 20px 10px 10px 10px;
  border: 0.5px solid #eeeeee;
  border-radius: 5px;
}

.smsAnalysis {
  color: #0070D3;
  border: 0.5px solid #f0f0f0;
  padding: 2px 8px;
  border-radius: 3px;
}

.conductorUser_title {
  padding: 5px 10px;
}

.van-field__label {
  width: 105px;
}

.van-cell {
  padding: 10px;
}

</style>
