//导航栏组件（局部组件）
var naviGrid = Vue.extend({
	template : "#navi-template",
	data : function () {
		return {
			searchKey : '',	//搜索条件
			isLogin : false ,	//是否登录，false：未登录，true：登录
			isShow : false		//是否显示下拉
		}
	},
	props : ['dinerInfo'],
	ready : function () {
		//获取localStorage中dinerInfo
		var dinerInfoStr = localStorage.getItem("dinerInfo");
		var dinerInfoObj;
		if(dinerInfoStr !='' && dinerInfoStr != null){
			try{
				dinerInfoObj = JSON.parse(dinerInfoStr);
				if(dinerInfoObj.dinerId != null && dinerInfoObj.dinerId > 0){
					this.$parent.dinerInfo = dinerInfoObj;
					this.isLogin = true;	//将未登录变为已登录状态
				}
			}catch(e){
				console.log(e);
			}
		}
	},
	methods : {
		logout : function () {
			//删除localStorage中dinerInfo
			localStorage.removeItem("dinerInfo");
			this.isLogin = false;	//变成未登录状态
		},
		go2signuplogin : function (type) {
			//获取当前路径	http://localhost:8020/bonapp_web/index.html
			var loc = window.location.href;
			loc = loc.substring(loc.lastIndexOf("/")+1,loc.length);//loc.lastIndexOf("/")是loc中最后一次出现/的位置
			var params = {showType:type,backUrl:loc};
			//sessionStorage
			sessionStorage.setItem("params",JSON.stringify(params));
			window.location.href = "signup.html";
		},
		doSearch : function () {
			this.$parent.searchForm.searchKey = this.searchKey;//给父组件的searchKey赋值
			this.$parent.search();//调用父组件中的方法
		}
	}
});

var vm = new Vue({
	el : "#app",
	components : {
		"navi-grid" : naviGrid	//局部组件
	},
	data : {
		dinerInfo : {},	//用户信息
		findRestaurantUrl : 'http://iservice.itshsxt.com/restaurant/find',	//餐厅搜索的url
		searchForm : {
			page : 1,	//当前页
			searchKey : '',	//搜索条件
			cuisine : '',	//菜系
			neighborhood : '',	//行政区商圈
			averagePrice : ''	//价格
		},
		restaurants : [],	//餐厅信息
		query : {}	,	//分页信息
		showMenu : 0,	//0不显示下拉菜单
		cuisines : [] ,	//菜系
		areas : {},		//行政区商圈
		prices : []		//价格
	},
	ready : function () {
		this.search();
		this.initQueryConditions();
	},
	methods : {
		search : function (pages) {
			if(pages != null){//若pages不为null，将传递过来的参数赋值给page
				this.searchForm.page = pages;
			}else {
				this.searchForm.page = 1;
			}
			//发送请求
			this.$http.jsonp(this.findRestaurantUrl,this.searchForm)
				.then(
					function (res) {
						var data = res.data;
						if(data.resultCode == 1){//成功
							this.restaurants = data.result;
							this.query = data.query;
						}else{//失败
							console.log(data.message);
						}
					}
				);
		},
		showQueryCondition : function (type) {
			if(this.showMenu != type){
				this.showMenu = type;
			}else {
				this.showMenu = 0;
			}
		},
		initQueryConditions : function () {
			//发送请求
			this.$http.get('js/cuisine_area.json')
				.then(
					function (res) {//成功
						var data = res.data;
						this.cuisines = data.cuisines;
						this.areas = data.area;
						this.prices = data.prices;
					},
					function (errRes) {失败
						console.log(errRes);
					}
				);
		},
		queryConditions : function (type,value) {
			if(type == 1){
				this.searchForm.cuisine = value;
			}else if(type == 2){
				this.searchForm.neighborhood = value;
			}else if(type == 3){
				this.searchForm.averagePrice = value;
			}
			this.search();
			this.showMenu = 0;
		},
		resetQueryCondition : function (type) {
			if(type == null){
				this.searchForm.cuisine = '';
				this.searchForm.neighborhood = '';
				this.searchForm.averagePrice = '';
			}else if(type == 1){
				this.searchForm.cuisine = '';
			}else if(type == 2){
				this.searchForm.neighborhood = '';
			}else if(type == 3){
				this.searchForm.averagePrice = '';
			}
			
			this.search();
		}
	}
});
