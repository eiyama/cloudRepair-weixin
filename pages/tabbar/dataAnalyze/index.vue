<template>
  <view>	 
		<u-navbar :background="{backgroundColor: '#315ade'}" :z-index="9999" :is-back="false" title-color="#fff" title="数据分析">
		   <view class="slot-wrap">
				<text style="color: #FFFFFF;" @click="toOrderReport">其他报表</text>	
		   </view>	
		</u-navbar>	  	  		 
		<view class="tabFixed">
			<u-tabs style="flex: 1;" :list="list" :is-scroll="false" :current="selected" @change="changeDate">					
			</u-tabs>		 
		</view>
		<view class="container-center">
			<view class="main"  >
				<view class="condition_time" v-show="selected == 1">
				  <view class="condition_left">					 
					<u-radio-group   v-model="currentTime" @change="check">
						<u-radio name="week" >
							近一周
						</u-radio>
						<u-radio name="month" >
							本月
						</u-radio>
					</u-radio-group>
				  </view>
				  <view class="condition_right">					
					<span @click="selRegisterDate">
					  <p>{{beginDate}}</p>
					</span>
					<h3 id="isfont">至</h3>					
					<span @click="getexpirationDate">
					  <p>{{endDate}}</p>					   
					</span>
				  </view>
				  <u-picker mode="time" @confirm="registerDateConfirm" v-model="registerWeek" :params="timeParams"></u-picker>
				  <u-picker mode="time" @confirm="expirationDate" v-model="registerMonth" :params="timeParams"></u-picker>
				</view>
				<view class="order_all">
				  <view class="orderAll_left">
					<h5>工单总量：</h5>
					<p>{{order_all}}</p>
				  </view>
				  <view class="orderAll_right" @click="refresh_btn">刷新</view>
				</view>
				<view class="orderDeal">
					<view class="title">工单跟进分析(3分钟内算及时跟进)</view>
					<view class="tabFollowBox">
							<view class="tab_follow" v-for="(item,index) in followIndeal" :key="index" @click="followIn_toanalyze(followIndeal.arrayRepairOrderId)">
								<text>{{item.analysisItemDisplay}}</text>
								<text style="color:#75b6ff">{{item.repairCount}}</text>
							</view>
					</view>					
				</view>
				<!-- 工单处理分析 -->
				<view class="orderDeal" ref="orderDeal">
				  <view class="title">
					<h5>工单处理分析</h5>
				  </view>	
					<view class="" v-show="showOrderAnalyze">
						<canvas canvas-id="orderdealanaly"    id="orderdealanaly"  class="charts">
						</canvas>				  
					</view>
					<view  v-show="!showOrderAnalyze">
						<image class="charts" :src="orderanalyzeUrl" mode=""></image>
					</view>
				</view>
				<!-- 战败原因 -->
				<view class="orderDeal"  >
				  <view class="title">
					<h5>战败原因分析</h5>
				  </view>
				  <view class="" v-show="showOrderDefeat">
				  	<canvas canvas-id="orderDefeat"    id="orderDefeat"  class="_charts"></canvas>					
				  </view>
				  <view   v-show="!showOrderDefeat">
				  	<image class="_charts" :src="orderDefeatUrl" mode=""></image>
				  </view>								
				</view>				             
				<!-- 工单来源分析 -->
				<!-- <view class="orderDeal" v-show="orderFrom" >
				  <view class="title">
					<h5>工单来源分析</h5>
				  </view>
				  <view class="">
						<canvas  canvas-id="myChart"    id="myChart"  class="charts"></canvas>
				  </view>
				 <view  v-show="!showOrderAnalyze">
				 	<image class="charts" :src="orderanalyzeUrl" mode=""></image>
				 </view> -->
				  					  				  
				 
				</view>	
				<!-- 外拓到店率分析 -->
				 <view class="orderDeal">
					<view class="title">外拓到店率分析</view>
					<view class="tabFollowBox">
						<view v-show="item.value != '外拓'" class="tab_follow"  v-for="(item,index) in statisticsBySourceTypeData" :key="index"  >
							<text>{{item.key}}</text>
							<text style="color:#75b6ff">{{item.value}}</text>
						</view>
					</view>					
				 </view>
				 <!-- 保险公司推送线索到店率分析 -->
				  <view class="orderDeal">
				 	<view class="title">保险公司推送线索到店率分析</view>
				 	<view class="">						 
						<u-table>
								<u-tr>
									<u-th>分类</u-th>
									<u-th>线索量</u-th>
									<u-th>到店量</u-th>
									<u-th>到店率</u-th>
								</u-tr>
								<u-tr v-for="(item,index) in statisticsByRepairTypeData" :key="index" >
									<u-td>{{item.key}}</u-td>
									<u-td>{{item.value[0]}}</u-td>
									<u-td>{{item.value[1]}}</u-td>
									<u-td>{{item.value[2]}}</u-td>
								</u-tr>								 
							</u-table>
				 	</view>					
				  </view>
				  <view class="orderDeal">
				  	<view class="title">赔付率分析</view>
					  <u-field   label="查询机构" label-width="150" :disabled="true" right-icon="arrow-right"
						v-model="conductorOrg"  @click="conductorOrg_status = true" placeholder="请选择接车机构" >
					  </u-field>	
					  <u-select v-model="conductorOrg_status" label-name="name" :list="dataCompany" mode="single-column" @confirm="conductorOrg_confirm"></u-select>		  
					  <view  style="position: relative;border: solid 1px #e4e7ed;"> 
					    <view class="table-box">					 
						  <view class="table-title">
								<view class="table-td  td1">保险公司</view>
								<view class="table-td">总保费</view>
								<view class="table-td">送修赔付金额</view>
								<view class="table-td">返修赔付金额</view>
								<view class="table-td">合计赔付金额</view>							 
								<view class="table-td">送修占比</view>							
								<view class="table-td">返修占比</view>
								<view class="table-td"  >返修赔付率  </view>
								<view class="table-td"  >送修赔付率  </view>
								<view class="table-td">总赔付率 </view>						
						  </view>
						  <view  :key="index" v-for="(item,index) in LossRatioAnalysisesList" >
							<view class="table-td td1">{{item.insCorpName }}</view>
							<view class="table-td">{{item.premium  }}</view>
							<view class="table-td">{{item.reworkAmount  }}</view>
							<view class="table-td">{{item.repairAmount  }}</view>
							<view class="table-td">{{item.totalAmount  }}</view>
							<view class="table-td">{{item.reworkRateDisplay  }}</view>
							<view class="table-td">{{item.repairRateDisplay  }}</view>
							<view class="table-td" >{{item.reworkLossRateDisplay      }}</view>
							<view class="table-td" >{{item.repairLossRateDisplay    }}</view>
							<view class="table-td">{{item.lossRateDisplay   }}</view>						
						  </view>					  
					     </view>
					  </view>
				  </view>					
				</view>
				<u-toast ref="uToast" />
			</view>
		</view> 
