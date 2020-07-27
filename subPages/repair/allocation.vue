<template>
  <view>
    <u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="分配接车员">
    	<view class="slot-wrap">
    		<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>
    		<!-- <view style="color:#FFFFFF;font-size: 32rpx;">维修登记</view> -->    		
    	</view>			
    </u-navbar>
    <view class="cenmen">
      <view class="conductorUser">
        <view class="conductorUser_title">
          接车员信息
        </view>
		<u-field :required="true" label="接车机构" label-width="190" :disabled="true" right-icon="arrow-right" 
		  v-model="conductorOrg"  @click="opchoose_conductorOrg" placeholder="选择接车机构" >
		</u-field>	
		<u-select v-model="conductorOrg_status" mode="single-column" @confirm="conductorOrg_confirm" label-name="name" :list="dataCompany"></u-select>
		
		<u-field :required="true" label="接车部门" label-width="190" :disabled="true" right-icon="arrow-right"
		  v-model="Department"  @click="opchoose_Department" placeholder="选择接车部门" >
		</u-field>	
		<u-select v-model="Department_status" mode="single-column" @confirm="Department_confirm" label-name="name" :list="departmentstate"></u-select>
		
		<u-field :required="true" label="接车员" label-width="190" :disabled="true" right-icon="arrow-right"
		  v-model="pickupcatPart"  @click="opchoose_pickupcatPart" placeholder="选择接车员" >
		</u-field>	
		<u-select v-model="pickupcatPart_status" mode="single-column" @confirm="pickupcatPart_confirm" label-name="name" :list="pickupcatPart_Name"></u-select>
		      
      </view>
	  <button class="btn_create"  @click="btn_allocation">分配</button>       
    </view>
	<u-toast ref="uToast" />
  </view>
</template>
<script>

export default {
  data() {
    return {
      pickupcatPart_status: false,
      Department_status: false,
      conductorOrg_status: false,
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
        pickupcatPart: ''
      },
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
      ids: '',
    }
  },
  created() {    
    this.$http.get('/Organizations/Currs')
      .then((res) => {      
        //  console.log(res.result)
        this.OrganizationsData = res.result[0];
        this.deepTraversal(this.OrganizationsData);
		
      })
  },
  onLoad(parmse){
	 this.ids = parmse.id;    
  },
  methods: {
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
      // this.$router.back()
	  uni.navigateBack({})
    },
    onchoose_conductorOrg(picker, values) {
      //滑动不回厂原因
      this.conductorOrg = values[0];
    },
    opchoose_conductorOrg() {
      //打开不回厂原因
      this.conductorOrg_status = true;
    },
    conductorOrg_confirm(e) {	
      var self = this;
	  this.conductorOrg = e[0].label;
      this.conductorOrg_status = false;
      this.registration.conductorOrg = this.conductorOrg;
	  this.Department = '';	
	  this.pickupcatPart =  '';	 
	  this.registration.pickupcatPart = ' ';
	  this.registration.conductorOrgCode  = '';
      for (var j = 0; j < this.dataCompany.length; j++) {
        if (this.conductorOrg == this.dataCompany[j].name) {
          var id = this.dataCompany[j].id;
          self.data_Name = [];
          self.pickupcatPart_Name = [];
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

    onchoose_Department(picker, values) {
      //滑动不回厂原因
      this.Department = values[0];
    },
    opchoose_Department() {
      //打开不回厂原因
      this.Department_status = true;
    },
    Department_confirm: function(e) {
	  this.Department = e[0].label;
	  var orgCode = e[0].value;	
	  this.registration.conductorOrgCode  = e[0].value;
      var self = this;
      this.Department_status = false;
      this.registration.Department = this.Department;
      self.pickupcatPart_Name = [];
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

    btn_allocation() {
      if (this.registration.conductorOrg == "") {
		this.$refs.uToast.show({title:'请选择接车机构'});
        // Toast("请选择接车机构");
        return false;
      }
      if (this.registration.Department == "") {
        // Toast("请选择接车部门");
		this.$refs.uToast.show({title:'请选择接车部门'});
        return false;
      }
      if (this.registration.pickupcatPart == "") {
		this.$refs.uToast.show({title:'请选择接车员'});  
        // Toast("请选择接车员");
        return false;
      } else {
        var distribution = { ids: '', conductorOrgCode: '', conductorUserId: '' };
        distribution.ids = this.ids;
        distribution.conductorOrgCode = this.registration.conductorOrgCode;
        distribution.conductorUserId = this.registration.conductorUserId;
		uni.showLoading({
			title: '请稍等'
		});
        this.$http.put("/vi/repairOrder/distribution", distribution).then(res => {
		uni.hideLoading();	
          uni.navigateBack({ });
        });

        //                 // {
        //   "ids": "string,留修工单ID（多个，号分割）",
        //   "conductorOrgCode": "string,接车员部门编码",
        //   "conductorUserId": "integer,接车员用户ID"
        // }

      }
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

.order_message .order_message_title p {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
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

.btn_allocation {     
     color: #315ade;
     background: rgb(255, 255, 255);
     border: 1px solid #315ade;
	 margin:10px;
	 margin-top: 30px;
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
}

.text_inp {
  border: 1px solid #f0f0f0;
  width: 97%;
  height: 50px;
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
  color:#333;
  font-size:14px;
}

.Move_status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conductorUser {
  background-color: #ffffff;
  margin: 20px 10px 10px 10px;
  border: 0.5px solid #eeeeee;
  border-radius: 5px;
}

.conductorUser_title {
  padding: 5px 10px;
}

</style>
