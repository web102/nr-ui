<template>
  <div id="app">
    <heads />
    <Row class="main">
      <sidebar />
      <router-view></router-view>
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
    components : { heads , foots , sidebar }
  }
</script>

<style scoped>
  .main{
    height: 427px;;
  }
</style>
