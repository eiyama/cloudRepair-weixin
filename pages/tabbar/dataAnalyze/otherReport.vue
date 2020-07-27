<template>
  <view>   
	<u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="其他报表">
		<view class="slot-wrap">
			<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>	
		</view>			
	</u-navbar>
    <view class="cenmen">
      <view class="Order_search">
        <view id="Search_title">选择相应的报表类型查询</view>
			
		<u-field   label="报表类型" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="reportType"  @click="openreportType" placeholder="请选择报表类型" >
		</u-field>	
		<u-select v-model="isreportType" label-name="name" :list="reportTypeList" mode="single-column" @confirm="report_confirm"></u-select>
		
		<u-field   label="查询机构" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="conductorOrg"  @click="opchoose_conductorOrg" placeholder="请选择查询机构" >
		</u-field>	
		<u-select v-model="conductorOrg_status" mode="single-column" @confirm="conductorOrg_confirm" label-name="name" :list="dataCompany"></u-select>
		
		<u-field   label="起始时间" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="beginDate"  @click="registerWeek = true" placeholder="请选择起始时间" >
		</u-field>
		  
     	<u-field   label="截止时间" label-width="150" :disabled="true" right-icon="arrow-right"
		  v-model="endDate"  @click="registerMonth = true" placeholder="请选择截止时间" >
	    </u-field>
		 
		<u-picker mode="time" @confirm="registerDateConfirm" v-model="registerWeek" :params="timeParams"></u-picker>
		<u-picker mode="time" @confirm="expirationDate" v-model="registerMonth" :params="timeParams"></u-picker>
		<u-toast ref="uToast" />				 
      </view>			
	  <view class="btn_create" @click="seach_btn"  >
	    导出
	  </view>      
    </view>
  </view>
</template>
<script>

export default {
  data() {
    return {
      issourceType: false,	  
      isreportType: false,
      id: "",
      jobNumber: "",
      corp: [{ code: 'picc', fullname: '中国人保' }],
      reportType: '',     
	  reportTypeList:[
		  {name:'留修业绩分析',value:0},
		  {name:'工单监控表',value:1}
	  ],
	  registerWeek: false,
	  registerMonth:false,
	  statDate: {
	    month: "",
	    date: "",
	    year: "",
	    reportTime: "",
	    reportTime2: ""
	  },
	  timeParams:{
	  	year: true,
	  	month: true,
	  	day: true	  	 
	  },
	  OrganizationsData:[],
	  dataDepartment: [],
	  dataCompany: [],
	  shopName: [],
	  departmentName: [],
	  conductorOrg: '',	
	  conductorOrg_status:false,
	  reportCode:'',	  
	  beginDate:'',
	  endDate:'',
      
    }
  },
  onShow() {
	  uni.showLoading();
	  this.$http.get('/Organizations/Currs')
	    .then((res) => {
		uni.hideLoading();	      
	      this.OrganizationsData = res.result[0];
	      this.deepTraversal(this.OrganizationsData);	  	
	    })	  
  },
  
  methods: {
	  opchoose_conductorOrg() {
	    //打开不回厂原因
	    this.conductorOrg_status = true;
	  },
	  conductorOrg_confirm(e) {
	    var self = this;
	    this.conductorOrg  = e[0].label;		
		this.orgCode = e[0].value;
	    this.conductorOrg_status = false;
	  
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
	 
	 // 选择报案日期
	 registerDateConfirm: function(e) {
	   // 把选择的时间赋值给statDate.reportTime且处理成2019-05-01的格式
	   this.statDate.reportTime = e.year + '-' + e.month + '-' + e.day ;
	   // this.statDate.reportTime = this.Common.Public.dateString(this.reportTime);
	   if (new Date(this.statDate.reportTime) > new Date(this.endDate)) {
	     this.$refs.uToast.show({title: "起始日期不能大于截止日期请重新选择"});
	 	return
	   } else {
	     this.beginDate = this.statDate.reportTime;	   
	   }		
	 },	 
	 
	 expirationDate: function(e) {
	   // 选择报案日期
	   this.statDate.reportTime2 = e.year + '-' + e.month + '-' + e.day ;
	   // this.statDate.reportTime2 = this.Common.Public.dateString( this.reportTime2  );
	   if (new Date(this.beginDate) > new Date(this.statDate.reportTime2)) {
	     this.$refs.uToast.show({title: "起始日期不能大于截止日期请重新选择"});
	     return
	   } else {
	     this.endDate = this.statDate.reportTime2;	    
	   }	   
	 },
	 
    openBack: function() {
     uni.navigateBack({});
    },
	
    report_confirm: function(e) {
		this.reportType = e[0].label;
		this.isreportType = false;
		this.reportCode = e[0].value; 
	},
	
    openreportType: function() {     
      this.isreportType = true;
    },	     
      
    // 提交按钮
    seach_btn: function() {
        
      if(!this.reportType && !this.conductorOrg && !this.beginDate && !this.endDate){
		  this.$refs.uToast.show({title:'请至少输入或选择一个查询条件，以便快速筛选工单'});
		  return;
	  }
	 
	  
	  if(this.reportCode == 0){
		  var params = {
			    type:'Count',
		  		beginDate:this.beginDate,
		  		endDate:this.endDate,
		  		orgCode:this.orgCode,		 
		  };
		uni.showLoading();		 						 
		this.$http.get('/vi/repairOrder/Report/DownRepairOrderAnalysisFile',params).then((res) => {
		  uni.hideLoading();		
			if(res.status){
			const downloadTask = uni.downloadFile({
				    url: res.result, //仅为示例，并非真实的资源
				    success: (res) => {
				        if (res.statusCode === 200) {
				            // console.log('下载成功');
							let that = this;
							uni.saveFile({
								tempFilePath: res.tempFilePath,
									success: function(res) {
												uni.openDocument({
													filePath:res.savedFilePath,
													success:(res)=>console.log('成功打开文档')
												})
									}
								});
				        }
				    }
				});
				downloadTask.onProgressUpdate((res) => {
						console.log('下载进度' + res.progress);
						console.log('已经下载的数据长度' + res.totalBytesWritten);
						console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			}
		  })
	  }else{
		  var params = {
		  		beginDate:this.beginDate,
		  		endDate:this.endDate,
		  		orgCode:this.orgCode,		 
		  };
		  uni.showLoading();
		this.$http.get('/vi/repairOrder/Report/DownloadRepairOrderMonitorFile',params).then((res) => {
		  uni.hideLoading();		   
				if(res.status){
					const downloadTask = uni.downloadFile({
						    url: res.result, //仅为示例，并非真实的资源
						    success: (res) => {
						        if (res.statusCode === 200) {
						            // console.log('下载成功');
									let that = this;
									uni.saveFile({
										tempFilePath: res.tempFilePath,
											success: function(res) {
												uni.openDocument({
													filePath:res.savedFilePath,
													success:(res)=>console.log('成功打开文档')
												})
												// that.luj = red.savedFilePath
												// console.log(red)
											}
										});
						        }
						    }
						});
						downloadTask.onProgressUpdate((res) => {
								console.log('下载进度' + res.progress);
								console.log('已经下载的数据长度' + res.totalBytesWritten);
								console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
						});
				}				
		  })  
		  
	  }
	  
	  
	 
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
