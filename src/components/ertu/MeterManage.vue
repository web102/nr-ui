<template>
  <Col span="20">
    <div class="content_right">
      <div class="content_title">{{title}}</div>
      <!-- 主体内容 -->
      <div class="content_main">
        <div class="tab_content" style="background-color:#fff">
          <Row>
            <Col span="19" push="5" style="background-color: #C9C9C9;">
              <div class="tools_top">
                <Row>
                  <Col span="8">
                    <label for="comment_content">电表名称:</label>
                    <Input type="text" id="comment_content" size="small"
                           v-model="comment_content"></Input>
                  </Col>
                  <Col span="3">
                    <div class="tools_search" @click="select()">
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
              <Table class="tab" :columns="columns" :data="tabData" ellipsis border height="487"
                     highlight-row align="left"></Table>
            </Col>
            <Col span="5" pull="19">
              <div class="tools_top1">终端</div>
              <Tree :data="tree" @on-select-change="choiceAll" ref="tree4"></Tree>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <Modal v-model="modal1" width="360"
           @on-ok="ok"
           @on-cancel="cancel">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>电表信息</span>
      </p>
      <div style="text-align:center;">
        <Form ref="formInline" :model="meter" :label-width="80" inline>
          <FormItem label="电表名称">
            <Input v-model="meter.meterName" style="width:150px" :required="true"/>
          </FormItem>
          <FormItem label="电表序号">
            <Input v-model="meter.meterNo" style="width:150px"/>
          </FormItem>
          <FormItem label="电表地址">
            <Input v-model="meter.meterAddr" style="width:150px"/>
          </FormItem>

          <FormItem label="开始点号">
              <Input v-model="meter.paramModelId" style="width:150px"/>
          </FormItem>

          <!--  <FormItem label="费率">
               <Input v-model="meter.tariff" style="width:150px"/>
           </FormItem>
           <FormItem label="电表小数位">
               <Input v-model="meter.decimal" style="width:150px"/>
           </FormItem>
           <FormItem label="通道号">
               <Input v-model="meter.port" style="width:150px"/>
           </FormItem>
           <FormItem label="CT">
               <Input v-model="meter.ct" style="width:150px"/>
           </FormItem>
           <FormItem label="PT">
               <Input v-model="meter.pt" style="width:150px"/>
           </FormItem> -->
          <FormItem label="终端">
            <Select v-model="meter.ertuId" style="width:150px">
              <Option :value="ertu.id" v-for="(ertu,index) of tree" :key="index+1">{{ertu.title}}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="规约">
              <Select v-model="meter.protocolId" style="width:150px">
                  <Option :value="protocol.protocolId" v-for="(protocol,index) of protocols" :key="index+2">
                      {{protocol.protocolName}}
                  </Option>
              </Select>
          </FormItem> -->
          <!--<FormItem label="任务ID">-->
          <!--<Input v-model="meter.acquiredId" style="width:150px"/>-->
          <!--</FormItem>-->
          <!--<FormItem label="设备厂家">-->
              <!--<Select v-model="meter.manufactureId" style="width:150px">-->
                  <!--<Option :value="manufacture.id" v-for="(manufacture,index) of manufactures" :key="index+4">{{manufacture.name}}-->
                  <!--</Option>-->
              <!--</Select>-->
          <!--</FormItem>-->
          <!--<FormItem label="设备型号">-->
              <!--<Input v-model="meter.modelId" style="width:150px"/>-->
          <!--</FormItem>-->
          <FormItem label="设备型号">
          <Input v-model="meter.model" style="width:150px"/>
          </FormItem>
          <!--<FormItem label="通讯状态">-->
              <!--<Input v-model="meter.state" style="width:150px"/>-->
          <!--</FormItem> -->
          <!--<FormItem label="参数模板">-->
          <!--<Select v-model="meter.paramModelId" style="width:150px">-->
          <!--<Option :value="paramModel.modelId" v-for="(paramModel,index) of paramModels" :key="index+5">-->
          <!--{{paramModel.modelName}}-->
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
        manufactures: [
          {
            id: 1,
            name: '变电站'
          },
          {
            id: 2,
            name: '换流站'
          },
          {
            id: 3,
            name: '配电站'
          },
        ],
        tree: [],
        addErtuId: '',
        protocols: [],
        paramModels: [],
        meter: {},
        loading: true,
        title: '',
        modal1: false,
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
            title: '电表名称',
            key: 'meterName',
            align: 'center',
            width: 120,
            ellipsis: true
          }, {
            title: '电表序号',
            key: 'meterNo',
            align: 'center',
            width: 120,
            ellipsis: true
          }, {
            title: '开始点号',
            key: 'paramModelId',
            align: 'center',
            width: 120,
            ellipsis: true
          },
          {
            title: '电表地址',
            key: 'meterAddr',
            width: 120,
            align: 'center',
            ellipsis: true
          },
          // {
          //     title: '主副标识',
          //     key: 'mainDeputy',
          //     width: 100,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: '费率',
          //     key: 'tariff',
          //     width: 95,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: '电表小数位',
          //     key: 'decimal',
          //     width: 100,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: '通道号',
          //     key: 'port',
          //     width: 80,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: 'CT',
          //     key: 'ct',
          //     width: 80,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: 'PT',
          //     key: 'pt',
          //     width: 80,
          //     align: 'center',
          //     ellipsis: true
          // },
          {
            title: '终端',
            key: 'ertuId',
            width: 95,
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              var value;
              this.tree.forEach(function (element) {
                if (element.id == params.row.ertuId) {
                  value = element.title;
                }
              });

              return h('div', value)
            }
          },
          // {
          //     title: '规约ID',
          //     key: 'protocolId',
          //     width: 95,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: '任务ID',
          //     key: 'acquiredId',
          //     width:95,
          //     align: 'center',
          //     ellipsis : true
          // },
          // {
          //     title: '设备厂家',
          //     key: 'manufactureId',
          //     width: 95,
          //     align: 'center',
          //     ellipsis: true
          // },
          {
              title: '设备型号',
              key: 'model',
              width: 95,
              align: 'center',
              ellipsis: true
          },
          // {
          //     title: '通讯状态',
          //     key: 'state',
          //     width: 95,
          //     align: 'center',
          //     ellipsis: true
          // },
          // {
          //     title: '参数模板',
          //     key: 'paramModelId',
          //     width: 100,
          //     align: 'center',
          //     ellipsis: true,
          //   render: (h, params) => {
          //     var value;
          //     this.paramModels.forEach(function (element) {
          //       if(element.modelId == params.row.paramModelId){
          //         value = element.modelName;
          //       }
          //     });
          //     return h('div',value)
          //   }
          // },

          {
            title: '操作',
            key: 'action',
            width: 150,
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
                      this.loadTree();
                      this.loadProtocols();
                      this.loadParamModels();
                      this.modal1 = true;
                      this.meter = params.row
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
        tabData: []
      }
    },
    methods: {
      renderContent(h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ])
        ]);
      },
      loadTree() {
        this.$http(`/ertu/ertuTree`)
          .then(res => {
            if (res.data.status === 'success') {
              this.tree = res.data.results.children;
            }
          });
      },
      loadData() {
        this.$http(`/meter/findMeterByErtuId?ertuId=${this.addErtuId}`)
          .then(res => {
            if (res.data.status == 'success') {
              this.tabData = res.data.results;
            }
          })
      },
      loadProtocols() {
        this.$http(`/protocol/getList`)
          .then(res => {
            if (res.data.status == 'success') {
              this.protocols = res.data.results;
            }
          })
      },
      loadParamModels() {
        this.$http(`/paramModel/findAll`)
          .then(res => {
            if (res.data.status == 'success') {
              this.paramModels = res.data.results;
            }
          })
      },
      add() {
        this.loadTree();
        this.loadParamModels();
        this.loadProtocols();
        this.modal1 = true;
        this.meter = {
          ertuId: this.addErtuId,
        };
      },
      ok() {
        var url = '/meter/save';
        this.$http(url, {params: this.meter})
          .then(res => {
            if (res.data.status === 'success') {
              this.$Message.info('操作成功！');
            } else {
              this.$Message.info('操作失败！');
            }
            this.loadData();
          })
      },
      cancel() {
        this.$Message.info('您取消了添加操作！');
        this.loadData();
      },
      select() {
        if (this.comment_content == null || this.comment_content === '') {
          this.$Message.info("请输入查询内容！");
          this.loadData();
        }
        else {
          this.$http(`/meter/findSimilar?meterName=${this.comment_content}&ertuId=${this.addErtuId}`)
            .then(res => {
              if (res.data.status === 'success' && res.data.results !== '') {
                this.tabData = res.data.results;
              }
              else {
                this.$Message.info('未查询找到相关信息！');
              }
            });
        }
      },
      delete(row) {
        this.$Modal.confirm({
          title: "确认删除该条目",
          content: "执行删除操作之后，可能影响系统功能，请谨慎操作！",
          onOk: () => {
            this.$http(`/meter/delete?id=${row.meterId}`)
              .then(res => {
                if (res.data.status == 'success') {
                  this.loadData();
                  this.$Message.info('操作成功！');
                } else {
                  this.$Message.info('操作失败！');
                }
              })
          },
          onCancel: () => {
            this.$Message.info('您取消了添加操作！');
          }
        });
      },
      choiceAll: function (data) {
        if (data[0] == null) {
          this.tabData = [];
          this.addErtuId = '';
        } else {
          this.addErtuId = data[0].id;
          this.loadData(this.addErtuId)
        }
      }
    }
    ,
    created: function () {
      this.loadTree();
      this.loadData()
      this.loadProtocols();
      this.loadParamModels();
      if (this.$route.query.title == null) {
        this.title = '电表管理';
      } else {
        this.title = this.$route.query.title;
      }
    }
    ,
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
    margin-left: 1px;
  }

  .tools_top1 {
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
