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
                <Row style="height: 30px">
                  <Col span="3">
                    <Input type="text" id="startMark" size="small"style="width: 120px" v-model="startMark" placeholder="开始地址"/>
                  </Col>
                  <Col span="4">
                    <Input type="text" id="endMark" size="small" style="width: 120px" v-model="endMark" placeholder="开始地址"/>
                  </Col>
                  <Col span="4">
                    <DatePicker type="datetime" size="small" placeholder="选择开始时间" @on-change="getStart"
                                style="width: 160px"></DatePicker>
                  </Col>
                  <Col span="4">
                    <DatePicker type="datetime" size="small" placeholder="选择结束时间" @on-change="getEnd"
                                style="width: 160px"></DatePicker>
                  </Col>
                  <Col span="4">
                    <Select v-model="networkId" placeholder="选择通道:" size="small" style="width:120px">
                      <Option :value="network.channelId" v-for="(network,index) in networks" :key="index">
                        {{network.channelName}}
                      </Option>
                    </Select>
                  </Col>
                </Row>
                <Row style="height: 30px">
                  <Col span="20" >
                    <Select v-model="instructId" placeholder="选着指令:" size="small" style="width:700px">
                      <Option :value="ins.instructId" v-for="(ins,index) in instructs" :key="index">
                        {{ins.instructPath}}:{{ins.instructName}}
                      </Option>
                    </Select>
                  </Col>
                  <Col span="3">
                    <div class="tools_search" @click="sendButton()">下发</div>
                  </Col>
                </Row>
              </div>
              <Tabs style="background-color:#fff;margin-left: 1px;">
                <TabPane id="pdfDom" label="报文监测" icon="ios-monitor-outline">
                  <!--<Button type="primary" icon="printer" style="position:fixed;left: 68%;margin-top:-50px;"-->
                          <!--v-on:click="stop()" v-if="isConnect">停止-->
                  <!--</Button>-->
                  <Button type="primary" icon="printer" style="position:fixed;left: 78%;margin-top:-50px;" v-if="hexMsg!=''"
                          v-on:click="pdfReport(hexMsg)">导出
                  </Button>
                  <Button type="primary" icon="ios-download-outline" style="position:fixed;left: 88%;margin-top:-50px;" v-if="hexMsg!=''"
                          @click="cleanMeg()">清除
                  </Button>
                  <div id="hex" style="overflow-y:scroll; width:100%; height:400px; align-content: left">
                    <p align="left" v-for="(msg,index) in hexMsg" :key="index">{{msg}}</p>
                  </div>
                </TabPane>

                <TabPane id="pdfDom1" label="报文解析" icon="clipboard">
                  <Button type="primary" icon="ios-download-outline" style="position:fixed;left: 175%;margin-top:-50px;" v-if="expMsg!=''"
                          @click="pdfReport(expMsg)">导出
                  </Button>
                  <Button type="primary" icon="ios-download-outline" style="position:fixed;left: 185%;margin-top:-50px;" v-if="expMsg!=''"
                          @click="cleanMeg1()">清除
                  </Button>
                  <div id="hex1" style="overflow-y:scroll; width:100%; height:400px; align-content: left">
                    <span align="left" v-for="(msg,index) in expMsg" :key="index">
                      <div v-for="(msgn,index1) in (msg.split('\n'))">
                        <span v-if="index1!==0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {{msgn}}</div>
                    </span>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col span="5" pull="19">
              <div class="tools_top1">终端</div>
              <Tree :data="tree" @on-check-change="choiceAll" ref="tree4" show-checkbox align="left"></Tree>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </Col>
