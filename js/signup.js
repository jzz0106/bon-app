
  		var vm=new Vue({
  			el:'.container',
  			data : {
					showType : 1,		//1:显示注册界面，0：显示登录界面
					signupUrl : "http://iservice.itshsxt.com/diner/signup",	//注册的url
					loginUrl : "http://iservice.itshsxt.com/diner/login",
					backUrl : 'index.html',	//登录或注册成功后跳转的路径
					flag:true,
					errorfirstname:'',
					signupForm : {	//注册信息
						firstname : '',	//用户名
						email : '',			//邮箱
						password : ''		//密码
					},
					
					signupError : {//注册的错误提示信息
						firstnameErrorMsg : '',	//用户名错误提示信息
						emailErrorMsg : '',		//邮箱错误提示信息
						passwordErrorMsg : ''	//密码错误提示信息
					},
					loginForm:{ //登录信息
						email : '',			//邮箱
						password : ''		//密码
					},
					loginError:{ //登录信息
						emailErrorMsg : '',		//邮箱错误提示信息
						passwordErrorMsg : ''	//密码错误提示信息
					}
				},
  			methods:{
  				switchsl(){
  					if(this.showType == 1) {
						this.showType = 0;
					} else if(this.showType == 0) {
						this.showType = 1;
					}
  				},
  				
  				//数据校验
					checkData : function (type) {
						switch(type){
							case 0 :
								this.signupError.firstnameErrorMsg = this.checkDataCommon(0,this.signupForm.firstname);
								break;
							case 1 :
								this.signupError.emailErrorMsg = this.checkDataCommon(1,this.signupForm.email);
								break;
							case 2 :
								this.signupError.passwordErrorMsg = this.checkDataCommon(2,this.signupForm.password);
							break;
							case 3 :
								this.loginError.emailErrorMsg = this.checkDataCommon(3,this.loginForm.email);
							break;
							case 4 :
								this.loginError.passwordErrorMsg = this.checkDataCommon(2,this.loginForm.password);
							break;
						}
					},
					checkDataCommon : function (type , value ) {
						var errorMsg = '';
						var reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
						if(value == '' || value == null){
							switch (type) {
								case 0 : 
									errorMsg = "Please input your firstname";
									break;
								case 1 :
									errorMsg = "Please input your Email";
									break;
								case 2 :
									errorMsg = "Please input your Password";
									break;
								case 3:
									errorMsg = "Please input your Email";
									break;
							}
						}else if(type==1&&!reg.test(this.signupForm.email)){
								errorMsg = 'Please input correct Email';
						}else if(type==3&&!reg.test(this.loginForm.email)){
								errorMsg = 'Please input correct Email';
						}
						else{
							errorMsg ='';
						}
						return errorMsg;
					},
					signup : function() {
						var reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
						if(reg.test(this.signupForm.email)){
							this.submit(this.signupUrl,this.signupForm)
						}else{
							alert('Pls input correct Email')
						}
						
//						this.$http.jsonp(this.signupUrl,this.signupForm)
//							.then(
//								function (res) {
//									var data = res.data;
//									if(data.resultCode==1){//成功
//										//将用户信息放入localStorage中
//										localStorage.setItem("dinerInfo",JSON.stringify(data.result));
//										//跳转
//										window.location.href = this.backUrl;
//									}else {//失败
//										alert(data.message);
//									}
//								}
//							);
					},
					login : function () {
						this.submit(this.loginUrl,this.loginForm)
//						this.$http.jsonp(this.loginUrl,this.loginForm)
//							.then(
//								function (res) {
//									var data = res.data;
//									if(data.resultCode==1){//成功
//										localStorage.setItem("dinerInfo",JSON.stringify(data.result));
//										//跳转
//										window.location.href = this.backUrl;
//									}else {//失败
//										alert(data.message);
//									}
//								}
//							);
					},
					submit:function(url,form){
						this.$http.jsonp(url,form)
							.then(
								function (res) {
									var data = res.data;
									if(data.resultCode==1){//成功
										localStorage.setItem("dinerInfo",JSON.stringify(data.result));
										//跳转
										window.location.href = this.backUrl;
									}else {//失败
										alert(data.message);
									}
								}
							);
					}
					
  			},
  			ready : function () {
				//获取sessionStorage
				var paramsStr = sessionStorage.getItem("params");
				var paramsObj;
				if(paramsStr != '' && paramsStr != null){
					paramsObj = JSON.parse(paramsStr);
					if(paramsObj.showType != null){
						this.showType = paramsObj.showType;
						
					}
					if(paramsObj.backUrl != null){
						this.backUrl = paramsObj.backUrl
					}
				}
			}
  			
  		});//newVue
  		
  		
  		
  		
  		
  		
  		
  		
  	
  	
