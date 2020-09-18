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
    <Modal v-model="modal1" width="300px"
           @on-ok="ok"
           @on-cancel="cancel">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>账户注册</span>
      </p>
      <div style="text-align:center;">
        <Form ref="formInline" :model="newUser" :label-width="60">
          <FormItem label="用户名" >
            <Input v-model="newUser.userName"></Input>
          </FormItem>
          <FormItem label="用户姓名">
            <Input v-model="newUser.name"></Input>
          </FormItem>
          <FormItem label="用户角色">
            <Input v-model="newUser.role"></Input>
          </FormItem>
          <FormItem label="联系方式">
            <Input v-model="newUser.phone"></Input>
          </FormItem>
          <FormItem label="登录密码">
            <Input v-model="newUser.password"></Input>
          </FormItem>
          <FormItem label="确认密码">
            <Input v-model="confirmPassword"></Input>
            <span style="text-align: right;position: absolute;right: 0px" v-if="comparePwd">密码不一致</span>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        uname : '',
        upwd : '',
        loginMsg:"",
        modal1: false,
        newUser: {
          userName: '',
          name: '',
          role:'',
          phone:'',
          password:''
        },
        confirmPassword:'',
        comparePwd:false,
      }
    },
    watch:{
      'confirmPassword'(){
        if(this.newUser.password===this.confirmPassword){
          this.comparePwd=false
        }else{
          this.comparePwd=true
        }
      },
      'newUser.password'() {
        if (this.newUser.password === this.confirmPassword||this.confirmPassword==='') {
          this.comparePwd = false
        } else {
          this.comparePwd = true
        }
      }

    },

    methods: {
      login(){
        this.loginMsg="正在登录...";
        this.$http(`/user/login?username=${this.uname}&password=${this.upwd}`)
          .then(res=>{
            if(res.data.status === "success"){
              this.$router.push({ path: '/protocol', query: { user: this.uname , pwd : this.upwd }});
            }
            else if(res.data.status === "fail"){
              this.loginMsg=res.data.results;
            }
          })
          .catch(()=>{
            this.loginMsg="连接失败！"
          })
      },
      ok () {
        if(this.newUser.userName!==''&&this.newUser.name!==''&&this.newUser.role!==''&&this.newUser.phone!==''&&this.newUser.password!==''&&this.confirmPassword!==''&&this.comparePwd===false){
          this.$http.post('/user/save',this.newUser)
            .then(res=>{
              this.$Message.info(res.data.results);
            })
            .catch(()=>{
              this.$Message.info("连接异常！");
            })
        }else {
          this.$Message.info('请完善信息！');
        }
      },
      cancel () {
        this.$Message.info('Clicked cancel');
      },
      register(){
        this.modal1 = true;
        this.newUser = {
          userName: '',
          name: '',
          role:'',
          phone:'',
          password:'',
        };
        this.confirmPassword='';
        this.comparePwd=false
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
