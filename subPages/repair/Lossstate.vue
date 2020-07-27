<template>
	<view class="">
		<u-navbar :background="{backgroundColor: '#315ade'}" :is-back="false" title-color="#fff" title="定损登记">						
			<view class="slot-wrap">
				<u-icon color="#fff" size="40" name="arrow-left" @click="openBack"></u-icon>
				 
			</view>			
		</u-navbar>
		  <view class="conten">
			<view class="cenmen">			     
			      <u-field  label="定损总金额(元)" label-width="190"  v-model="orderloss.fixedAmount"  placeholder="请输入" >			       
			      </u-field>	
				<view class="conmenAdd">
					<text>添加定损项目</text>
					<u-icon style="margin-left: 20rpx;" size="40" name="plus-circle" @click="tianjia"></u-icon>				
				</view>
			    <view  v-for="(item,index) in fixedItems" :key='index'>
			        <u-field label-width="190" label="定损项目"  placeholder="请输入"  v-model="item.fixedItems" >			     
			        </u-field>
			    </view>
			</view>
		  </view>
		  <view class="btn_create" @click="Preservation"  >
		    保存
		  </view>
		  <u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
	  data() {
	    return {
		  background: {  },
	      insuredVehilots: false,
			orderloss: { repairOrderId: "", fixedAmount: "", fixedItems: "" },
			orderdetails: [],
			fixedItems: [],
			allItem: [],
	    };
	  },
	  onShow(){		
		  
		  var self = this;		
		  this.$http.get( "/vi/repairOrder/getRepairOrder?repairOrderId=" + self.orderloss.repairOrderId ).then(res => {
			this.orderdetails = res.result;
			this.orderloss.fixedAmount = this.orderdetails.fixedAmount;
		  });
	  },
	  onLoad(parmse){
		  this.orderloss.repairOrderId = parmse.id;
	  },
	    methods: {
	      openBack: function() {
	        uni.navigateBack({	        	
	        })
	      },
		   oninput(e) {
		        // 通过正则过滤小数点后两位
		        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
		        // console.log('e', e.target.value)
		        this.orderloss.fixedAmount = e.target.value;
		      },
		   Preservation: function() {		     
		        if (this.orderloss.fixedAmount == "") {
		          // Toast("请输入金额");
				  this.$refs.uToast.show({title:'请输入金额'});
		          return false;
		        }
		  
		        this.fixedItems.map(item => {
		          this.allItem.push(item.fixedItems);
		          this.allItem.toString();
		        });
		        this.orderloss.fixedItems = this.allItem.toString();
		        // console.log(this.orderloss.fixedItems)
		        if (this.orderloss.fixedItems == '') {
		          // Toast('请输入定损项目详情')
				  this.$refs.uToast.show({title:'请输入定损项目详情'});
		          return false;
		        }
		        var model = this.orderloss;
		        this.$http.post("/vi/repairOrder/fixed", model).then(res => {
		          if (res) {
		            uni.navigateBack({});
		          }
		        });
		      },
		      tianjia: function() {
		        var obj = { fixedItems: "" };
		        this.fixedItems.push(obj);		  
		      },

	    }
	  
	}
</script>

<style scoped>
	.conten {
	  background-color: #fff;
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
	.conmenAdd{
		    font-size: 14px;
		    padding: 10px 14px;
		    text-align: left;
		    position: relative;
		    color: #303133;
	}
</style>
