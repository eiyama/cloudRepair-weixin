<template>
  <view>
   <u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="定损记录">
   	<view class="slot-wrap">
   		<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>   	   		
   	</view>			
   </u-navbar>
    <view class="conten">
      <view class="conten-loss">
        <view class="conten-Record-loss" v-for="(item,index) in orderloss" :key="index" >
          <view class="record-title">
            <text>{{item.createTime}}</text>
            <text>定损</text>
          </view>
          <view class="fixedAmountBox">
            <text id="item_details">{{item.fixedItemContent}}</text>
            <text>定损金额：{{item.fixedAmount}}</text>
          </view>
        </view>
        <text class="wu" v-show="wu">暂无数据</text>
      </view>
    </view>
  </view>
</template>
<script>

export default {
  data() {
    return {
      orderloss: {
        status: "",
        creatorName: "",
        fixedAmount: "",
        supplementAmount: "",
        totalAmount: "",
        fixedItemContent: "",
        createTime: ""
      },
      Displaytime: false,
      wu: false
    };
  },
  onShow() {
    var self = this;  
    var id = this.orderloss.repairOrderId;
    this.$http.get("/vi/repairOrder/getRepairOrder?repairOrderId=" + id).then(
      res => {
        if (res.result.fixedTrackStatus) {
          this.orderloss = res.result.fixedTrackStatus;
          res.result.fixedTrackStatus.map(item => {
            if (item.fixedTrackStatus) {
              this.Displaytime = true;
            }
          });
        }
      }
    );
  },
  onLoad(parmse){
	  this.orderloss.repairOrderId  = parmse.id
  },
  methods: {
    openBack: function() {
     uni.navigateBack({});
    }
  }
};

</script>
<style Scoped>
.conten {
  /* background-color: rgba(242, 242, 242, 1); */
  width: 100%;
  overflow: hidden;
  height: 100%;
}

.conten-Record-loss {
  min-height: 40px;
  margin: 10px;
  background: #fff;
  padding-top: 5px;
  border-radius: 5px;
}

.conten-Record-loss .record-title {
  display: block;
  height: 22px;
}

.conten-Record-loss .record-title text:nth-child(1) {
  float: left;
  margin-left: 15px;
  color: #999999;
}

.conten-Record-loss .record-title text:nth-child(2) {
  float: right;
  margin-right: 15px;
  color: #999999;
}

#item_details {
  padding: 10px 15px;
}

.wu {
  padding: 10px 15px;
}

.fixedAmountBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 15px;
}

</style>