</template>
<script>
import uCharts from '@/components/u-charts/u-charts.js';
var canvaColumn = null;
var _self;
export default {    
  data() {
    return {
	  conductorOrg:'',
	  showOrderAnalyze:true,
	  orderanalyzeUrl:'',
	  showOrderDefeat:true,
	  orderDefeatUrl:'',
	  conductorOrg_status:false,	  
      orderFrom: true,
      tostoreRate: true,
	  pixelRatio:1,
	  list:[
		  {
			  name:'今日数据'
		  },
		  {
			  name:'历史数据'
		  }
	  ],
	  current: 0,
	  timeParams:{
	  	year: true,
	  	month: true,
	  	day: true	  	 
	  },
      followStatus: {
        analysisItemDisplay: "",
        repairCount: "",
        analysisItem: "",
        arrayRepairOrderId: []
      },
      followIndeal: [],
      Width: "100%",
      Height: 0,
      order_all: 0,
      defeat_StatusData: [{
        key: "",
        value: ""
      }],
      legends: [],
      series: [],
      conductorUserId: "",      
      reportTime: "",
      selected: 0,
      beginDate: "",
      startDate: new Date("2014-01-01"),
      endDate: "",
      reportTime2: "",
      registerWeek: false,
	  registerMonth:false,
      statDate: {
        month: "",
        date: "",
        year: "",
        reportTime: "",
        reportTime2: ""
      },
      statisticsByStatusData: [{
        key: "",
        value: ""
      }],
      statisticsBySourceData: [{
        key: "",
        value: ""
      }],
      statisticsBySourceTypeData: [{
        key: "",
        value: ""
      }],
      statisticsByRepairTypeData: [{
        key: "",
        value: []
      }],
      statisticsByInsCorpData: [
        [{
          key: "",
          value: ""
        }]
      ],
      hasManage: "",
      orgCode: "",
      currentTime: "week",
	  cWidthDefeat:'',
	  cHeightDefeat:'',
	  OrganizationsData:[],
	  dataCompany:[],
	  dataDepartment:[],
	  imgpath:'',
	  LossRatioAnalysisesList:[],
    };
  },
  onShow: function() {
	_self = this;
	this.cWidth=uni.upx2px(750);
	this.cHeight=uni.upx2px(400);
	this.cWidthDefeat = uni.upx2px(750);
	this.cHeightDefeat = uni.upx2px(600);
    this.hasManage = uni.getStorageSync("hasManage");
    var personal = uni.getStorageSync("personal");
    this.orgCode = personal.sellerOrgCode;
	this.conductorOrg = personal.sellerOrgName;
    var self = this;
    // console.log(this.orgCode)
    this.Height = 18 * 5 + 200;
    // 从全局取conductorUserId
    if ( uni.getStorageSync("conductorUserId") != undefined &&   uni.getStorageSync("conductorUserId") != ""  ) {
      this.conductorUserId = uni.getStorageSync("conductorUserId");
    } else {
      this.conductorUserId = this.$store.state.conductorUserId;
    }
    this.orderFrom = this.$store.state.isOrderFrom;
    this.tostoreRate = this.$store.state.isOutside;
    var myDate = new Date();
    var time = "";
    time = myDate.getFullYear();
    var Month = myDate.getMonth() + 1;
    var _Date = "";
    _Date = myDate.getDate();
    if (Month < 10) {
      Month = "0" + Month;
    }
    if (_Date < 10) {
      _Date = "0" + _Date;
    }
    time = time + "-" + Month + "-" + _Date;
    // 开始时起始日期和截止日期一样
    this.beginDate = time;
    this.endDate = time;
    this.statDate = new Date(time);
    this.loadData(this.beginDate, this.endDate);	
	uni.showLoading( );
	this.$http.get('/Organizations/Currs').then((res) => {
	  uni.hideLoading();
	    this.OrganizationsData = res.result[0];
	    this.deepTraversal(this.OrganizationsData);		 
	  })
  },
   
  methods: {
	  toOrderReport(){
		uni.navigateTo({
			url:'./otherReport'
		})  
	  },
	  conductorOrg_confirm(e) {
	    var self = this;
	    this.conductorOrg  = e[0].label;
	    this.conductorOrg_status = false;
	    this.orgCode =  e[0].value;
	    this.loadData(this.beginDate, this.endDate);
	  },
	  deepTraversal(node) { //深度遍历
	    let self = this;
	    var data = { value: '', name: '', id: '' }
	    data.value = node.code;
	    data.name = node.name;
	    data.id = node.id;
	    var name = node.name;	
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
	                self.dataDepartment.push(Data)
	              } else if (childrens[i].type == "Shop" || childrens[i].type == "Company") {
	                var _data = { value: '', name: '', id: '' }
	                _data.value = childrens[i].code;
	                _data.name = childrens[i].name;
	                _data.id = childrens[i].id;	               	               
	                self.dataCompany.push(_data);
	              }
	            }
	          }
	        }
	      }
	    }
	  },	  
	  
	  changeDate(e){
		  if(e == 0){
			  this.todayDate()
		  }else{
			  this.historyDate()
		  }
		  this.selected = e;
	  },
    check: function() {
      if (this.currentTime == 'week') {
        this.setDate_week();
      } else {
        this.setDate_month();
      }
    },
    drawLine(valuedata, el) {
      var self = this;	  	 
      //  数据处理   
	  var pieList = [];
	  var _Sum = 0;
	  for (var j of valuedata) {
	    if (j.key == "工单总量") {
	     _Sum = j.value;
		 this.order_all = j.value;
	  	break;
	    } else {
	  	_Sum = _Sum + j.value;
	    }
	  }
	  if (_Sum == 0) {
	    var _statistics_data = { name: "", data: "" };
	    _statistics_data.data = 1;
	    _statistics_data.name = "暂无数据";
	    pieList.push(_statistics_data);
	  }else{	  
		  for (var i of valuedata) {
			  if (i.key == "工单总量") {			   
			    continue;
			  }
	  		var obj = { name: "", data: "" };
	  		obj.data = i.value;
	  		obj.name = i.key + ':' + i.value + '（' + (i.value / _Sum  * 100).toFixed(2) + '%' + '）'; 
	  		pieList.push(obj);	  
			}
	  }   
		var _canvaColumn = null;
	  	_canvaColumn = new uCharts({
				$this:_self,				
				canvasId: el,				 
				type: 'ring',
				legend:{show:true,lineHeight:20},
				fontSize:11,	  						  			
				animation: true,
				background:'#FFFFFF',
				pixelRatio:_self.pixelRatio,
				series: pieList,	  					 
				dataLabel: false,
				width:  _self.cWidth*_self.pixelRatio,
				height:  _self.cHeight*_self.pixelRatio,
				extra: {
					pie: {
					  lableWidth:15
					}
				  }
	    }); 
		 _self.showOrderAnalyze = true;
		_canvaColumn.addEventListener('renderComplete', () => {			
				uni.canvasToTempFilePath({
					quality:1,
					canvasId: _canvaColumn.opts.canvasId,
					success: function(res) {	
						_self.showOrderAnalyze = false;
						_self.orderanalyzeUrl = res.tempFilePath;
					}
				});
			});
		 
    },
    defat_draw: function(el) {      
        var self = this;
        //  数据处理   
        var pieList = [];
		var _Sum = 0;
		for (var j of this.series) {		  
			_Sum = _Sum + j ;		   
		}
		
		if (_Sum == 0) {
		  var _statistics_data = { name: "", data: "" };
		  _statistics_data.data = 1;
		  _statistics_data.name = "暂无数据";
		  pieList.push(_statistics_data);
		}else{
			for(var i = 0 ; i < this.legends.length ; i++){
				var obj = { name: "", data: "" };
				obj.data = this.series[i];
				obj.name = this.legends[i] + ':' + this.series[i] + '（' + (this.series[i] / _Sum  * 100).toFixed(2) + '%' + '）';
				pieList.push(obj);
			}
		}			
			   
        canvaColumn = new uCharts({				
      			$this:_self,								 
      			canvasId: el,
      			type: 'ring',      			
      			fontSize:11,	  						  			
      			animation: true,
      			background:'#FFFFFF',
      			pixelRatio:_self.pixelRatio,
      			series: pieList,	  					 
      			dataLabel: false,
      			width:  _self.cWidthDefeat * _self.pixelRatio,
      			height:  _self.cHeightDefeat * _self.pixelRatio,
				legend:{show:true,lineHeight:20},
      			extra: {
      				pie: {
      				  lableWidth:15
      				}
      			  }
      		}); 			
			self.showOrderDefeat = true;						
			canvaColumn.addEventListener('renderComplete', () => {			
					uni.canvasToTempFilePath({
						quality:1,
						canvasId: canvaColumn.opts.canvasId,
						success: function(res) {	
							self.showOrderDefeat = false;
							self.orderDefeatUrl = res.tempFilePath;
						}
					});
			});			
    },

    // 发送请求的函数
    loadData: function(beginDate, endDate) {
      var self = this;
      if (self.hasManage) {
        this.conductorUserId = 0;
      }
      var url =
        "/vi/repairOrder/Summary?beginDate=" +
        beginDate +
        "&endDate=" +
        endDate;
      // Indicator.open("加载中...");
      this.$http.get(url + "&conductorUserId=" + this.conductorUserId).then(
        res => {
          if (res.result) {
            // Indicator.close();
            this.statisticsByStatusData = res.result.statisticsByStatusData;
            this.statisticsBySourceData = res.result.statisticsBySourceData;
            this.statisticsBySourceTypeData = res.result.statisticsBySourceTypeData;
            this.statisticsByRepairTypeData = res.result.statisticsByRepairTypeData;
            this.statisticsByInsCorpData = res.result.statisticsByInsCorpData;
          }
          this.drawLine(this.statisticsBySourceData, "myChart");
          this.drawLine(this.statisticsByStatusData, "orderdealanaly");
          // this.drawLine(this.statisticsBySourceData, "myChart2");
          // this.drawLine(this.statisticsByStatusData, "history_orederdeal");
        }
      );
      var url2 =
        "/vi/repairOrder/FollowupAnalysis?search.beginDate=" +
        beginDate +
        "&search.endDate=" +
        endDate;
      // Indicator.open("加载中...");
       this.$http.get(
        url2 + "&search.conductorUserId=" + this.conductorUserId
      ).then(res => {
        if (res.result) {
          // Indicator.close();
          this.followStatus = res.result;
        }
        self.followIndeal = [];
        for (var key of self.followStatus) {
          if (key.analysisItem == "Total") {
            continue;
          }
          self.followIndeal.push(key);
        }
      });

      var url3 =
        "/vi/repairOrder/FailureChart?beginDate=" +
        beginDate +
        "&endDate=" +
        endDate;
      var path = '';
      if (this.hasManage) {
        path = '&orgCode=' + this.orgCode
      } else {
        path = '&conductorUserId=' + this.conductorUserId
      }
    
       this.$http.get(url3 + path).then(res => {
        if (res.result) {
          // Indicator.close();
          this.legends = res.result.legends;
          this.series = res.result.series;
        }
        this.defat_draw("orderDefeat");
       
      });
	  
	  var url_4 =  '/vi/repairOrder/Report/GetLossRatioAnalysises?beginDate=' + beginDate +  "&endDate=" + endDate + '&orgCode=' + this.orgCode;
	  this.$http.get(url_4).then(res => {
	    if (res.result) {
	      this.LossRatioAnalysisesList = res.result;
	    }	  
	  });
    },

    // 今日数据刷新按钮
    refresh_btn() {
		this.loadData(this.beginDate, this.endDate);			  
    },
    // 历史数据刷新按钮
    Hisrefresh_btn() {
      this.loadData(this.beginDate, this.endDate);
    },
    //今日分栏 点击进入工单跟进分析
    followIn_toanalyze(getrepairOrderIds) {
      var repairOrderIds = getrepairOrderIds.join("");

      this.$router.push({
        path: "/followIn_toanalyze",
        query: {
          repairOrderIds: repairOrderIds
        }
      });
    },
    //历史分栏 点击进入工单跟进分析
    HisfollowIn_toanalyze(getrepairOrderIds) {
      var repairOrderIds = getrepairOrderIds.join("");
      this.$router.push({
        path: "/followIn_toanalyze",
        query: {
          repairOrderIds: repairOrderIds
        }
      });
      // (followIn_analyze)
    },
    // 今日数据
    todayDate() {
      var myDate = new Date();
      var time = "";
      time = myDate.getFullYear();
      var Month = myDate.getMonth() + 1;
      var _Date = "";
      _Date = myDate.getDate();
      if (Month < 10) {
        Month = "0" + Month;
      }
      if (_Date < 10) {
        _Date = "0" + _Date;
      }
      time = time + "-" + Month + "-" + _Date;
      this.beginDate = time;
      this.endDate = time;
      this.statDate = new Date(time);
      this.loadData(this.beginDate, this.endDate);
    },
    // 历史数据
    historyDate() {
      var myDate = new Date();
      var time = "";
      time = myDate.getFullYear();
      var Month = myDate.getMonth() + 1;
      var _Date = "";
      _Date = myDate.getDate();
      // 处理天数
      if (_Date <= 7) {
        if (Month == 1) {
          time = time - 1;
          Month = 12 + Month - 1;
          _Date = _Date + 31 - 6;
        } else if (Month == 3 || 5 || 7 || 8 || 10 || 12) {
          _Date = _Date + 31 - 6;
        } else if (Month == 4 || 6 || 9 || 11) {
          _Date = _Date + 30 - 6;
        } else if (Month == 2) {
          if ((time % 4 == 0 && time % 100 != 0) || time % 400 == 0) {
            _Date = _Date + 29 - 6;
          } else {
            _Date = _Date + 28 - 6;
          }
        }
        Month = Month - 1;
      } else {
        _Date = _Date - 6;
      }
      // 保持与弹层日期格式一样（月份和时间）
      if (Month < 10) {
        Month = "0" + Month;
      }
      if (_Date < 10) {
        _Date = "0" + _Date;
      }
      time = time + "-" + Month + "-" + _Date;
      this.beginDate = time;
      this.loadData(this.beginDate, this.endDate);
    },
    // 本星期按钮触发的事件
    setDate_week() {
      var myDate = new Date();
      var time = "";
      time = myDate.getFullYear();
      var Month = myDate.getMonth() + 1;
      var _Date = "";
      _Date = myDate.getDate();
      this.endDate = time + "-" + Month + "-" + _Date;
      if (_Date <= 7) {
        if (Month == 1) {
          time = time - 1;
          Month = 12 + Month - 1;
          _Date = _Date + 31 - 6;
        } else if (Month == 3 || 5 || 7 || 8 || 10 || 12) {
          _Date = _Date + 31 - 6;
        } else if (Month == 4 || 6 || 9 || 11) {
          _Date = _Date + 30 - 6;
        } else if (Month == 2) {
          if ((time % 4 == 0 && time % 100 != 0) || time % 400 == 0) {
            _Date = _Date + 29 - 6;
          } else {
            _Date = _Date + 28 - 6;
          }
        }
        Month = Month - 1;
      } else {
        _Date = _Date - 6;
      }
      if (Month < 10) {
        Month = "0" + Month;
      }
      if (_Date < 10) {
        _Date = "0" + _Date;
      }
      time = time + "-" + Month + "-" + _Date;
      this.beginDate = time;
	
      this.loadData(this.beginDate, this.endDate);
    },
    // 本月按钮触发事件
    setDate_month() {
      var myDate = new Date();
      var time = "";
      time = myDate.getFullYear();
      var Month = myDate.getMonth() + 1;
      var _Date = "";
      _Date = myDate.getDate();
      if (Month < 10) {
        Month = "0" + Month;
      }
      if (_Date < 10) {
        _Date = "0" + _Date;
      }
      this.beginDate = time + "-" + Month + "-" + "01";
      time = time + "-" + Month + "-" + _Date;
      this.endDate = time;
      this.loadData(this.beginDate, this.endDate);
    },
    // 打开报案日期选择层
    selRegisterDate: function() {
      this.registerWeek = true;
      // this.reportTime = new Date();
      // this.$refs.reportTime.open();
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
        this.loadData(this.beginDate, this.endDate);
      }
      // this.$refs.reportTime.close();
      this.currentTime = '';

    },
    getexpirationDate: function() {
      // 打开报案日期选择层
      this.registerMonth = true;
      // this.reportTime2 = new Date();
      // this.$refs.reportTime2.open();
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
        this.loadData(this.beginDate, this.endDate);
      }
      this.currentTime = '';
      // this.$refs.reportTime2.close();
    }
  },
  computed: {}
};

