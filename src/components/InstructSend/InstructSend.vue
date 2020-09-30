<template xmlns:Checkbox="http://www.w3.org/1999/html">
  <Col span="20">
    <div class="content_right">
      <div class="content_title">{{title}}</div>
      <!-- 主体内容 -->
      <div class="content_main">
        <div class="tab_content" style="background-color:#fff">
          <Row>
            <Col span="19" push="5" style="background-color: #C9C9C9; ">
              <div class="tools_top">
                <Row style="height: 30px">
                  <Col span="3">
                    <Input type="text" id="startAddr" size="small" style="width: 100%" v-model="startAddr"
                           placeholder="开始点号"/>
                  </Col>
                  <Col span="3">
                    <Input type="text" id="endAddr" size="small" style="width: 100%" :value="endAddr"
                           placeholder="结束点号"/>
                  </Col>
                  <Col span="5" align="right">
                    <DatePicker type="datetime" size="small" placeholder="选择开始时间" @on-change="getStart"
                                style="width: 90%"></DatePicker>
                  </Col>
                  <Col span="5" align="left">
                    <DatePicker type="datetime" size="small" placeholder="选择结束时间" @on-change="getEnd"
                                style="width: 90%"></DatePicker>
                  </Col>
                  <Col span="4">
                    <Select v-model="networkId" placeholder="选择网络:" size="small" style="width:100%">
                      <Option :value="network.channelId" v-for="(network,index) in networks" :key="index">
                        {{network.channelName}}
                      </Option>
                    </Select>
                  </Col>
                </Row>
                <Row style="height: 30px">
                  <Col span="17" align="left">
                    <Select v-model="instructId" placeholder="选择指令:" size="small" style="width:100%">
                      <Option :value="ins.instructId" v-for="(ins,index) in instructs" :key="index">
                        {{ins.instructPath}}:{{ins.instructName}}
                      </Option>
                    </Select>
                  </Col>
                  <Col span="3" align="right">
                    <div class="tools_search" @click="sendButton()">下发</div>
                  </Col>
                </Row>
              </div>
              <Tabs class="massage_panel"
                    style="background-color:#fff;margin-left: 1px;border-bottom:1px solid  rgb(201, 201, 201);">
                <TabPane label="报文监测" icon="ios-monitor-outline" style="color: black">
                  <!--<Button type="primary" icon="printer" style="position:fixed;left: 68%;margin-top:-50px;"-->
                  <!--v-on:click="stop()" v-if="isConnect">停止-->
                  <!--</Button>-->
                  <Button type="primary" icon="printer" style="position:fixed;left: 78%;margin-top:-50px;"
                          v-if="hexMsg!=''"
                          v-on:click="pdfReport(hexMsg)">导出
                  </Button>
                  <Button type="primary" icon="ios-download-outline" style="position:fixed;left: 88%;margin-top:-50px;"
                          v-if="hexMsg!=''"
                          @click="hexMsg = []">清除
                  </Button>
                  <div id="hex" class="overflowY">
                    <p align="left" v-for="(msg,index) in hexMsg" :key="index">{{msg}}</p>
                  </div>
                </TabPane>

                <TabPane label="报文解析" icon="clipboard" style="color: black">
                  <Button type="primary" icon="ios-download-outline" style="position:fixed;left: 175%;margin-top:-50px;"
                          v-if="expMsg!=''"
                          @click="pdfReport(expMsg)">导出
                  </Button>
                  <Button type="primary" icon="ios-download-outline" style="position:fixed;left: 185%;margin-top:-50px;"
                          v-if="expMsg!=''"
                          @click="expMsg = []">清除
                  </Button>
                  <div id="hex1" class="overflowY" style="color: black;font-style: revert">
                    <div v-for="(msg,index) in expMsg" :key="index">
                      <div v-for="(msgn,index1) in (msg.split('\n'))">
                        <p align="left" v-if="index1!=0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{msgn}}</p>
                        <p align="left" v-if="index1==0">{{msgn}}</p>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col span="5" pull="19" style="border-bottom: 1px solid darkgrey;">
              <div class="tools_top1" align="center">终端</div>
              <!--<Tree :data="tree"   @on-check-change="choiceAll" ref="tree4" show-checkbox align="left"></Tree>-->
              <RadioGroup v-model="ertuId" style="width: 100%;" @on-change="choiceRadio">
                <div v-for="(rad,index) in tree" :key="index">
                  <Menu style="width: 100%;height: 100%;">
                    <Submenu name="1">
                      <template slot="title">
                        <Radio :label="rad.id" class="radio">{{rad.title}}</Radio>
                      </template>
                      <CheckboxGroup v-model="checkboxValue" @on-change="choiceCheckbox">
                        <div v-for="(data,index) in rad.children" :key="index">
                          <MenuItem name="1-1" style="line-height: 0px;padding: 0px 0px;color:black;border: 0px">
                            <Checkbox :label="JSON.stringify(data)" class="checkbox">{{data.title}}</Checkbox>
                          </MenuItem>
                        </div>
                      </CheckboxGroup>
                    </Submenu>
                  </Menu>
                </div>
              </RadioGroup>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </Col>
