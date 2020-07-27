<template>
  <view class="home">  
	<u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="工单查询结果">
		<view class="slot-wrap">
			<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>	
		</view>			
	</u-navbar>
    <view class="container-center">
      <view class="swmt-list" id="swmt-list" v-for="item in workorderlist" @click="repairDataDetail(item)" :key="item.id" v-show="hasdata">
        <view class="swmt-list-top">
          <p>工单号:{{item.jobNumber}}</p>
          <p>{{item.createdTime}}</p>
        </view>
        <view class="swmt-list-fooer">
          <view class="fooer-1">
          	<view class="fooer-1-left">
          		<h2>{{ item.plateNo ? (item.name ? item.plateNo + ' -- ' + item.name : item.plateNo) : item.name ? item.name : '' }}</h2>
          		<text>{{ item.orderStatusName }}</text>
          	</view>
          	<view class="fooer-1-right" v-if="item.phone" @click.stop="makePhone(item)">
          		<!-- <a :href="'tel:' + item.phone"> -->									
          		<image style="width:60rpx;height: 60rpx;" src="../../static/img/ic_call.png" mode=""></image>
          		<!-- </a> -->
          	</view>
          </view>
          <view class="fooer-2">
          	<text>{{ item.insCorpName }}</text>
          	<text>{{ item.conductorUserName }}</text>
          </view>
          <view class="fooer-3">
          	<text v-if="item.canMoveCarStatus == 'Travel'">[无需拖车]</text>
          	<text v-else-if="item.canMoveCarStatus == 'NoTravel'">[需要拖车]</text>
          	<text v-else-if="item.canMoveCarStatus == 'Unknown'">[未知]</text>
          	<text>出险地点:</text>
          	<image style="width:26rpx;height: 32rpx;" src="../../static/img/u153.png" mode=""></image>
          	<text>																		
          		{{ item.reportAddress ? item.reportAddress : '' }}
          	</text>
          </view>
          <view class="fooer-4">
            <p>{{item.orderStatusDisplay}}</p>
            <view class="followIn_status_btn">
            	<button @click.stop="allocation(item)" shape="square" size="mini" v-if="item.orderStatus != 'Closed' && item.orderStatus != 'Done' ">转单</button>
            	<button
            		@click.stop="actionSheet(item)"
            		shape="square"
            		size="mini"
            		v-if="item.orderStatus == 'TobeConfirmed' || item.orderStatus == 'Following'"
            	>
            		跟进
            	</button>
            	<button @click.stop="Lossstate(item)" shape="square" size="mini" v-if="item.orderStatus == 'TobePendingLoss'">定损</button>
            	<button
            		@click.stop="Carrepairstate(item)"
            		shape="square"
            		size="mini"
            		v-if="item.orderStatus == 'TobeRepaired' || item.orderStatus == 'Repaireing'"
            	>
            		维修
            	</button>
            	<button @click.stop="Turninacar(item)" shape="square" size="mini" v-if="item.orderStatus == 'PendingVehicle'">交车</button>
            	<button @click.stop="Close(item)" shape="square" size="mini" v-if="item.orderStatus == 'TobePendingLoss' || item.orderStatus == 'TobeRepaired'">
            		关闭
            	</button>
            </view>
          </view>
        </view>
      </view>
      <view id="nodata" v-show="!hasdata">暂无结果</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      workorderlist: [],
      hasdata: false,
      btn: true,
      hasManage: ''
    }
  },
  created() {
    this.hasManage = uni.getStorageSync("hasManage");
    if (uni.getStorageSync("registration")) {
      var arr = uni.getStorageSync("registration");
      var url = "/vi/repairOrder/my";
      
      if (this.hasManage) {
        url = "/vi/repairOrder";
      }
      url = url + '?plateNo=' + arr.plateNo + '&name=' + arr.name + '&phone=' + arr.phone + '&jobNumber=' +
        arr.jobNumber + '&insCorpCode=' + arr.insCorpCode + '&sourceType=' + arr.sourceType;
		uni.showLoading();
      this.$http.get(url).then(res => {
        uni.hideLoading();     
        if (res.result) {
          this.workorderlist = res.result;
          this.hasdata = (this.workorderlist.length > 0);
        } else {
          this.hasdata = false;
        }
      })
    } else {
      this.hasdata = false;
    }
  },
  // computed: {
  //   choose_Corp() {
  //     let _Reason = [{
  //       flex: 1,
  //       values: Object.values(this.data_Corp),
  //       className: "slot1",
  //       textAlign: "center"
  //     }]
  //     return _Reason
  //   },
  //   Vehilots() {
  //     let _Vehilots = [{
  //       flex: 1,
  //       values: Object.values(this.Vehilot),
  //       className: "slot1",
  //       textAlign: "center"
  //     }];
  //     return _Vehilots;
  //   },
  // },
  methods: {
    makePhone(item) {
    	uni.makePhoneCall({
    		phoneNumber: item.phone //仅为示例
    	});
    },
    // 转单
    allocation(item) {
    	var id = item.id;
    	uni.navigateTo({
    		url:  './allocation?id=' + id
    	});				
    },
    actionSheet: function(item) {
    	//跟进客户
    	var id = item.id;
    	uni.navigateTo({
    		url:  './followIn?id=' + id
    	});			
    },
    Lossstate: function(item) {
    	//定损
    	var id = item.id;
    	// var fixedAmount = self.orderdetails.fixedAmount
    	uni.navigateTo({
    		url:  './Lossstate?id=' + id 
    	});
    	// this.$router.push({ path: '/repair/Lossstate?id=' + id });
    },
    Carrepairstate: function(item) {
    	//修车
    	var id = item.id;
    	uni.navigateTo({
    		url:  './Carrepairstate?id=' + id
    	});
    	// this.$router.push({ path: '/repair/Carrepairstate?id=' + id });
    },
    Turninacar: function(item) {
    	//交车
    	var id = item.id;
    	uni.navigateTo({
    		url:  './Turninacar?id=' + id
    	});
    	// this.$router.push({ path: '/repair/Turninacar?id=' + id });
    },
    Close: function(item) {
    	var id = item.id;
    	uni.navigateTo({
    		url:  './Close?id=' + id
    	});
    	// this.$router.push({ path: '/repair/Close?id=' + id });
    },
    repairDataDetail: function(item) {
      var id = item.id;
      uni.navigateTo({				
      	url:  './orderDetail?id=' + id
      });
    },
    openBack: function() {
      uni.navigateBack({})
    },
  }

}

