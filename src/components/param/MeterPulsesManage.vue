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
                                        <label for="comment_content">信息体名称:</label>
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
                                  <Col span="3">
                                    <div class="tools_search" @click="set()">
                                      配置
                                      <Icon type="plus"></Icon>
                                    </div>
                                  </Col>
                                </Row>
                            </div>
                            <Table class="tab" :columns="columns" :data="tabData" ellipsis border height="487"
                                   highlight-row></Table>
                        </Col>
                        <Col span="5" pull="19">
                            <div class="tools_top1">电表</div>
                            <Tree :data="tree" @on-select-change="choiceAll" ref="tree4" align="left"></Tree>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <Modal v-model="modal1" width="360px"
               @on-ok="ok"
               @on-cancel="cancel">
            <p slot="header" style="color:#2d8cf0;text-align:center">
                <span>参数信息</span>
            </p>
            <div style="text-align:center;">
                <Form ref="formInline" :model="pulse" :label-width="120" inline>
                    <FormItem label="信息体名称">
                        <Input v-model="pulse.pulseName" style="width:200px;"/>
                    </FormItem>
                    <FormItem label="信息体类型">
                        <Input v-model="pulse.pulseType" style="width:200px"/>
                    </FormItem>
                    <FormItem label="信息体地址">
                        <Input v-model="pulse.pulseAddr" style="width:200px"/>
                    </FormItem>
                    <FormItem label="电表">
                        <Select v-model="pulse.meterId" style="width:200px">
                            <Option v-for="(meter,index) in meters" v-model="meter.meterId" :key="index">{{meter.meterName}}</Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="是否限制有效值">
                        <Input v-model="pulse.isLimitValid" style="width:200px"/>
                    </FormItem>
                    <FormItem label="限制有效间隔">
                        <Input v-model="pulse.limitValidInterval" style="width:200px"/>
                    </FormItem>
                    <FormItem label="下限">
                        <Input v-model="pulse.lowLimit" style="width:200px"/>
                    </FormItem>
                    <FormItem label="上限">
                        <Input v-model="pulse.upLimit" style="width:200px"/>
                    </FormItem>
                    <FormItem label="限制有效值的标签">
                        <Input v-model="pulse.limitValidTimeTag" style="width:200px"/>
                    </FormItem> -->
                </Form>
            </div>
        </Modal>
      <Modal v-model="modal2" width="500px"
             @on-ok="ok2"
             @on-cancel="cancel">
        <p slot="header" style="color:#2d8cf0;text-align:center">
          <span>模板选择</span>
        </p>
        <div>
            <CheckboxGroup v-model="checkedNames">
              <Checkbox v-for="(param,index) in paramModels" :label=param.modelId :key="index">
                <span>{{param.modelName}}</span>
              </Checkbox>
            </CheckboxGroup>
        </div>
      </Modal>
    </Col>
</template>
<script>
    export default {
        data() {
            return {
              tabData: [],
                tree: [],
                addMeterId: '',
                meters: [],
              checkedNames: [],
                pulse: {
                    pulseName: '',
                    pulseType: '',
                    pulseAddr: '',
                    meterId: '',
                    isLimitValid: '',
                    limitValidInterval: '',
                    lowLimit: '',
                    upLimit: '',
                    limitValidTimeTag: ''
                },
              paramModels:[],
                loading: true,
                title: '',
                modal1: false,
                modal2:false,
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
                        title: '信息体名称',
                        key: 'pulseName',
                        align: 'center',
                        width: 150,
                        ellipsis: true
                    },
                    {
                        title: '信息体类型',
                        key: 'pulseType',
                        align: 'center',
                        width: 100,
                        ellipsis: true
                    },
                    {
                        title: '信息体地址',
                        key: 'pulseAddr',
                        align: 'center',
                        width: 100,
                        ellipsis: true
                    },
                    {
                        title: '电表Id',
                        key: 'meterId',
                        align: 'center',
                        width: 100,
                        ellipsis: true
                    },
                    // {
                    //     title: '是否限制有效值',
                    //     key: 'isLimitValid',
                    //     width: 150,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '限制有效间隔',
                    //     key: 'limitValidInterval',
                    //     width: 110,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '下限',
                    //     key: 'lowLimit',
                    //     width: 110,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '上限',
                    //     key: 'upLimit',
                    //     width: 110,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '限制有效的标签',
                    //     key: 'limitValidTimeTag',
                    //     width: 150,
                    //     align: 'center',
                    //     ellipsis: true
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
                                            this.loadMeter();
                                            this.pulse = params.row;
                                            this.modal1 = true;
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
            loadData() {
                this.$http(`/pulse/findByMeterId?meterId=${this.addMeterId}`)
                    .then(res => {
                        if (res.data.status == 'success') {
                            this.tabData = res.data.results;
                        }
                    })
            },
            loadTree() {
                this.$http(`/ertu/ertuMeterTree?idIsNull=true`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            this.tree = res.data.results.children;
                        }
                    });
            },
            loadMeter() {
                this.$http(`/meter/findAll`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            this.meters = res.data.results;
                        }
                    });
            },
          loadParamModel() {
            this.$http(`/paramModel/findAll`)
              .then(res => {
                if (res.data.status === 'success') {
                  this.paramModels = res.data.results;
                }
              });
          },
            add() {
                this.loadMeter();
                this.modal1 = true;
                this.pulse = {
                    meterId: this.addMeterId
                }
            },
          set() {
              if(this.addMeterId==0){
                this.$Message.info("请选择电表！");
                return 0;
              }
              this.modal2=true;
              this.loadParamModel();
            this.checkedNames = [];
            this.checkedNames.push(this.addMeterId);
          },
            ok() {
                var url = `/pulse/save`;
                this.$http(url, {params: this.pulse})
                    .then(res => {
                        if (res.data.status == 'success') {
                            this.$Message.info('操作成功！');
                        } else {
                            this.$Message.info('操作失败！');
                        }
                        this.loadData();
                    })
            },
          ok2() {
            this.$http(`/pulse/addsByMeterIdAndModelIds?modelIds=${this.checkedNames}`)
              .then(res => {
                if (res.data.status == 'success') {
                  this.$Message.info('操作成功！');
                } else {
                  this.$Message.info('操作失败！');
                }
                this.loadData();
              })
          },
            cancel() {
                this.$Message.info('您取消了添加操作！');
            },
            select() {
                if (this.addMeterId === '') {
                    this.$Message.info("请在左侧选择电表！");
                }
                else if (this.comment_content == null || this.comment_content === '') {
                    this.$Message.info("请输入查询内容！");
                    this.loadData();
                }
                else {
                    this.$http(`/pulse/findSimilar?pulseName=${this.comment_content}&meterId=${this.addMeterId}`)
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
            delete(row) {
                this.$Modal.confirm({
                    title: "确认删除该条目",
                    content: "执行删除操作之后，可能影响系统功能，请谨慎操作！",
                    onOk: () => {
                        this.$http(`/pulse/delete?id=${row.pulseId}`)
                            .then(res => {
                                if (res.data.status == 'success') {
                                    this.loadData();
                                    this.$Message.info('操作成功！');
                                } else {
                                    this.$Message.info('擦做失败！');
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
                    this.addMeterId = '';
                } else {
                    this.addMeterId = data[0].id;
                    this.loadData()
                }
            }
        },
        created: function () {
            this.loadTree();
            this.loadMeter();
            if (this.$route.query.title == null) {
                this.title = '信息体管理';
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
