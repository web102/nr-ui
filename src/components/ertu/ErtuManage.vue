<template>
    <Col span="20">
        <div class="content_right">
            <div class="content_title">{{title}}</div>
            <!-- 主体内容 -->
            <div class="content_main">
                <div class="tools_top">
                    <Row>
                        <Col span="8">
                            <label for="comment_content">终端名称:</label>
                            <Input type="text" id="comment_content" size="small" v-model="comment_content"></Input>
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
                    <Table class="tab" :columns="columns" :data="tabData" ellipsis border :height="tableHeight"
                           highlight-row></Table>
                </div>
            </div>
        </div>
        <Modal v-model="modal1" width="360"
               @on-ok="ok"
               @on-cancel="cancel">
            <p slot="header" style="color:#2d8cf0;text-align:center">
                <span>终端信息</span>
            </p>
            <div style="text-align:center;">
                <Form ref="formInline" :model="ertu" :label-width="80" inline>
                    <FormItem label="终端名称">
                        <Input v-model="ertu.ertuName" style="width:200px"/>
                    </FormItem>
                    <!-- <FormItem label="电压等级">
                        <Input v-model="ertu.voltageClass" style="width:200px"/>
                    </FormItem> -->
                    <FormItem label="设备厂家">
                      <Input v-model="ertu.manufacturer" style="width:200px"/>
                    </FormItem>
                    <FormItem label="设备型号">
                        <Input v-model="ertu.model" style="width:200px"/>
                    </FormItem>
                    <!-- <FormItem label="场站类型">
                        <Input v-model="ertu.ertuType" style="width:200px"/>
                    </FormItem> -->
                    <FormItem label="规约">
                        <Select v-model="ertu.protocolId" style="width:200px">
                            <Option :value="protocol.protocolId" v-for="(protocol,index) of protocols" :key="index+3">
                                {{protocol.protocolName}}
                            </Option>
                        </Select>
                    </FormItem>
                    <!--<FormItem label="任务ID">-->
                    <!--<Input v-model="ertu.acquiredId" style="width:200px"/>-->
                    <!--</FormItem>-->
                    <!-- <FormItem label="地址">
                        <Input v-model="ertu.address" style="width:200px"/>
                    </FormItem>
                    <FormItem label="经度">
                        <Input v-model="ertu.longitude" style="width:200px"/>
                    </FormItem>
                    <FormItem label="纬度">
                        <Input v-model="ertu.latitude" style="width:200px"/>
                    </FormItem> -->
                    <!--<FormItem label="存储容量">-->
                        <!--<Input v-model="ertu.storeCap" style="width:200px"/>-->
                    <!--</FormItem>-->
                    <!-- <FormItem label="是否使用中">
                        <Input v-model="ertu.isInUse" style="width:200px"/>
                    </FormItem> -->

                </Form>
            </div>
        </Modal>
    </Col>
</template>
<script>
    export default {
        data() {
            return {
                protocols: [],
                ertu: {
                    ertuName: '',
                    voltageClass: '',
                    manufacture: '',
                    model: '',
                    ertuType: '',
                    protocolId: '',
                    acquiredId: '',
                    address: '',
                    longitude: '',
                    latitude: '',
                    storeCap: '',
                    isInUse: ''
                },
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
                        title: '终端名称',
                        key: 'ertuName',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    // {
                    //     title: '电压等级',
                    //     key: 'voltageClass',
                    //     align: 'center',
                    //     width: 120,
                    //     ellipsis: true
                    // },
                    {
                        title: '设备厂家',
                        key: 'manufacturer',
                        width: 120,
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: '设备型号',
                        key: 'model',
                        width: 120,
                        align: 'center',
                        ellipsis: true
                    },
                    // {
                    //     title: '场站类型',
                    //     key: 'ertuType',
                    //     width: 120,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    {
                        title: '规约名称',
                        key: 'protocolId',
                        width: 120,
                        align: 'center',
                        ellipsis: true.valueOf(),
                      render: (h, params) => {
                        var value;
                        this.protocols.forEach(function (element) {
                          if(element.protocolId == params.row.protocolId){
                            value = element.protocolName;
                          }
                        });

                        return h('div',value)
                      }
                    },
                    // {
                    //     title: '任务ID',
                    //     key: 'acquiredId',
                    //     width: 120,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '地址',
                    //     key: 'address',
                    //     width: 120,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '经度',
                    //     key: 'longitude',
                    //     width: 120,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '纬度',
                    //     key: 'latitude',
                    //     width: 120,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '存储容量',
                    //     key: 'storeCap',
                    //     width: 120,
                    //     align: 'center',
                    //     ellipsis: true
                    // },
                    // {
                    //     title: '是否使用中',
                    //     key: 'isInUse',
                    //     width: 120,
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
                                            this.loadProtocols();
                                            this.ertu = params.row;
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
                tabData: []
            }
        },
      props: ['tableHeight'],
        methods: {
            loadData() {
                this.$http(`/ertu/findAll`)
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
            select() {
                if (this.comment_content == null || this.comment_content === '') {
                    this.$Message.info("请输入查询内容！");
                    this.loadData();
                }
                else {
                    this.$http(`/ertu/findSimilar?ertuName=${this.comment_content}`)
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
                this.loadProtocols();
                this.modal1 = true;
                this.ertu = {};
            },
            ok() {
                var url = '';
                url = `/ertu/save`;
                this.$http(url, {params: this.ertu})
                    .then(res => {
                        if (res.data.status == 'success') {
                            this.$Message.info('操作成功！');
                        } else {
                            this.$Message.info('擦做失败！');
                        }
                        this.loadData();
                    })
            },
            cancel() {
                this.$Message.info('您取消了添加操作！');
                this.loadData();
            },
            delete(row) {
                this.$Modal.confirm({
                    title: "确认删除该条目",
                    content: "执行删除操作之后，可能影响系统功能，请谨慎操作！",
                    onOk: () => {
                        this.$http(`/ertu/delete?id=${row.ertuId}`)
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
        },
        created: function () {
            this.loadData();
            this.loadProtocols();
            if (this.$route.query.title == null) {
                this.title = '终端管理';
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
