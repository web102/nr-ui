<template>
  <Col span="20">
    <div class="content_right">
      <div class="content_title">{{title}}</div>
      <!-- 主体内容 -->
      <div class="content_main">
        <div class="tools_top">
          <Row>
            <Col span="8">
              <label for="comment_content">指令名称:</label>
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
        <div class="tab_content" v-if="show">
          <Table class="tab" :columns="columns" :data="tabData" ellipsis border :height="tableHeight" highlight-row></Table>
        </div>
      </div>
    </div>
    <Modal v-model="modal1" width="560px"
           @on-ok="ok"
           @on-cancel="cancel">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>指令信息</span>
      </p>
      <div style="text-align:center;">
        <Form ref="formInline" :model="instruct" :label-width="80" inline>
          <FormItem label="指令名称">
            <Input v-model="instruct.instructName" style="width:400px;"/>
          </FormItem>
          <FormItem label="指令类型">
            <Input v-model="instruct.instructType" style="width:400px"/>
          </FormItem>
          <FormItem label="指令标识">
            <Input v-model="instruct.instructPath" style="width:400px"/>
          </FormItem>
          <FormItem label="指令结构">
            <Select v-model="instruct.instructFrame"  style="width:400px">
              <Option :value="k" v-for="(v,k) in selectInstructFrame" :key="k">
                {{v}}
              </Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </Col>
</template>
<script>
  export default {
    data() {
      return {
        show:true,
        selectInstructFrame:{"0":"无参数/最早","1":"某时刻","3":"选定时间","10":"最早选定地址","11":"某时刻选定地址","12":"选定时间选定地址","13":"选定时间选定地址 日/月"},
        instruct: {
          instructName: '',
          instructType: '',
          instructPath: '',
          instructFrame: '',
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
            title: '指令名称',
            key: 'instructName',
            align: 'left',
            width: 500,
            ellipsis: true
          },
          {
            title: '指令类型',
            key: 'instructType',
            width: 90,
            align: 'center',
            ellipsis: true
          },
          {
            title: '指令标识',
            key: 'instructPath',
            width: 80,
            align: 'center',
            ellipsis: true
          },{
            title: '指令结构',
            key: 'instructFrame',
            width: 90,
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
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.instruct = params.row;
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
      }
    },
    props: ['tableHeight'],

    methods: {
      loadData() {
        this.show = false;
        this.tabData=[];
        this.$http(`/instruct/instructSortByType`)
          .then(res => {
            if (res.data.status === 'success') {
              var map = res.data.results;
              for (var key in map) {
                this.tabData.push.apply(this.tabData,map[key]);
              }
              this.show = true;
            }
          })
      },
      select() {
        if (this.comment_content == null || this.comment_content === '') {
          this.loadData();
          this.$Message.info("请输入查询内容！");
        }
        else {
          this.$http(`/instruct/findSimilar?instructName=${this.comment_content}&modelId=0&protocolId=0`)
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
        this.instruct = {
          instructName: '',
          instructType: '',
          instructPath: '',
        }
      },
      ok() {
        if (this.instruct.instructName === '' || this.instruct.instructType === ''||this.instruct.instructType==='') {
          this.$Message.info("请完善信息！")
        } else {
          var url = `/instruct/save`;
          this.$http(url, {params: this.instruct})
            .then(res => {
              if (res.data.status === 'success') {
                this.$Message.info('操作成功！');
              } else {
                this.$Message.info('操作失败！');
              }
            })
        }
      },
      cancel() {
        this.$Message.info('您取消了添加操作！');
      },
      delete(row) {
        this.$Modal.confirm({
          title: "确认删除该条目",
          content: "执行删除操作之后，可能影响系统功能，请谨慎操作！",
          onOk: () => {
            this.$http(`/instruct/delete?id=${row.instructId}`)
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

    created: function () {
      this.loadData()
      if (this.$route.query.title == null) {
        this.title = '指令管理';
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