</script>
<style Scoped>
.main {
  padding: 10px;
  color: #666;
  /* margin-top: 49px; */
}

.main h5 {
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.order_all {
  background: #fff;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order_all .orderAll_right {
  border: 1px solid #eeeeee;
  padding: 2px 10px;
  color: #75b6ff;
  border-radius: 3px;
}
.condition_left{
	width: 40%;
/* display: flex; */
}
	
.order_all .orderAll_left h5 {
  float: left;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.order_all .orderAll_left p {
  float: left;
  font-size: 14px;
  color: #75b6ff;
}

.history_orderAll {
  margin: 10px 0;
  background: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history_orderAll .HisorderAll_right {
  border: 1px solid #eeeeee;
  padding: 2px 10px;
  color: #75b6ff;
  border-radius: 3px;
}

.history_orderAll .HisorderAll_left h5,
.order_all .orderAll_left h5 {
  float: left;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.history_orderAll .HisorderAll_left p {
  float: left;
  font-size: 14px;
  color: #75b6ff;
}

.data_today {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  z-index: 9;
}

.orderDeal,
.history_orederdeal,
.history_orderDefeat {
  margin: 10px 0px;
  background: #fff;
}

.orderDeal .title,
.orderFrom .title,
.orderDefeat .title {
  padding: 10px;
  border-bottom: 1px solid #eeeeee;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.history_orederdeal .title,
.history_orderDefeat .title {
  padding: 10px;
  border-bottom: 1px solid #eeeeee;
}

.history_orederForm .title {
  padding: 10px;
  border-bottom: 1px solid #eeeeee;
}

.orderFrom,
.orderDefeat,
.history_orederForm {
  margin: 10px 0px;
  background-color: #ffffff;
}

.mint-table,
.mint-table5 {
  background: #ffffff;
  border: 0px !important;
  border-radius: 3px;
}

.mint-table,
.mint-table5 tr {
  margin: 10px 0px;
}

.mint-table caption {
  border-bottom: 1px solid #eee;
  background: #ffffff;
  /* height: 30px;
  line-height: 30px; */
  font-size: 15px;
  color: #636363;
  text-align: left;
  /* padding-left: 5px; */
  padding: 10px;
}

.mint-table td {
  border: 0 !important;
  width: 20%;
  color: #606060;
  font-size: 13px;
}

.mint-table th {
  border: 0 !important;
  width: 20%;
  color: #606060;
  font-size: 13px;
}

.mint-table table {
  border: 0;
}

.tab_wt {
  width: 50%;
  float: left;
}

.tabFollowBox{
	display: flex;
	justify-content: space-around;
	align-content: center;
	 height: 60px;
}

.tab_follow {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
  align-items: center;  
}
.table-box{	
	overflow-x: auto; 
	white-space: nowrap;		 
	margin-left: 120px;
	/* border: solid 1px #e4e7ed;	 */
}
.table-box .table-td{
	display: inline-block;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	/* padding: 15rpx; */
	text-align: center;
	/* padding: 5px 15px; */
	width:100px;
	height: 30px;
	line-height: 30px;
	border-bottom: solid 1px #e4e7ed;
	border-right: solid 1px #e4e7ed;

}
.table-box .td1{
	position: absolute;
	left: 0;
	z-index: 2;
	width: 120px;
	border-left: solid 1px #e4e7ed;	
	/* width: 160px; */
}
  
.mint-table5 .insurance_company {
  border-top: 1px solid #eee;
}

.condition_time {
  height: 50px;
  background: #ffffff;
  line-height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0px;

}

.condition_right {
  position: relative;
}

.condition_right #isfont {
  float: left;
  margin: 0 5px;
}

#arrow_down_left img {
  height: 6.5px;
  width: 10px;
  position: absolute;
  top: 24px;
  left: 73px;
}

#arrow_down_right img {
  position: absolute;
  height: 6.5px;
  width: 10px;
  top: 24px;
  right: 1px;
}

.condition_right p {
  float: left;
  color: blue;
}

.charts{
	width: 100%; 
	height:400upx;
	background-color: #FFFFFF;
}
._charts{
	width: 100%;
	height:600upx;
	background-color: #FFFFFF;
}

</style>
