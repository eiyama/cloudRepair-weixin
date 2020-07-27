<template>
	<view class="a-swiper-dot">
		<view style="background-color: #f7f7f7;height: 100vh;">
			<u-navbar :background="background" :is-back="false" title-color="#fff" title="留修工单">
				<view class="slot-wrap">
					<u-icon color="#fff" size="40" name="plus" @click="toAddorder"></u-icon>
					<view style="color:#FFFFFF;font-size: 32rpx;"></view>					
				</view>
			</u-navbar>
			<view class="tabFixed">
				<u-tabs style="flex: 1;" :list="list" :is-scroll="false" :current="current" @change="change">					
				</u-tabs>
				<view class="" style="width: 40px;border-left: 1rpx solid #EEEEEE;">
					<u-icon style=" margin-left: 20rpx;" size="40" color="#333333" name="search" @click="serachOrder"></u-icon>							
				</view>
			</view>
			
			<view style="margin-top: 40px;">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
					<!-- <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">					 -->
					<view class="wmt-list" :key="index" v-for="(item, index) in workorderlist" @click="toDetail(item)">
						<view class="wmt-list-top">
							<text>工单号:{{ item.jobNumber }}</text>
							<text>{{ item.createdTime }}</text>
						</view>
						<view class="wmt-list-fooer">
							<view class="fooer-1">
								<view class="fooer-1-left">
									<h2>{{ item.plateNo ? (item.name ? item.plateNo + ' -- ' + item.name : item.plateNo) : item.name ? item.name : '' }}</h2>
									<text>{{ item.orderStatusName }}</text>
								</view>
								<view class="fooer-1-right" v-if="item.phone" @click.stop="makePhone(item)">
									<!-- <a :href="'tel:' + item.phone"> -->									
									<image style="width:60rpx;height: 60rpx;" src="../../../static/img/ic_call.png" mode=""></image>
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
								<image style="width:26rpx;height: 32rpx;" src="../../../static/img/u153.png" mode=""></image>
								<text>																		
									{{ item.reportAddress ? item.reportAddress : '' }}
								</text>
							</view>
							<view class="fooer-4">
								<view style="display:flex;">
									<text id="statusColor_1">{{ item.orderStatusDisplay }}</text>
									<!-- <text v-if="item.orderStatus == 'TobeConfirmed'" class="witeTime" v-bind:class="{isClick: isYue[index] }">等待时长： {{item.time}}</text> -->
								</view>
								<!-- {{hours}}:{{minutes}}:{{seconds}} -->
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
				</mescroll-body>
				<!-- <text @click="tomap">地图</text> -->
			</view>
		</view>
	</view>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'; // 注意.vue后缀不能省
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			hasBackUp:'',
			status:'TobeConfirmed',
			background: { backgroundColor: '#315ade' },
			scrollTop: '100rpx',
			list: [
				{
					name: '待跟进'
				},
				{
					name: '跟进中'
				},
				{
					name: '已到店'
				},
				{
					name: '战败'
				},
				{
					name: '全部'
				}
			],			
			current: 0,
			workorderlist: [],
			mescroll: null, // mescroll实例对象 (此行可删,mixins已默认)
			// 下拉刷新的配置(可选, 绝大部分情况无需配置)
			downOption: {},
			// 上拉加载的配置(可选, 绝大部分情况无需配置)
			upOption: {
				page: {
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无更多数据'
				}
			}
		};
	},
	onShow() {
		// this.getRepairDatas('TobeConfirmed');
		this.change(this.current);
		const value = uni.getStorageSync('token');
		if (!value) {
			uni.navigateTo({
				url: '../myImfor/login'
			});
		}
	},
	onLoad(params) {
		// console.log(params)		
		if(params.appId) {
			const appId = params.appId;
			uni.setStorageSync('appId', appId);
			return;
		}
		if(uni.getStorageSync('appId')){
			return
		}
		if(!uni.getStorageSync('appId') && !params.appId){
			const appId = "cx520062310s119lx1" ;
			uni.setStorageSync('appId', appId);
		}
	},
	components: {
		uniNavBar,
		MescrollBody
	},
	watch:{
		
	},
	methods: {
		serachOrder(){
			uni.navigateTo({
				url:'../../../subPages/repair/searchOrder'
			})
		},
		toAddorder(){
			uni.navigateTo({
				url:'../../../subPages/repair/addorder'
			})
		},
		 
		makePhone(item) {
			uni.makePhoneCall({
				phoneNumber: item.phone //仅为示例
			});
		},
		// 转单
		allocation(item) {
			var id = item.id;
			uni.navigateTo({
				url:  '../../../subPages/repair/allocation?id=' + id
			});				
		},
		actionSheet: function(item) {
			//跟进客户
			var id = item.id;
			uni.navigateTo({
				url:  '../../../subPages/repair/followIn?id=' + id
			});			
		},
		Lossstate: function(item) {
			//定损
			var id = item.id;
			// var fixedAmount = self.orderdetails.fixedAmount
			uni.navigateTo({
				url:  '../../../subPages/repair/Lossstate?id=' + id 
			});
			// this.$router.push({ path: '/repair/Lossstate?id=' + id });
		},
		Carrepairstate: function(item) {
			//修车
			var id = item.id;
			uni.navigateTo({
				url:  '../../../subPages/repair/Carrepairstate?id=' + id
			});
			// this.$router.push({ path: '/repair/Carrepairstate?id=' + id });
		},
		Turninacar: function(item) {
			//交车
			var id = item.id;
			uni.navigateTo({
				url:  '../../../subPages/repair/Turninacar?id=' + id
			});
			// this.$router.push({ path: '/repair/Turninacar?id=' + id });
		},
		Close: function(item) {
			var id = item.id;
			uni.navigateTo({
				url:  '../../../subPages/repair/Close?id=' + id
			});
			// this.$router.push({ path: '/repair/Close?id=' + id });
		},
		change(index) {
			this.current = index;
			var self = this;
			switch (index + 1) {
				case 1:
					self.getRepairDatas('TobeConfirmed');
					break;
				case 2:
					self.getRepairDatas('Following');
					break;
				case 3:
					self.getRepairDatas('', true);
					break;
				case 4:
					self.getRepairDatas('Closed');
					break;
				case 5:
					self.getRepairDatas('');
					break;
				default:
					self.getRepairDatas('TobeConfirmed');
			}
		},
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		toDetail(item){
			var id = item.id;			
			uni.navigateTo({				
				url:  '../../../subPages/repair/orderDetail?id=' + id
			});
		},		
		/*下拉刷新的回调, 有三种处理方式:*/
		downCallback(page){
			// 第1种: 请求具体接口
		
			// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
			this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			// 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
			// this.mescroll.endSuccess()

			// 此处仍可以继续写其他接口请求...
			// 调用其他方法...
		},
		/*上拉加载的回调*/
		upCallback(page) {
			var self = this;
			var param = {};		
			var url = '/vi/repairOrder';
			var hasBackUp = false;
			if (this.hasBackUp) {
				hasBackUp = true;
			} else {
				hasBackUp = false;
			}			
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			param.orderStatus = this.status;
			param.hasBackShop = hasBackUp;
			param.offset = (pageNum - 1) * pageSize;
			param.limit = pageSize;					
			this.$http.get(url,param).then(data=>{				
					// 接口返回的当前页数据列表 (数组)
					if(data.status == 200 ){
						let curPageData = data.result;
						// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
						let curPageLen = curPageData.length;
						// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
						// let totalPage = data.xxx;
						// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
						let totalSize = data.page.totalRows;
						// 接口返回的是否有下一页 (true/false)
						let hasNext =  this.workorderlist.length <= data.page.totalRows ? true : false;
										
						//设置列表数据
						if(page.num == 1) this.workorderlist = []; //如果是第一页需手动置空列表
						this.workorderlist = this.workorderlist.concat(curPageData); //追加新数据
										
						// 请求成功,隐藏加载状态
						//方法一(推荐): 后台接口有返回列表的总页数 totalPage
						// this.mescroll.endByPage(curPageLen, totalPage);
										
						//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
						this.mescroll.endBySize(curPageLen, totalSize);
										
						//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
						//this.mescroll.endSuccess(curPageLen, hasNext);
										
						//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
						//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
						//如果传了hasNext,则翻到第二页即可显示无更多数据.
						//this.mescroll.endSuccess(curPageLen);
										
						// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
						// 建议使用setTimeout,因为this.$nextTick某些情况某些机型不触发
						setTimeout(()=>{
							this.mescroll.endSuccess(curPageLen)
						},20)
					}	
					//curPageLen必传的原因:
					// 1. 使配置的noMoreSize 和 empty生效
					// 2. 判断是否有下一页的首要依据:
					//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
					//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
					// 3. 当传的值等于page.size时(满页),才取totalPage, totalSize, hasNext判断是否有下一页
					// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
				
					// 提示: 您无需额外维护页码和判断显示空布局,mescroll已自动处理好.
					// 当您发现结果和预期不一样时, 建议再认真检查以上参数是否传正确
				
			})

			// 此处仍可以继续写其他接口请求...
			// 调用其他方法...
		},


		getRepairDatas: function(status, hasBackUp) {
			var self = this;
			var param = {};
			this.status = status;			
			this.hasBackUp = hasBackUp;
			if (hasBackUp) {
				hasBackUp = true;
			} else {
				hasBackUp = false;
			}
			param.orderStatus = status;
			param.hasBackShop = hasBackUp;
			// Indicator.open("加载中...");
			// var url = "/vi/repairOrder/my";
			// console.log(this.hasManage);
			this.hasManage = uni.getStorageSync('hasManage');
			if (this.hasManage) {
			  url = "/vi/repairOrder";
			}
			var url = '/vi/repairOrder';
			// console.log(param)
			uni.showLoading({
				title: '加载中...'
			});
			this.$http.get(url, param).then(res => {
				uni.hideLoading();
				if (res.result) {
					this.workorderlist = res.result;
				}
				this.mescroll.resetUpScroll();
				this
				if (this.workorderlist.length > 0) {
					this.hasdata = false;
				} else {
					this.hasdata = true;
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.slot-wrap {
	display: flex;
	padding: 0 30rpx;
	justify-content: space-between;
	align-items: center;
	flex: 1;
}
.tabFixed {
	position: fixed;
	left: 0;
	right: 0;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #FFFFFF;
}
.wmt-list {
	flex: none;
	margin-top: 20rpx;
	background: #ffff;
	border-radius: 10rpx;
	margin: 30rpx;
	border: 2rpx solid #eee;
	// padding: 10rpx;
}

.wmt-list-top {
	height: 60rpx;
	padding: 0px 20rpx;
	border-bottom: 1rpx solid #eee;
	font-size: 26rpx;
	color: #666;
	line-height: 60rpx;
	border-radius: 10rpx 10rpx 0 0;
	margin-top: 0;
	background: #fff;
	display: flex;
	justify-content: space-between;
}

.wmt-list-top p:nth-child(1) {
	float: left;
	display: block;
	width: 40%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.wmt-list-top p:nth-child(2) {
	float: right;
}

.wmt-list-fooer {
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
	min-height: 40px;
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
	color: #26e496;
	font-size: 15px;
}

#statusColor_2 {
	color: #ffa853;
	font-size: 15px;
}

#statusColor_3 {
	color: #0d82f4;
	font-size: 15px;
}

#statusColor_4 {
	color: #a4a4a4;
	font-size: 15px;
}
.followIn_status_btn {
	display: flex;
}
.fooer-4 .followIn_status_btn button {
	background: #fff;
	border: 0.5px solid #0d82f4;
	color: #0d82f4;
	margin-left: 10px;
	// border-radius: 10px;
	// font-size: 13px;
	// padding: 1px 5px;
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
	background: #fd4a2e;
	border-radius: 10px;
	margin-left: 10px;
	font-size: 12px;
	line-height: 21px;
	padding: 0 5px;
}
</style>
