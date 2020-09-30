<template>
    <Col span="20">
        <div class="content_title">{{title}}</div>
        <div class="picker">
            <ul class="ul_list after">
                <li class="after">
                    <span class="left">
                        账户名
                    </span>
                    <Input v-model="userName" placeholder="账户名" class="left" clearable style="width: 200px"/>
                </li>
                <li class="after">
                    <span class="left">
                        原密码
                    </span>
                    <Input v-model="oriPwd" type="password" placeholder="原密码" class="left" clearable style="width: 200px"/>
                </li>
                <li class="after">
                    <span class="left">
                        新密码
                    </span>
                    <Input v-model="newPwd" type="password" placeholder="新密码" class="left" clearable style="width: 200px"/>
                </li>
                <li class="after">
                    <span class="left">
                        确认密码
                    </span>
                    <Input v-model="comfirmPwd" type="password" placeholder="确认密码" class="left" clearable style="width: 200px"/>
                </li>
              <li>
                <span style="text-align: center">{{msg}}</span>
              </li>
                <li class="after">
                    <Button type="primary" @click="update()">修改</Button>
                </li>
            </ul>
        </div>
    </Col>
</template>

<script>
    export default {
        data () {
            return {
                userName : '',
                oriPwd : '',
                newPwd : '',
                comfirmPwd : '',
                msg:""
            }
        },
        methods:{
            update(){
                if(this.userName === "" || this.oriPwd !== ""  ||  this.newPwd !== ""  ||  this.comfirmPwd === ""){
                  this.msg ="请完善信息！";
                  setTimeout(() => {
                    this.msg=null;
                  }, 2000);
                }else if(this.comfirmPwd !== this.newPwd){
                  this.msg.info('密码不一致！');
                  setTimeout(() => {
                    this.msg=null;
                  }, 2000);
                } else {
                  this.$Modal.confirm({
                    onOk: () => {
                      this.$http(`/user/update?username=${this.userName}&password=${this.oriPwd}&newPassword=${this.newPwd}`)
                        .then(res => {
                          if (res.data.status == 'success') {
                            this.$Message.info('操作成功！');
                            this.$router.push({path: '/'})
                          } else {
                            this.msg ="操作失败！";
                            setTimeout(() => {
                              this.msg=null;
                            }, 2000);
                          }
                        })
                    },
                    onCancel: () => {
                      this.$Message.info('您取消了添加操作！');
                    }
                  });
                }
            }
        },
        created: function () {
            if(this.$route.query.title == null){
			    this.title = '密码设置';
            }else{
                this.title = this.$route.query.title ;
            }
        }
    }
</script>

<style>
    .content_title{
		width: 100%;
		height: 30px;
		line-height: 30px;
		text-align: center ;
		background-color: #005C7E;
		color: #fff;
	}
    .left{
        float:left;
        vertical-align: middle;
        display: inline-block;
        height: 32px;
        line-height: 32px;
    }
    .after::after{
      text-align: center;
        content:'';
        display: block;
        clear: both;
    }
    .inbl{
        display: inline-block;
    }
    #content{
        text-align: center;
    }
    #content>h3{
        text-align: center ;
        margin-top: 20px;
    }
    #content>p{
        text-align: center ;
        margin-top: 10px;
    }
    .ul_list{
        list-style: none;
        margin: 0 auto ;
        width: 300px;
    }
    .ul_list>li{
        margin: 10px 0 ;
    }
    .ul_list>li span{
        width: 80px;
        font-size: 12px;
    }
    .picker{
        margin: 0 auto ;
        width: 500px;
    }

    .ivu-row{
        text-align: center ;
        margin : 0 auto ;
    }
    .ivu-col-span-12{
        width: 200px;
        padding-right: 0px !important;
    }
</style>
