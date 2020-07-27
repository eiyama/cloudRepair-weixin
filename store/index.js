import Vue from 'vue'
import Vuex from 'vuex' 

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		isOrderFrom:false,//工单来源
		isOutside:false,//外拓
		login:false,
		
	},
    mutations: {
		//更新登录状态
		orderFrom(state, isOrderFrom) {
		  state.isOrderFrom =  isOrderFrom;
		},
		outside(state, isOutside) {
		  state.isOutside =   isOutside;
		},
	},
	
    actions: {
		
	}
})
export default store