</template>
<script>
  export default {
    data() {
      return {
        htmlTitle: '页面导出PDF文件名',
        isConnect: false,
        tree: [],
        instructs: [],
        networks: [],
        massages: [],
        startMark: null,
        endMark: null,
        startDateTime: null,
        endDateTime: null,
        ertuId: null,
        instructId: null,
        networkId: null,

        msg: {
          code: "",
          message: "",
          infoHex: "",
          infoExplain: "",
        },
        hexMsg: [],
        expMsg: [],

        loading: true,
        title: '',
        taskParam: null,
        modal1: false,
        ws: null,
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
        this.$http(`/ertu/ertuMeterTree?idIsNull=false`)
          .then(res => {
            if (res.data.status === 'success') {
              this.tree = res.data.results.children;
            }
          });
      },
      loadInstructs(protocol) {
        this.instructId = null;
        this.instructs = [];
        this.$http(`/instructProtocolSet/protocolInstruct?protocolId=${protocol}`)
          .then(res => {
            if (res.data.status === 'success') {
              this.instructs = res.data.results;
            } else {
              this.$Message.info("指令加载失败！");
            }
          });
      },
      loadNetworks(ertuId) {
        this.network = null;
        this.networks = [];
        this.$http(`/network/findNetworkByErtuId?ertuId=${ertuId}`)
          .then(res => {
            if (res.data.status === 'success') {
              this.networks = res.data.results;
            } else {
              this.$Message.info("网络通道加载失败！");
            }
          });
      },
      findProtocol(protocolId) {
        this.$http(`/protocol/findOne?id=${protocolId}`)
          .then(res => {
            if (res.data.status == 'success') {
              this.protocol = res.data.results;
            }
          })
      },

      loadData() {
        this.$http(`/meter/getList`)
          .then(res => {
            if (res.data.status == 'success') {
              this.tabData = res.data.results;
            }
          })
      },
      choiceAll: function (data) {
        if (data[0] == null) {
          this.tabData = [];
          this.addProtocolId = '';
        } else {
          this.ertuId = data[0].id;
          this.addProtocolId = data[0].modelId;
          this.loadInstructs(this.addProtocolId);
          this.loadNetworks(this.ertuId);
          this.findProtocol(this.addProtocolId);


          var meterTree = this.$refs.tree4.getCheckedNodes();
          this.startMark = 0;
          this.endMark = 0;
          meterTree.forEach(node => {
            if (node.children == null) {
              if (this.startMark == 0 && this.endMark == 0) {
                this.startMark = node.modelId;
                this.endMark = node.modelId+3;
              } else {
                if (node.modelId < this.startMark) {
                  this.startMark = node.modelId;
                }
                if (node.modelId+3 > this.endMark) {
                  this.endMark = node.modelId+3;
                }
              }
            }
          });
        }
      },
      sendButton() {
        if (this.instructId == null) {
          this.$Message.info("请先选择指令！");
          return 0;
        } else if (this.networkId == null) {
          this.$Message.info("请先选择通道！");
          return 0;
        }

        if (this.isConnect) {
          this.$Modal.confirm({
            title: "断开单前发送数据！",
            content: "正在交互中，断开后可能会引起错误！",
            onOk: () => {
              this.socket("exit");
              this.start();
            },
            onCancel: () => {
              this.$Message.info('您取消了添加操作！');
              return;
            }
          });
        } else {
          this.start()
        }


        ;
      },
      start() {
        // var meterTree = this.$refs.tree4.getCheckedNodes();
        // var startMark = null;
        // var endMark = null;
        // meterTree.forEach(node => {
        //   if (node.children == null) {
        //     if (startMark == null && endMark == null) {
        //       startMark = node.modelId;
        //       endMark = node.modelId;
        //     } else {
        //       if (node.id < startMark) {
        //         startMark = node.modelId;
        //       }
        //       if (node.id > endMark) {
        //         endMark = node.modelId;
        //       }
        //     }
        //   }
        // });

        var instruct = {};
        this.instructs.forEach((nw) => {
          if (nw.instructId === this.instructId) {
            instruct = nw;
          }
        });

        var network = {};
        this.networks.forEach((nw) => {
          if (nw.channelId === this.networkId) {
            network = nw;
          }
        });
        var obj = {
          startMark: this.startMark,
          endMark: this.endMark,
          startDate: this.startDateTime,
          endDate: this.endDateTime,
          restPath: this.protocol.restPath,
          taskType: instruct.instructPath,
          ipAddress: network.ipAddress,
          ipPort: network.ipPort,
          channel: null,
          red: 0,
        };
        //调用web接口
        this.socket(JSON.stringify(obj));
        console.log("startMark:" + obj.startMark + ",endMark:" + obj.endMark);
      },
      cleanMeg() {
        this.hexMsg = [];
      },
      cleanMeg1() {
        this.expMsg = [];
      },


      getStart(date) {
        this.startDateTime = date;
      },
      getEnd(date) {
        this.endDateTime = date;
      },

      // websocket服务
      socket(obj) {
        var that = this;
        // 初始化一个 WebSocket 对象
        that.ws = new WebSocket("ws://localhost:9090/websocket");
        // 建立 web socket 连接成功触发事件
        that.ws.onopen = function (evt) {
          that.hexMsg.push("连接成功！");
          that.isConnect = true;
          if (obj !== '') {
            that.ws.send(obj);
          }
        };
        // 接收服务端数据时触发事件
        that.ws.onmessage = function (evt) {
          that.msg = JSON.parse(evt.data);
          if (that.msg.code == 1) {
            that.hexMsg.push("下行：" + that.msg.infoHex);
            that.expMsg.push("下行：" + that.msg.infoExplain.replace(/-n/g, "\n"));
          } else if (that.msg.code == 2) {
            that.hexMsg.push("上行：" + that.msg.infoHex);
            that.expMsg.push("上行：" + that.msg.infoExplain.replace(/-n/g, "\n"));
          } else if (that.msg.code <0||that.msg.code==3) {
            that.hexMsg.push(that.msg.message);
            that.ws.close();
          }
        };

        // 断开 web socket 连接成功触发事件
        that.ws.onclose = function (event) {
          that.hexMsg.push("连接关闭!");
          that.isConnect = false;
        };
      },
      pdfReport(massage) {
        var obj = {
          "msg": massage
        }
        this.$http(`/pdf/pdfReport`, {params: obj})
          .then(res => {
            if (res.data.status === 'success') {
              this.$Message.info("导出成功！");
            }
          });
      },
    },

    created: function () {
      this.loadTree();
      if (this.$route.query.title == null) {
        this.title = '指令下发';
      } else {
        this.title = this.$route.query.title;
      }
    },
    destroyed: function () {
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
    height: 65px;
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
