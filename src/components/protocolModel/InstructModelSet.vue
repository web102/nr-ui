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
                                        <label for="comment_content">指令名称:</label>
                                        <Input type="text" id="comment_content" size="small" v-model="comment_content"/>
                                    </Col>
                                    <Col span="3">
                                        <div class="tools_search" @click="select">
                                            查询
                                            <Icon type="search"></Icon>
                                        </div>
                                    </Col>
                                    <Col span="3">
                                        <div class="tools_search" @click="add">
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
                            <div class="tools_top1" align="center">规约模板</div>
                            <Tree :data="data1" @on-select-change="choiceAll" ref="tree4" align="left"></Tree>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <Modal v-model="modal1" width="500px"
               @on-ok="ok"
               @on-cancel="cancel">
            <p slot="header" style="color:#2d8cf0;text-align:center">
                <span>指令选择</span>
            </p>
            <div>
                <details v-for="(value,key) in instructAll">
                    <summary>{{key}}</summary>
                    <CheckboxGroup v-model="checkedNames">
                        <Checkbox v-for="(list,index) in value" :label=list.instructId :key="index">
                            <span>{{list.instructPath}}:{{list.instructName}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </details>
            </div>
        </Modal>
    </Col>
</template>
<script>
    export default {
        data() {
            return {
                addModelId: '',
                checkedNames: [],
                instructAll: {},
                data1: [],
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
                        title: '指令名称',
                        key: 'instructName',
                        align: 'center',
                        width: 400,
                        ellipsis: true
                    },
                    {
                        title: '类型',
                        key: 'instructType',
                        width: 80,
                        align: 'center',
                        ellipsis: true
                    },
                    {
                        title: '标识',
                        key: 'instructPath',
                        width: 80,
                        align: 'center',
                        ellipsis: true
                    },
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
                instructModel: []
            }
        },
        methods: {
            renderContent(h, {root, node, data}) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                        left: '1px'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '2px'
                            }
                        }),
                        h('span', data.title)
                    ])
                ]);
            },
            loadData(modelId) {
                this.$http(`/instructModelSet/findInstructByModelId?modelId=${modelId}`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            this.tabData = res.data.results;
                        }
                    })
            },
            loadTree() {
                this.$http(`/instructModel/instructTree`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            this.data1 = res.data.results.children;
                            this.data1.selected = true;
                        }
                    })
            },
            loadInstructAll() {
                this.$http(`/instruct/instructSortByType`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            this.instructAll = res.data.results;
                        }
                    })
                console.log(this.instructAll);
            },
            add() {
              if(this.addModelId==''){
                this.$Message.info('请选择左侧规约模板!');
                return 0;
              }
                this.modal1 = true;
                this.loadInstructAll();
                this.checkedNames = [];
                for (let instruct of this.tabData) {
                    this.checkedNames.push(instruct.instructId);
                }
            },
            ok() {
                this.$http(`/instructModelSet/add?modelId=${this.addModelId}&instructIds=${this.checkedNames}`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            this.$Message.info('操作成功！');
                        } else {
                            this.$Message.info('操作失败！');
                        }
                        this.loadData(this.addModelId);
                    })
                this.checkedNames = [];
            },
            cancel() {
                this.$Message.info('您取消了添加操作！');
            },
            select() {
                if (this.addModelId === '') {
                    this.$Message.info("请在左侧选择模板！");
                }
                else if (this.comment_content == null || this.comment_content === '') {
                    this.$Message.info("请输入查询内容！");
                    this.loadData();
                }
                else {
                    this.$http(`/instruct/findSimilar?instructName=${this.comment_content}&modelId=${this.addModelId}&protocolId=0`)
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
                        this.$http(`/instructModelSet/delete?modelId=${this.addModelId}&instructId=${row.instructId}`)
                            .then(res => {
                                if (res.data.status == 'success') {
                                    this.loadData(this.addModelId)
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
              console.log(data)
                if (data[0] == null) {
                    this.tabData = [];
                    this.addModelId = ''
                } else {
                    this.addModelId = data[0].id;
                    this.loadData(this.addModelId)
                }
            }
        },
        created: function () {	//页面创建前
            this.loadTree();
            if (this.$route.query.title == null) {
                this.title = '模板管理';
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
