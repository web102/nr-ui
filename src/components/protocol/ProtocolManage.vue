<template>
  <Col span="20">
    <div class="content_right">
      <div class="content_title">{{title}}</div>
      <!-- 主体内容 -->
      <div class="content_main">
        <div class="tools_top">
          <Row>
            <Col span="8">
              <label for="comment_content">规约名称:</label>
              <Input type="text" id="comment_content" size="small" v-model.trim="comment_content"/>
            </Col>
            <Col span="3">
              <div class="tools_search" @click="select">
                查询
                <Icon type="search"></Icon>
              </div>
            </Col>
            <Col span="3">
              <div class="tools_search" @click="add">
                添加
                <Icon type="plus"></Icon>
              </div>
            </Col>
          </Row>
        </div>
        <div class="tab_content">
          <Table class="tab" :columns="columns" :data="tabData" ellipsis border :height="tableHeight"  highlight-row></Table>
        </div>
      </div>
    </div>
    <Modal v-model="modal1" width="500px"
           @on-ok="ok"
           @on-cancel="cancel">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>规约信息</span>
      </p>
      <div style="text-align:center;">
        <Form ref="formInline" :model="protocol" :label-width="100" inline>
          <FormItem label="规约名称">
                        <span style="position: absolute; right: -10px; color:red;"
                              v-if="protocol.protocolName===''">*</span>
            <Input v-model="protocol.protocolName" style="width:360px"/>
          </FormItem>
          <FormItem label="规约别名">
            <Input v-model="protocol.protocolAlias" style="width:360px"/>
          </FormItem>
          <FormItem label="规约类名">
            <Input v-model="protocol.restPath" style="width:360px"/>
          </FormItem>
          <FormItem label="规约版本">
            <Input v-model="protocol.versionName" style="width:360px"/>
          </FormItem>
          <!--<FormItem label="链路地址">-->
            <!--<Input v-model="protocol.linkAddress" style="width:360px"/>-->
          <!--</FormItem>-->
          <!--<FormItem label="规约模板">-->
          <!--<span style="position: absolute; right: -10px; color:red;" v-if="protocol.protocolModelId===''">*</span>-->
          <!--<Select v-model="protocol.protocolModelId" style="width:200px">-->
          <!--<Option :value="instructModel.modelId" v-for="(instructModel,index) in instructModels" :key="index+1">-->
          <!--{{instructModel.modelName}}-->
          <!--</Option>-->
          <!--</Select>-->
          <!--</FormItem>-->
        </Form>
      </div>
    </Modal>
  </Col>
</template>
<script>
  export default {
    data() {
      return {
        changeProtocolModelId: '',
        protocol: {
          protocolName: '',
          protocolAlias: '',
          restPath: '',
          versionName: '',
          protocolModelId: '',
          linkAddress: '',
        },
        loading: true,
        title: '',
        modal1: false,
        change: true,
        height_hide: {
          height: '0px',
          transform: '.5s all',
        },
        height_show: {
          height: 'auto',
          transform: '.5s all',
          overflow: 'hidden'
        },
        comment_content: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 80,
            type: 'index',
            ellipsis: true
          },
          {
            title: '规约名称',
            key: 'protocolName',
            align: 'center',
            width: 150,
            ellipsis: true
          },
          {
            title: '规约别名',
            key: 'protocolAlias',
            width: 120,
            align: 'center',
            ellipsis: true
          },
          {
            title: '服务路径',
            key: 'restPath',
            width: 350,
            align: 'center',
            ellipsis: true
          },
          {
            title: '版本',
            key: 'versionName',
            width: 65,
            align: 'center',
            ellipsis: true
          },
          // {
          //   title: '链路地址',
          //   key: 'linkAddress',
          //   width: 130,
          //   align: 'center',
          //   ellipsis: true
          // },
          // {
          //     title: '指令模板',
          //     key: 'protocolModelId',
          //     width: 110,
          //     align: 'center',
          //     ellipsis: true,
          //     render: (h, params) => {
          //       var value;
          //       this.instructModels.forEach(function (element) {
          //         if(element.modelId == params.row.protocolModelId){
          //                 value = element.modelName;
          //               }
          //       });
          //
          //       return h('div',value)
          //     }
          // },
          {
            title: '操作',
            key: 'action',
            width: 140,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.protocol = params.row;
                      this.changeProtocolModelId = params.row.protocolModelId;
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row);
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        tabData: [],
        instructModels: [
          {
            modelId: '',
            modelName: '',
            modelDesc: ''
          },
        ],
      }
    },
    props: ['tableHeight'],
    methods: {
      loadData() {
        this.$http(`/protocol/getList`)
          .then(res => {
            if (res.data.status === 'success') {
              this.tabData = res.data.results;
            }
          })
      },
      select() {
        if (this.comment_content == null || this.comment_content === '') {
          this.loadData();
          this.$Message.info("请输入查询内容！");
        }
        else {
          this.$http(`/protocol/findSimilar?protocolName=${this.comment_content}`)
            .then(res => {
              if (res.data.status === 'success' && res.data.results != '') {
                this.tabData = res.data.results;
              }
              else {
                this.$Message.info('未查询找到相关信息！');
              }
            });
        }
      },
      add() {
        this.modal1 = true;
        this.change = false;
        this.protocol = {};
      },
      ok() {
        if (this.protocol.protocolName === '' || this.protocol.protocolModelId === '') {
          this.$Message.info("添加失败，必填数据不能为空")
        }
        else {
          var url = `/protocol/save`;
          this.$http(url, {params: this.protocol})
            .then(res => {
              if (res.data.status === 'success') {
                if (this.protocol.protocolId == null || this.protocol.protocolId === 0 || this.protocol.protocolId === '') {
                }
                this.$Message.info('操作成功！');
              } else {
                this.$Message.info('操作失败！');
              }
              this.loadData();
            })
        }
      },
      cancel() {
        this.change = true;
        this.$Message.info('您取消了添加操作！');
      },
      delete(row) {
        this.$Modal.confirm({
          title: "确认删除该条目",
          content: "执行删除操作之后，可能影响系统功能，请谨慎操作！",
          onOk: () => {
            this.$http(`/protocol/delete?id=${row.protocolId}`)
              .then(res => {
                if (res.data.status == 'success') {
                  this.loadData();
                  this.$Message.info('操作成功！');
                } else {
                  this.$Message.info('操做失败！');
                }
              })
          },
          onCancel: () => {
            this.$Message.info('您取消了添加操作！');
          }
        });
      },
    },
    watch: {
      'protocol.protocolModelId'() {
        if (this.protocol.protocolModelId !== '' && this.protocol.protocolModelId !== this.changeProtocolModelId && this.change) {
          this.$Modal.confirm({
            title: '确定修改规约模板吗？',
            content: '修改后，此规约的原来存储的指令将会立即被删除！',
            onOk: () => {
              this.$http(`/instructProtocolSet/deleteByProtocolId?protocolId=${this.protocol.protocolId}`)
                .then(res => {
                  if (res.data.status == 'success') {
                    this.$Message.info('清除成功！');
                  } else {
                    this.$Message.info('清除失败！');
                  }
                })
            },
            onCancel: () => {
              this.protocol.protocolModelId = this.changeProtocolModelId;
            }
          });
        }
      }
    },
    created: function () {
      this.loadData();
      if (this.$route.query.title == null) {
        this.title = '规约管理';
      } else {
        this.title = this.$route.query.title;
      }
    },
  }