</template>
<script>

  export default {
    created: function () {
      this.loadTree();
      if (this.$route.query.title == null) {
        this.title = '指令下发';
      } else {
        this.title = this.$route.query.title;
      }
    },


    data() {
      return {
        checkboxValue: [],
        htmlTitle: '页面导出PDF文件名',
        tree: [],
        instructs: [],
        networks: [],
        massages: [],
        startAddr: null,
        endAddr: null,
        startDateTime: null,
        endDateTime: null,
        ertuId: null,
        instructId: null,
        networkId: null,
        tempMsg: [],
        hexMsg: [],
        expMsg: [],
        loading: true,
        title: '',
        taskParam: null,
        modal1: false,
        ws: null,
        wsIsConnect: false,
      }
    },

    methods: {
      objTList(obj) {
        var list = [];
        list.push(obj);
        return list;
      },
      openTimer() {
        this.timer = setInterval(() => {
          if (this.tempMsg.length >= 0) {
            this.tempMsg.forEach((msg) => {
              if (msg.code == 1) {
                this.hexMsg.push(msg.message + "下行：" + msg.infoHex);
                this.expMsg.push(msg.message + "下行：" + msg.infoExplain.replace(/-n/g, "\n"));
              } else if (msg.code == 2) {
                this.hexMsg.push(msg.message + "上行：" + msg.infoHex);
                this.expMsg.push(msg.message + "上行：" + msg.infoExplain.replace(/-n/g, "\n"));
              } else if (msg.code <= 0) {
                this.hexMsg.push(msg.message);
              } else if (msg.code == 3) {
                this.hexMsg.push(msg.message);
                this.wsIsConnect = false;
                clearInterval(this.timer);
                this.timer = null
              }
            })
          }
          this.tempMsg = []
        }, 100)
      },

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
              if (this.instructs.length == 0) {
                this.$Modal.confirm({
                  title: "提示",
                  content: "此规约还没有配置指令，请先到 规约管理>规约管理 栏 点击‘指令’按钮进制配置指令！",
                });
              }
            } else {
              this.$Message.info("指令加载失败！");
            }
          });
      },
      loadNetworks(ertuId) {
        this.networkId = null;
        this.networks = [];
        this.$http(`/network/findNetworkByErtuId?ertuId=${ertuId}`)
          .then(res => {
            if (res.data.status === 'success') {
              this.networks = res.data.results;
              if (this.networks.length == 0) {
                this.$Modal.confirm({
                  title: "提示",
                  content: "此终端还没有添加网络，请先到 设备管理>网络管理 栏 点击‘添加’按钮进制添加网络！",
                });
                return true;
              } else {
                return false;
              }
            } else {
              this.$Message.info("网络网络加载失败！");
            }
          });
      },
      loadProtocol(protocolId) {
        this.$http(`/protocol/findOne?id=${protocolId}`)
          .then(res => {
            if (res.data.status == 'success') {
              this.protocol = res.data.results;
            }
          })
      },
      setMark(listTree) {
        this.checkboxValue = [];
        this.startAddr = 0;
        this.endAddr = 0;
        listTree.forEach(node => {
          this.checkboxValue.push(JSON.stringify(node));
          if (this.startAddr == 0 && this.endAddr == 0) {
            this.startAddr = node.modelId;
            this.endAddr = node.modelId + 3;
          } else {
            if (node.modelId < this.startAddr) {
              this.startAddr = node.modelId;
            }
            if (node.modelId + 3 > this.endAddr) {
              this.endAddr = node.modelId + 3;
            }
          }
        });
      },


      choiceRadio: function (ertuId) {
        var data;
        this.tree.forEach(node => {
          if (node.id == ertuId) {
            data = node;
          }
        });

        this.loadProtocol(data.modelId);
        this.loadInstructs(data.modelId);
        this.loadNetworks(this.ertuId);


        this.setMark(data.children);
        // var meterTree = this.$refs.tree4.getCheckedNodes();
      },
      choiceCheckbox(meterTrees) {
        if (this.ertuId == null) {
          this.ertuId = JSON.parse(node).rootId;
        }
        var meters = [];
        meterTrees.forEach(node => {
          node = JSON.parse(node);
          if (node.rootId == this.ertuId) {
            meters.push(node);
          }
        });
        this.setMark(meters);
      },

      sendButton() {
        if (this.ertuId == null) {
          this.$Message.info("请在左侧勾选终端和电表！");
          return 0;
        } else if (this.instructId == null) {
          this.$Message.info("请先选择指令！");
          return 0;
        } else if (this.networkId == null) {
          this.$Message.info("请先选择网络！");
          return 0;
        }

        if (this.wsIsConnect) {
          this.$Modal.confirm({
            title: "断开单前发送数据！",
            content: "正在交互中，断开后可能会引起错误！",
            onOk: () => {
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
      },
      start() {
        this.openTimer();
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
          startMark: this.startAddr,
          endMark: this.endAddr,
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
        console.log("startAddr:" + obj.startAddr + ",endAddr:" + obj.endAddr);
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

        this.ws = new WebSocket("ws://localhost:9090/websocket");
        // 建立 web socket 连接成功触发事件
        this.ws.onopen = function (evt) {
          that.hexMsg.push("连接成功！");
          that.wsIsConnect = true;
          if (obj !== '') {
            that.ws.send(obj);
          }
        };
        // 接收服务端数据时触发事件
        this.ws.onmessage = function (evt) {
          that.tempMsg.push(JSON.parse(evt.data))
        };

        // 断开 web socket 关闭触发事件
        this.ws.onclose = function (evt) {
          that.wsIsConnect = false;
          // var msg = {
          //   code: 3,
          //   message: "连接关闭",
          //   infoHex: "",
          //   infoExplain: "",
          // };
          // that.tempMsg.push(msg)
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

  .overflowY {
    overflow-y: scroll;
    position: absolute;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    align-content: left;
    height: calc(100vh - 235px);
  }

  .radio {
    padding: 0px 0px 0px 10px;
    height: 35px;
    line-height: 35px;
    width: 80%;
    z-index: 0;
    margin-right: 0px;
    font-size: 13px;
    text-align: left;
    background: #DBEFFA;
  }

  .radio:hover {
    background: rgb(201, 201, 201);
  }

  .checkbox {
    padding: 0px 20px;
    line-height: 30px;
    height: 30px;
    width: 80%;
  }

</style>

<style scoped>

  /*菜单的外层*/
  li >>> .ivu-menu-submenu-title {
    width: 100%;
    padding: 0px 0px;
    position: relative;
    cursor: pointer;
    z-index: 0;
    transition: all .0s;
    text-align: left;
    background: #DBEFFA;
  }

  /*菜单的外层 > 符号*/
  li >>> .ivu-menu-submenu-title-icon {
    width: 20%;
    position: absolute;
    text-align: center;
    line-height: 35px;
    margin-right: 0px;
    top: 0px;
  }

  /*菜单栏 2级*/
  li >>> .ivu-checkbox-wrapper {
    margin-right: 0px;
    text-align: left;
  }

  /*单选框 的 单选框图标*/
  label >>> .ivu-radio-input {
    z-index: 0;
  }
</style>
