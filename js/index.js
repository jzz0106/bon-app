
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
					this.$parent.searchForm.searchKey=this.searchKey;
					this.$parent.getResList();
				}
			}
			
		}
	},
	data:{
		dinerInfo:{},
		resUrl:'http://iservice.itshsxt.com/restaurant/find',
		searchKey:'',
		restaurants:[],
		query:{},
		cuisines:[],
		areas:{},
		prices:[],
		searchForm:{
			page:1,
			searchKey:'',
			cuisine:'',
			neighborhood:'',
			averagePrice:''
			
		},
		selectnum:0
		
	},
	ready :function(){
		var searchKey=sessionStorage.getItem('trans');
		if(searchKey!=''&&searchKey!=null){
			this.searchForm.searchKey=searchKey;
			sessionStorage.removeItem('trans');
			var children=this.$children;
			children[0].searchKey=this.searchForm.searchKey;
		}
		this.getResList();
		this.getData();
		
	},
	methods:{
		getResList(n){
			if(n==null){
				this.searchForm.page=1;
			}else{
				this.searchForm.page=n;
			}
			
			this.$http.jsonp(this.resUrl,this.searchForm)
				.then(
					function (res) {
						var data = res.data;
						if(data.resultCode == 1){
							this.restaurants = data.result;
							this.query = data.query;
						}else{
							console.log(data.message);
						}
					}
				);
		},
		showSelect(i){
			if(this.selectnum==i){
				this.selectnum=0;
			}else{
				this.selectnum=i;
			}
			
		},
		getData(){
			this.$http.get('js/cuisine_area.json')
				.then(
					function(resolved){
						var data=resolved.data;
						this.cuisines=data.cuisines;
						this.areas=data.area;
						this.prices=data.prices;
					}
				)
		},
		queryselect(type,value){
			if(type == 1){
				this.searchForm.cuisine = value;
			}else if(type == 2){
				this.searchForm.neighborhood = value;
			}else if(type == 3){
				this.searchForm.averagePrice = value;
			}
			this.getResList();
//			this.selectnum = 0;
		},
		removeSelect(type){
			if(type == 1){
				this.searchForm.cuisine = '';
			}else if(type == 2){
				this.searchForm.neighborhood = '';
			}else if(type == 3){
				this.searchForm.averagePrice = '';
			}else if(type==null){
				this.searchForm.cuisine = '';
				this.searchForm.neighborhood = '';
				this.searchForm.averagePrice = '';
			}
			this.getResList();
		},
		clearselect(){
			if(this.selectnum!=0){
				this.selectnum=0;
			}
		},
		getDetail(value){
			sessionStorage.setItem('resId',JSON.stringify({restaurantId:value}))
			window.location.href='detail.html'
		}
	}
})	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

