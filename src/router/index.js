import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component : require('@/components/Login/Login').default
    },
    {
      path: '/pwdSetting',
      component : require('@/components/Login/PwdSetting').default
    },
    {
      path : '/protocol',  //规约管理 => 规约管理
      component : require('@/components/protocol/ProtocolManage').default
    },
    {
      path : '/instructProtocol',  //规约管理 => 规约配置
      component : require('@/components/protocol/InstructProtocolSet').default
    },
      {
          path : '/instruct',  //规约管理 => 指令管理
          component : require('@/components/protocolModel/InstructManage').default
      },
      {
          path : '/instructModel',  //模板管理 => 模板管理
          component : require('@/components/protocolModel/InstructModelManage').default
      },
      {
          path : '/instructModelSet',  //模板管理 => 模板配置
          component : require('@/components/protocolModel/InstructModelSet').default
      },
    {
      path : '/ertu',  //终端管理 => 终端管理
      component : require('@/components/ertu/ErtuManage').default
    },
    {
      path : '/network',  //终端管理 => 通道管理
      component : require('@/components/ertu/NetworkManage').default
    },
    {
      path : '/ammeter',  //终端管理 => 电表管理
      component : require('@/components/ertu/MeterManage').default
    },
    {
      path : '/pulse',  //终端管理 => 电表点号管理
      component : require('@/components/param/MeterPulsesManage').default
    },{
          path : '/param',  //信息体管理 => 电表信息体管理
          component : require('@/components/param/ParamManage').default
      },
      {
          path : '/paramModel',  //信息体管理 => 信息体模板
          component : require('@/components/param/ParamModelManage').default
      },
    {
      path : '/send',  //指令下发 => 指令下发
      component : require('@/components/InstructSend/InstructSend').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})