</script>

<style scoped>
  body {
    font-family: "Source Sans Pro", sans-serif;
  }

  .content_left {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at top, #30343D 20%, #323E50 60%, #3A5274 100%);
  }

  .content_right {
    display: inline-block;
    background-color: #D6DBDF;
    width: 100%;
    height: 100%;
  }

  .content_title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #005C7E;
    color: #fff;
  }

  .ivu-row {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .ivu-col {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .menu_box {
    margin-top: 15px;
    color: #C8CCD7;
  }

  .menu_btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #373B47;
    border-top: 1px solid #333742;
    border-bottom: 1px solid #333742;
    text-align: center;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .btn_active {
    background-color: #20232C !important;
  }

  .angle_active::after {
    content: '';
    display: inline-block;
    width: 0px;
    height: 0px;
    border: 8px solid transparent;
    border-right: 8px solid #fff;
    position: absolute;
    right: 0px;
    top: 50%;
    margin-top: -8px;
  }

  .btn_show::after {
    content: '';
    display: inline-block;
    width: 0px;
    height: 0px;
    border: 8px solid transparent;
    position: absolute;
    right: 0px;
    top: 50%;
    border-top: 8px solid #fff !important;
    margin-top: -4px !important;
  }

  .angle_active::before {
    content: '';
    display: inline-block;
    width: 0px;
    height: 100%;
    border-right: 3px solid #81B1EB !important;
    position: absolute;
    left: 3px;
  }

  .angle::before {
    content: '';
    display: inline-block;
    width: 0px;
    height: 100%;
    border-right: 3px solid #536A86;
    position: absolute;
    left: 3px;
  }

  .tools_top {
    height: 30px;
    vertical-align: middle;
    padding-top: 5px;
    background: #DBEFFA;
    padding-left: 10px;
  }

  .tools_search {
    display: inline-block;
    width: 60px;
    height: 22px;
    line-height: 22px;
    background-color: #2d8cf0;
    color: #fff;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }

  .tools_search > i {
    font-size: 12px;
  }

  .tools_icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 0 5px;
    color: #2A8BBC;
    line-height: 20px;
    font-size: 20px;
    cursor: pointer;
  }

  .ivu-input-wrapper {
    width: 60%;
  }

  .btn_col {
    margin-top: 15px;
  }

  .main_btn {
    display: inline-block;
    width: 100px;
    border: 1px solid #000;
    height: 30px;
    margin: 0 10px;
    background-color: #eee;
    text-align: center;
    border-radius: 5px;
    vertical-align: middle;
    line-height: 30px;
  }
</style>
