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
                    <Input type="text" id="comment_content" size="small" v-model="comment_content"></Input>
                  </Col>
                  <Col span="3">
                    <div class="tools_search" @click="select()">
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
              <Table class="tab" :columns="columns" :data="tabData" ellipsis border :height="tableHeight" highlight-row align="left"></Table>
            </Col>
            <Col span="5" pull="19"style="border-bottom:1px solid rgb(201, 201, 201);">
              <div class="tools_top1" align="center">规约</div>
              <!--<Tree :data="data1" @on-select-change="choiceAll" ref="tree4" align="left"></Tree>-->
              <RadioGroup v-model="addProtocolId" vertical style="width: 100%;" @on-change="loadData">
                <Radio v-for="(data,index) in data1" :key="index" class="radio" :label="data.id">{{data.title}}</Radio>
              </RadioGroup>
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
        <details v-for="(value,key) in instructAll" style="border: 0px">
          <Summary class="summary">{{key}}</Summary>
          <CheckboxGroup  v-model="checkedNames" >
            <Checkbox v-for="(list,index) in value" :label=list.instructId :key="index" class="checkbox">
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
        data1: [],
        tabData: [],
        instructModel: [],
        addProtocolId: '',
        // addModelId: '',
        instructAll: [],
        checkedNames: [],
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
      }
    },
    props: ['tableHeight'],
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
      loadTree() {
        this.$http(`/protocol/protocolTree`)
          .then(res => {
            if (res.data.status === 'success') {
              this.data1 = res.data.results.children;
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
      },
      loadData(protocolId) {
        this.$http(`/instructProtocolSet/protocolInstruct?protocolId=${protocolId}`)
          .then(res => {
            if (res.data.status === 'success') {
              this.tabData = res.data.results;
            }
          })
      },
      add() {
        if (this.addProtocolId == '') {
          this.$Message.info('请选择左侧的规约!');
          return 0;
        }
        this.modal1 = true;
        this.loadInstructAll();
        this.checkedNames = [];
        for (let instruct of this.tabData) {
          this.checkedNames.push(instruct.instructId)
        }
      },
      ok() {
        this.$http(`/instructProtocolSet/add?protocolId=${this.addProtocolId}&instructIds=${this.checkedNames}`)
          .then(res => {
            if (res.data.status === 'success') {
              this.$Message.info('操作成功！');
            } else {
              this.$Message.info('操作失败！');
            }
            this.loadData(this.addProtocolId);
          })
      },
      cancel() {
        this.$Message.info('您取消了添加操作！');
        this.loadData(this.addProtocolId);
      },
      select() {
        if (this.addProtocolId === '') {
          this.$Message.info("请在左侧选择规约！");
        }
        else if (this.comment_content == null || this.comment_content === '') {
          this.$Message.info("请输入查询内容！");
          this.loadData();
        }
        else {
          this.$http(`/instruct/findSimilar?instructName=${this.comment_content}&modelId=0&protocolId=${this.addProtocolId}`)
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
            this.$http(`/instructProtocolSet/deleteByProtocolIdAndInstructId?protocolId=${this.addProtocolId}&instructId=${row.instructId}`)
              .then(res => {
                if (res.data.status == 'success') {
                  this.loadData(this.addProtocolId);
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
    },
    created: function () {	//页面创建前
      this.loadTree();
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
    background: #95d8ff;
    padding-left: 10px;
    margin-left: 1px;
  }

  .tools_top1 {
    height: 30px;
    vertical-align: middle;
    padding-top: 5px;
    background: #95d8ff;
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

  .summary{
    background:  #DBEFFA;
    height: 30px;
    line-height: 30px;
    border: 0px;
  }

  .summary:hover {
    background: #95d8ff;
  }

  .checkbox{
    width: 100%;
    height: 25px;
    line-height: 30px;
    padding: 0px 10px;
  }
  .checkbox:hover{
    background:  #DBEFFA;
  }

  .radio {
    padding: 0px 0px 0px 10px;
    height: 35px;
    line-height: 35px;
    width: 100%;
    margin-right: 0px;
    font-size: 13px;
    text-align: left;
  }
  .radio:hover {
    background:  #DBEFFA;
  }
</style>
