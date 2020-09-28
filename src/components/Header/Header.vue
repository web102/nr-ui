<template>
	<div>
		<div class="header after">
			<Row>
				<Col span="4">
					<div class="header-left left">
						<!-- 247*48	 -->
						<!-- 70*50	 -->
						<img src="../../assets/img/icon.png" alt="" >
					</div>
				</Col>
				<Col span="20">
					<div class="header-right right">
						<div class="title">
							<h2>规约测试软件</h2>
						</div>
						<!-- <div class="time">
							<div class="yearTime">{{yearTime}}</div>
							<div class="weekTime inbl">{{week}}</div>
							<div class="hoursTime inbl">{{hfmTime}}</div>
						</div> -->
						<div class="update" @click="update">
							<span>修改</span>
						</div>
						<div class="logout" @click="logout">
							<span>退出</span>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	</div>
</template>

<script>
	export default {
		data : function(){
			return{
				yearTime : '',	//显示年月日
				week : '',	//显示周几
				hfmTime : '' ,	//显示时分秒
			}
		},
		methods: {
			DayTime : function(timestamp,type){
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '年';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
                var D = date.getDate() + '日';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
				var s = date.getSeconds();
				if(type == 'day'){
					return Y+M+D;
				}else if(type == 'week') { //星期
					switch (new Date().getDay()) {
						case 0:
							return "星期日"
							break;
						case 1:
							return "星期一"
							break;
						case 2:
							return "星期二"
							break;
						case 3:
							return "星期三"
							break;
						case 4:
							return "星期四"
							break;
						case 5:
							return "星期五"
							break;
						case 6:
							return "星期六"
							break;
						default:
							break;
					}
				}else{
					return h+m+s ;
				}
			},
			logout(){
				this.$router.push({ path: '/' })
			},
			update(){
				this.$router.push({ path: '/pwdSetting' })
			}
		},
		created:function(){
			this.yearTime =  this.DayTime(Date.parse(new Date())/1000,'day')
			this.week =  this.DayTime(Date.parse(new Date())/1000,'week')
			this.hfmTime =  this.DayTime(Date.parse(new Date())/1000,'hfm')
		},
		mounted:function(){
			setInterval(() => {
				this.hfmTime =  this.DayTime(Date.parse(new Date())/1000,'hfm')
			}, 1000);
		}
	}
</script>

<style scoped>
	.inbl{
		display: inline-block;
	}
	.left{
		float: left;
	}
	.right{
		float: right;
	}
	.after{
		content: '';
		display: block;
		clear: both;
	}

	.header{
		width: 100%;
	}
	.header-left{
		display: inline-block;
		width: 100%;
		height: 50px;
		background-color: #005C7E;
    text-align: center;
	}
	.header-left>img{
	}
	.header-right{
		display: inline-block;
		background: radial-gradient(ellipse at top left,#95D8FF 20%,#2C8EF7 60% , #95D8FF 100%);
		width: 100%;
		height: 50px;
		position: relative;
	}
	.title{
		display: inline-block;
		width:70%;
		color: #fff;
		height: 100%;
		vertical-align: middle ;
		text-align: center ;
		line-height: 50px;
	}
	.time{
		display: inline-block;
		width:49%;
		border: 1px solid #000;
	}
	.update{
		width:45px;
		height: 22px;
		line-height: 22px;
		text-align: center;
		border-radius: 2px;
		position: absolute;
		color: #fff;
		background: dodgerblue;
		font-size: 12px;
		right: 60px;
		top: 50%;
		cursor: pointer;
		margin-top: -10px;
	}
	.update>span{
		cursor: pointer;
	}
	.logout{
		width:45px;
		height: 22px;
		line-height: 22px;
		text-align: center;
		border-radius: 2px;
		position: absolute;
		color: #fff;
		background:#ed4050;
		font-size: 12px;
		right: 15px;
		top: 50%;
		cursor: pointer;
		margin-top: -10px;
	}
	.logout>span{
		cursor: pointer;
	}
	.yearTime{
		width: 100%;
		height: 20px;
	}
	.weekTime{
		width: 48%;
	}
	.hoursTime{
		width: 48%;
	}
</style>
