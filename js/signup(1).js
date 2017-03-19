var vm = new Vue({
	el: "#container",
	data: {
		showType: 1, //1:显示注册界面，0：显示登录界面
		signupUrl: "http://iservice.itshsxt.com/diner/signup", //注册的url
		loginUrl: "http://iservice.itshsxt.com/diner/login", //登录的url
		backUrl: 'index.html', //登录或注册成功后跳转的路径
		signupForm: { //注册信息
			firstname: '', //用户名
			email: '', //邮箱
			password: '' //密码
		},
		signupError: { //注册的错误提示信息
			firstnameErrorMsg: '', //用户名错误提示信息
			emailErrorMsg: '', //邮箱错误提示信息
			passwordErrorMsg: '' //密码错误提示信息
		},
		loginForm: { //登录信息
			email: '', //邮箱
			password: '' //密码
		},
		loginError: { //登录错误提示信息
			emailErrorMsg: '', //邮箱错误提示信息
			passwordErrorMsg: '' //密码错误提示信息
		}
	},
	ready : function () {
		//获取sessionStorage
		var paramsStr = sessionStorage.getItem("params");
		var paramsObj;
		if(paramsStr != '' && paramsStr != null){
			paramsObj = JSON.parse(paramsStr);
			if(paramsObj.showType != null){
				this.showType = paramsObj.showType
			}
			if(paramsObj.backUrl != null){
				this.backUrl = paramsObj.backUrl
			}
		}
	},
	methods: {
		//控制登录注册的显示隐藏
		showDiv: function() {
			if(this.showType == 1) {
				this.showType = 0;
			} else if(this.showType == 0) {
				this.showType = 1;
			}
		},
		//数据校验
		checkData: function(type) {
			switch(type) {
				case 0: //校验注册的用户名
					this.signupError.firstnameErrorMsg = this.checkDataCommon(0, this.signupForm.firstname);
					break;
				case 1: //校验注册的邮箱
					this.signupError.emailErrorMsg = this.checkDataCommon(1, this.signupForm.email);
					break;
				case 2: //校验注册的密码
					this.signupError.passwordErrorMsg = this.checkDataCommon(2, this.signupForm.password);
					break;
				case 3: //校验登录的邮箱
					this.loginError.emailErrorMsg = this.checkDataCommon(3, this.loginForm.email);
					break;
				case 4: //校验登录的密码
					this.loginError.passwordErrorMsg = this.checkDataCommon(4, this.loginForm.password);
					break;
			}
		},
		//数据校验的通用代码
		checkDataCommon: function(type, value) {
			var errorMsg = '';
			if(value == '' || value == null) {
				switch(type) {
					case 0: //校验注册的用户名
						errorMsg = "Please input your firstname";
						break;
					case 1: //校验注册的邮箱
						errorMsg = "Please input your Email";
						break;
					case 2: //校验注册的密码
						errorMsg = "Please input your Password";
						break;
					case 3: //校验登录的邮箱
						errorMsg = "Please input your Email";
						break;
					case 4: //校验注册的密码
						errorMsg = "Please input your Password";
						break;
				}
			} else {
				errorMsg = '';
			}
			return errorMsg;
		},
		//注册
		signup: function() {
			this.submit(this.signupUrl, this.signupForm);
		},
		//登录
		login: function() {
			this.submit(this.loginUrl, this.loginForm);
		},
		//提交请求的方法
		submit: function(url, formData) {
			this.$http.jsonp(url, formData)
				.then(
					function(res) {
						var data = res.data;
						if(data.resultCode == 1) { //成功
							//将用户信息放入localStorage中
							localStorage.setItem("dinerInfo", JSON.stringify(data.result));
							//跳转
							window.location.href = this.backUrl;
						} else { //失败
							alert(data.message);
						}
					}
				);
		}
	}
});