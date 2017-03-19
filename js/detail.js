var app=new Vue({
	el:'#app',
	components:{
		"navbar":{
			template:"#navbar",
			data:function(){
				return {
					searchKey:'',
					isLogin:false,
					isShow:false
				}
			},
			ready:function(){
				var dinerstr=localStorage.getItem("dinerInfo");
				if(dinerstr!=''&&dinerstr!=null){
					try{
						var dinerobj=JSON.parse(dinerstr);
						if(dinerobj.dinerId!=''&&dinerobj.dinerId!=null){
							this.$parent.dinerInfo=dinerobj;
							this.isLogin=true;
						}
					}catch(e){
						console.log(e);
					}
				}
			},
			props:['d'],
			methods:{
				logout(){
					localStorage.removeItem('dinerInfo');
					this.isLogin=false;
					
				},
				back2login:function(type){
					var currenturl=window.location.href;
					currenturl=currenturl.substring(currenturl.lastIndexOf('/')+1);
					var params = {showType:type,backUrl:currenturl};
					sessionStorage.setItem("params",JSON.stringify(params));
					window.location.href = "signup.html";
				},
				getSearch(){
					sessionStorage.setItem("trans",this.searchKey);
					window.location.href='index.html'
					
					
				}
			}
			
		}
	},//components
	data:{
		dinerInfo:{},
		restaurantId:0,
		detailUrl:'http://iservice.itshsxt.com/restaurant/detail/',
		resInfo:{},
		reviewUrl:'http://iservice.itshsxt.com/review/find',
		revResult:[],
		query:{},
		page:1

	},
	methods:{
		getDetail(){
//			alert(this.detailUrl)
			this.$http.jsonp(this.detailUrl)
				.then(
					function(res){
						var data=res.data;
						if(data.resultCode==1){
							this.resInfo=data.result;

						}else{
							console.log(data.message)
						}
							
						
				})
		},
		getReview(pages){
			if(pages != null){
				this.page = pages;
			}else {
				this.page = 1;
			}
			//发送请求
			this.$http.jsonp(this.reviewUrl,{restaurantId:this.restaurantId,page : this.page})
				.then(
					function (res) {
						var data = res.data;
						if(data.resultCode == 1){
							this.revResult = data.result;
							this.query = data.query;
						}else{
							console.log(data.message);
						}
					}
				);
		}
	},
	ready:function(){
		var resIdStr=sessionStorage.getItem('resId');
		if(resIdStr==''||resIdStr==null){
			alert('Oops something wrong, pls try again');
			setTimeout(function(){
				history.go(-1);
			},1000)
		}
		var resIdObj=JSON.parse(resIdStr);
		var restaurantId=resIdObj.restaurantId;
		if(isNaN(restaurantId)){
			alert('Oops something wrong, pls try again');
			return;
		}
		this.restaurantId=restaurantId;
		this.detailUrl=this.detailUrl+this.restaurantId;
		this.getDetail();
		this.getReview();
	}
})