</script>
<style Scoped>
.item {
  display: inline-block;
}

.home {
  position: relative;
  height: 100%;
  background-color: rgba(247, 247, 247, 1);
}

.nav {
  padding: 10px;
  width: 100%;
  display: flex;
  space-around: inherit;
  justify-content: space-evenly;
  margin-top: 40px;
  height: 40px;
  padding: 0;
  background: #ffff;
  align-items: center;
}

.link {
  color: inherit;
  padding: 20px;
  display: block;
}

.mint-tab-item {
  text-align: center;
}

.swmt-list {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  background: #ffff;
  border-radius: 5px;
}

.swmt-list-top {
  height: 30px;
  padding: 0px 10px;
  border-bottom: 0.5px solid #eee;
  font-size: 13px;
  color: #666;
  line-height: 30px;
  border-radius: 5px 5px 0 0;
  margin-top: 0;
  background: #fff;
}

.swmt-list-top p:nth-child(1) {
  float: left;
  display: block;
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swmt-list-top p:nth-child(2) {
  float: right;
}

.swmt-list-fooer {
  /* height: 100px; */
  width: 100%;
}

.fooer-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 30px;
  margin-top: 10px;
}

.fooer-1 h2 {
  font-size: 15px;
  color: #333;
  float: left;
  font-weight: bold;
}

.fooer-1 .fooer-1-right img {
  width: 30px;
  height: 30px;
}

#nodata {
  height: 100%;
  width: 100%;
  text-align: center;
  padding: 50% 0;
  color: #a4a4a4;
  font-size: 16px;
}

.fooer-1 p {
  float: right;
  font-size: 12px;
  color: #0d82f4;
}

.fooer-2 {
  display: flex;
  align-content: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 25px;
  align-items: center;
}

.fooer-2 p {
  font-size: 13px;
  color: #666;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fooer-2 span {
  font-size: 18px;
  /* margin-right:42px; */
  color: #666;
  position: absolute;
  right: 15px;
  top: 0px;
}


.fooer-3 {
  padding: 0 5px;
  height: 30px;
  margin-top: 4px;
  padding: 0 10px;
}

.fooer-3 p:nth-child(1) {
  float: left;
  font-size: 13px;
  color: #666;
}

.fooer-3 p:nth-child(2) {
  float: left;
  font-size: 13px;
  color: #666;
}

.fooer-3 p:nth-child(3) img {
  float: left;
  margin-right: 3px;
}

.fooer-3 p:nth-child(3) {
  float: left;
  font-size: 13px;
  color: #666;
  margin-left: 2px;
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fooer-3 p:nth-child(4) {
  float: left;
  font-size: 13px;
  color: #666;
  border: 1px solid #2e64fe;
  border-radius: 5px;
  padding: 3px;
  float: right;
  color: #2e64fe;
}

.fooer-3 p:nth-child(5) {
  float: left;
  font-size: 13px;
  color: #666;
  border: 1px solid #a4a4a4;
  border-radius: 5px;
  padding: 3px;
  float: right;
  color: #a4a4a4;
}

.fooer-4 {
	border-top: 0.5px solid #eee;
	height: 40px;
	padding: 0 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}


/* selectcolor: ["#26E496", "#FFA853", "#FD4A2E", "#666666"], */
#statusColor_1 {
  color: #26E496;
  font-size:15px;
}

#statusColor_2 {
  color: #FFA853;
  font-size:15px;
}

#statusColor_3 {
  color: #0d82f4;
  font-size:15px;
}

#statusColor_4 {
  color: #a4a4a4;
  font-size:15px;
}

.followIn_status_btn button {
 background: #fff;
 border: 0.5px solid #0d82f4;
 color: #0d82f4;
 margin-left: 10px;
}

.select_status {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  z-index: 9;
}

.witeTime {
  width: 130px;
  text-align: center;
  color: #666666;
  background: #f0f0f0;
  border-radius: 10px;
  margin-left: 10px;
  font-size: 12px;
  line-height: 21px;
  padding: 0 5px;
}

.isClick {
  width: 130px;
  text-align: center;
  color: #f0f0f0;
  background: #FD4A2E;
  border-radius: 10px;
  margin-left: 10px;
  font-size: 12px;
  line-height: 21px;
  padding: 0 5px;
}

</style>
