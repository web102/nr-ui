<template>
  <div id="app">
    <heads />
    <Row class="main" style="height:calc(100vh - 50px)">
      <sidebar />
      <keep-alive>       
        <router-view :tableHeight="tableHeight" v-if="$route.meta.keepAlive"></router-view>   
      </keep-alive>  
        <router-view :tableHeight="tableHeight" v-if="$route.meta.keepAlive==null"></router-view>

    </Row>
    <!-- <foots /> -->
  </div>
</template>

<script>
  import heads from './components/Header/Header'
  import foots from './components/Footer/Footer'
  import sidebar from './components/Sidebar/Index'
  export default {
    name: 'electron-vue',
    components : { heads , foots , sidebar },
    data(){
      return{
        tableHeight:window.innerHeight - 140
      }
    },
    provide:{
      tableHeight:this.tableHeight
    },
    mounted(){
      window.onresize=()=>{
        this.tableHeight = window.innerHeight - 140
      }
    },
    methods:{
    }
  }
</script>

<style scoped>
  .main{
    height: 100%;
  }
  /*#app{*/
    /*overflow:hidden;*/
  /*}*/
</style>

<style>
  #app{
    min-width:700px;
  }
  .content_main{
    height:calc(100vh - 80px) !important;
    background: white;
  }
  .tab{
    height: calc(100vh - 140px);
  }
  .tab_content{
    height:calc(100vh - 110px);
    display: block;
  }
  .massage_panel{
    height:calc(100vh - 175px);
  }
</style>
