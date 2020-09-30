<template>
  <div class="login">
    <div class="login_box">
      <div class="title_top">
        登 录
      </div>
      <div class="content_box">
        <p>
          <label for="uname">
            <Icon type="android-person" size="18" color="#55B3E7" ></Icon>
          </label>
          <input type="text" name="" id="uname" v-model="uname" >
        </p>
        <p>
          <label for="upwd">
            <Icon type="locked" size="18" color="#55B3E7" ></Icon>
          </label>
          <input type="password" name="" id="upwd" v-model="upwd" >
        </p>
        <div class="login_btn" @click="login">登陆</div>
        <div class="register_btn" @click="register">注册</div>
        <div v-if="loginMsg" class="error">{{this.loginMsg}}</div>
      </div>
      <div class="title_bottom">报文解析</div>
    </div>
    <Modal v-model="modal1" width="300px">
      <p slot="header" style="color:#f60;text-align:center"><span>用户注册</span></p>
      <div  style="text-align:center;">
        <Form ref="formInline" :model="newUser" :label-width="60">
          <FormItem label="账号名" >
            <Input v-model="newUser.userName"/>
          </FormItem>
          <FormItem label="用户姓名">
            <Input v-model="newUser.name"/>
          </FormItem>
          <FormItem label="注册秘钥">
            <Input v-model="userKey"/>
          </FormItem>
          <FormItem label="联系方式">
            <Input v-model="newUser.phone"/>
          </FormItem>
          <FormItem label="登录密码">
            <Input v-model="newUser.password"/>
          </FormItem>
          <FormItem label="确认密码">
            <Input v-model="confirmPassword"/>
          </FormItem>
          <span style="color: red">{{registerMsg}}</span>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modal1=false">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        userKey:'',
        uname : '',
        upwd : '',
        loginMsg:"",
        registerMsg:"",
        modal1: false,
        newUser: {
          userName: '',
          name: '',
          phone:'',
          password:''
        },
        confirmPassword:'',
      }
    },

    methods: {
      login(){
        this.loginMsg="正在登录...";
        this.$http(`/user/login?username=${this.uname}&password=${this.upwd}`)
          .then(res=>{
            if(res.data.status === "success"){
              this.$router.push({ path: '/send', query: { user: this.uname , pwd : this.upwd }});
            }
            else if(res.data.status === "fail"){
              this.loginMsg=res.data.results;
              this.loginMsg="登录失败";
            }
          })
          .catch(()=>{
            this.loginMsg="连接失败！"
          })
      },
      ok () {
        if(this.userKey!=="root"){
          this.registerMsg="秘钥错误！";
          setTimeout(() => {
            this.registerMsg=null;
          }, 2000);
        }else if(this.newUser.password!==this.confirmPassword){
          this.registerMsg="密码不一致！";
          setTimeout(() => {
            this.registerMsg=null;
          }, 2000);
        }else if(this.newUser.userName!==''&&this.newUser.name!==''&&this.newUser.phone!==''&&this.newUser.password!==''){
          this.$http.post('/user/save',this.newUser)
            .then(res=>{
              this.$Message.info(res.data.results);
              this.modal1 = false;
            })
        }else {
          this.registerMsg="请完善信息！";
          setTimeout(() => {
            this.registerMsg=null;
          }, 2000);
        }
      },

      register(){
        this.modal1 = true;
        this.confirmPassword='';
      }
    }
  };
</script>

<style scoped>
  .inbl{
    display: inline-block;
  }
  .login{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0 ;
    top: 0 ;
    background: #f0f ;
    /* z-index: 9999999; */
    background: radial-gradient(ellipse at top left,#95D8FF 20%,#2C8EF7 60% , #95D8FF 100%);
  }
  .login_box{
    width: 300px;
    height: 200px;
    margin: 0 auto ;
    margin-top: 20%;
    position: relative;
    background: radial-gradient(ellipse at top,#E7F1F3 20%, #E8F0F3 100%);
  }
  .title_top{
    width: 320px;
    height: 30px;
    position: absolute ;
    top: -30px;
    left: -10px;
    font-size: 18px;
    text-align: center ;
    background-color: #E7F1F3;
    box-shadow:0px 2px 15px 5px #8EC7DF;
  }
  .content_box{
    width:200px;
    height: 150px;
    position: absolute;
    left: 50%;
    top:50px;
    margin-left: -100px;
  }
  .content_box>p{
    display: block;
    width: 100%;
    height: 35px;
  }
  .content_box>p>label{
    color: #000;
    margin-right: 5px;
    margin-left: 5px;
  }
  .content_box>p>input{
    background-color: #0D698E;
    border: none ;
    outline:medium;
    border-radius: 3px;
    height: 20px;
    color: #fff ;
    text-align: center ;
  }
  .login_btn{
    position: absolute;
    right: 120px;
    height: 20px;
    width: 50px;
    background-color: #569CC7;
    border: none ;
    cursor: pointer;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }
  .register_btn{
    position: absolute;
    right: 30px;
    height: 20px;
    width: 50px;
    background-color: #569CC7;
    border: none ;
    cursor: pointer;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }
  .error{
    position: absolute;
    width: 100%;
    text-align: center;
    top:100px;
    color: red;
  }
  .title_bottom{
    width: 100%;
    height: 30px;
    background-color: #005C7E;
    color: #fff;
    font-size: 16px;
    text-align: center ;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
  }
</style>
