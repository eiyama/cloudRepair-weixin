<template>
	<view class="">
		<u-navbar :background="background" :is-back="false" title-color="#fff" title="跟进记录">
			<view class="slot-wrap">
				<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>
				<!-- <view style="color:#FFFFFF;font-size: 32rpx;">跟进记录</view> -->
			
			</view>
		</u-navbar>
		  <view class="conten">
		      <view class="conten-foll">		       
		        <view class="conten-Record-foll "  v-for="(item, index) in orderloss" :key="index">		         
		          <view class="title">
					  <text id="conten-Record_left" >{{item.createdTime}}</text>		           
					  <text id="conten-Record_right">{{item.statusName}}</text>
		          </view>
		          <view id="item_details">{{item.content}}</view>
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
		  background: { backgroundColor: '#315ade' },
	      creatorName: '',
	      orderloss: [],
	      Displaytime: false,
	      wu: false,
		  id:''
	    };
	  },
	  onShow(){
			var self = this;
		   this.$http.get("/vi/repairOrder/getRepairOrder?repairOrderId=" + this.id).then(res => {		
		        this.creatorName = res.result.creatorName;
		        if (res.result.repairTrackStatus) {		        
		          self.orderloss = res.result.repairTrackStatus;
		          res.result.repairTrackStatus.map(item => {
		            if (item.isSetRemind) {
		              this.Displaytime = true;
		            }
		          });
		        } else {
		          self.wu = true;
		        }
		      });
	  },
	  onLoad(parmse){
		  this.id = parmse.id;
	  },
	    methods: {
	      openBack: function() {
	        uni.navigateBack({
	        	
	        })
	      }
	    }
	  
	}
</script>

<style scoped>
	.conten {
	  background-color: rgba(242, 242, 242, 1);
	  width: 100%;
	  overflow: hidden;
	  height: 100%;
	}
	
	.conten-Record-foll {
	  min-height: 40px;
	  margin: 10px;
	  background: #fff;
	  padding-top: 5px;
	  border-radius: 5px;
	  padding: 10px 15px;
	}
	
	.conten-Record-foll .title {
	  display: block;
	  height: 22px;
	}
	
	.conten-Record-foll .title #conten-Record_left {
	  float: left;
	  /* margin-left: 15px; */
	  color: #999999;
	}
	
	.conten-Record-foll .title #conten-Record_right {
	  float: right;
	  /* margin-right: 15px; */
	  color: #999999;
	}
	
	#item_details {
	  /* padding: 10px 15px; */
	}
	
	.wu {
	  padding: 10px 15px;
	}

</style>
