<template>
  <div class="order-customer tx-container">
    <div class="tx-form-search">
      <Form ref="formSearch" :model="formSearch" :label-width="65" inline style="max-width: 1300px">
        <FormItem label="关键字">
          <Input v-model="formSearch.keyWord" placeholder="订单、昵称、设计师、手机号"></Input>
        </FormItem>
        <FormItem label="订单级别">
          <Select v-model="formSearch.orderGrade" clearable placeholder="全部">
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
            <Option value="D">D</Option>
          </Select>
        </FormItem>
        <FormItem label="流程节点">
          <Select v-model="formSearch.node" clearable placeholder="全部">
            <Option value="1">订单生成</Option>
            <Option value="2">预约到店</Option>
            <Option value="3">生成工艺单</Option>
            <Option value="4">工厂生产</Option>
            <Option value="5">生产完成</Option>
          </Select>
        </FormItem>
        <FormItem label="订单金额">
          <Row>
            <Col span="11">
            <Input v-model="formSearch.minPrice" placeholder="最大值"></Input>
            </Col>
            <Col span="2" style="text-align: center">
            ~</Col>
            <Col span="11">
            <Input v-model="formSearch.maxPrice" placeholder="最小值"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="性别标签">
          <Select v-model="formSearch.firstCategoryId" clearable placeholder="全部">
            <Option v-for="item in tagList" v-if="item.tagType == 1" :key="item.tagId" :value="item.tagId">
              {{item.tagName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="款式标签">
          <Select v-model="formSearch.secondCategoryId" clearable placeholder="全部">
            <Option v-for="item in tagList" v-if="item.tagType == 2" :key="item.tagId" :value="item.tagId">
              {{item.tagName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="季节标签">
          <Select v-model="formSearch.thirdCategoryId" clearable placeholder="全部">
            <Option v-for="item in tagList" v-if="item.tagType == 3" :key="item.tagId" :value="item.tagId">
              {{item.tagName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间">
          <!--<Row>
            <Col span="11">
            <DatePicker type="date" placeholder="开始时间" v-model="formSearch.startDate"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">
            -</Col>
            <Col span="11">
            <DatePicker type="date" placeholder="截至时间" v-model="formSearch.endDate"></DatePicker>
            </Col>
          </Row>-->

          <DatePicker type="daterange" v-model="formSearch.time" confirm placement="bottom-end" placeholder="选择时间范围"
                      style="width: 240px"></DatePicker>
        </FormItem>
        <FormItem label="处理状态">
          <Select v-model="formSearch.status" clearable placeholder="全部">
            <Option value="0">待处理</Option>
            <Option value="3">待分配</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getOrderList(1)">查询</Button>
          <Button type="ghost" style="margin-left: 8px" @click="handleReset()">重置</Button>
          <Button type="info" style="margin-left: 8px" @click="showExportData">
            <Icon type="ios-download-outline" style="font-size: 14px"></Icon>
            导出数据
          </Button>
        </FormItem>
      </Form>
    </div>

    <Table border ref="orderTable" :loading="listLoading" :columns="orderListTitle" :data="order.data"
           style="margin-top: 20px"></Table>

    <div style="text-align: right;width: 100%;margin-top: 30px">
      <Page :total="order.totalSize" :current="formSearch.page + 1" show-total show-elevator show-sizer placement="top"
            @on-change="getOrderList"
            @on-page-size-change="changePageSize"></Page>
    </div>


    <Modal
      title="分配订单"
      v-model="modelAllot"
      :width="720"
      class="model-allot"
      :styles="{top: '20px'}"
      :mask-closable="false">
      <Form :model="formAllot" :label-width="90"
            v-if="orderTagItem.systemTags && orderTagItem.pictureInfo && orderTagItem.commonTags">
        <Row>
          <Col span="12">
          <FormItem label="订单编号：">{{orderItem.orderNo}}</FormItem>
          </Col>
          <Col span="12">
          <FormItem label="下单时间：">{{orderItem.createDateStr}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="用户名称：">{{orderItem.customerName}}</FormItem>
          </Col>
          <Col span="12">
          <FormItem label="手机号码：">{{orderItem.customerPhone}}</FormItem>
          </Col>
        </Row>
        <FormItem label="需求内容：">{{orderTagItem.pictureInfo.description}}</FormItem>
        <FormItem label="参考图片：">
          <span v-for="item in orderTagItem.pictureInfo.new_pictures" style="margin-right: 5px">
            <v-image :src="item" :width="66" :height="88"></v-image>
          </span>
        </FormItem>


        <v-system-tag ref="systemTag"
                      :sex-tag="formAllot.sexTagId"
                      :style-tag="formAllot.styleTagId"
                      :season-tag="formAllot.seasonTagId"></v-system-tag>

        <v-add-tag ref="addTag" :data-list="orderTagItem.pictureInfo.commonList"></v-add-tag>

        <FormItem label="添加备注：" prop="desc">
          <Row>
            <Col span="20">
            <Input v-model="formAllot.assignComment" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请填写备注"></Input>
            </Col>
          </Row>
        </FormItem>

        <v-allot-designer ref="allotDesigner" :designer="selectDesigner"></v-allot-designer>
      </Form>

      <div slot="footer">
        <Button type="ghost" @click="modelAllot = false">取消</Button>
        <Button type="primary" @click="submitAllot()">保存</Button>
      </div>
      <Spin size="large" fix v-if="modelAllotLoading"></Spin>
    </Modal>

    <!--导出数据 弹窗-->
    <Modal v-model="exportModal.show">
      <p slot="header" style="text-align:center">
        <span>导出数据</span>
      </p>
      <Form :label-width="90" style="padding-right: 30px">
        <FormItem label="导出文件名称">
          <Input v-model="exportModal.name" placeholder="请填写导出文件名称"></Input>
        </FormItem>
        <FormItem label="导出数据规则">
          <Select v-model="exportModal.type">
            <Option :value="1">导出所有数据</Option>
            <Option :value="2">导出当前列表数据</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="exportModal.loading" @click="exportData()">确定
        </Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import VSystemTag from 'components/order/systemTag'
  import VAddTag from 'components/order/addTag'
  import VAllotDesigner from 'components/order/allotDesigner'
  import VImage from 'components/common/image'

  export default {
    name: 'order',
    components: {VSystemTag, VAddTag, VAllotDesigner, VImage},
    data() {
      return {
        listLoading: true,
        modelAllot: false,
        submitAllotLoading: false,
        modelAllotLoading: false,
        order: [],
        user: {},
        orderItem: {},
        orderTagItem: {},
        selectedTags: [],
        selectDesigner: {},
        formAllot: {
          sexTagId: '',
          styleTagId: '',
          seasonTagId: '',
          commonTags: '',
          assignComment: ''
        },
        exportModal: {show: false, name: '', loading: false, type: 1},
        tagList: [],
        formSearch: {
          keyWord: '',
          page: 0,
          pageLength: 10,
          orderGrade: '',
          firstCategoryId: '',
          secondCategoryId: '',
          thirdCategoryId: '',
          minPrice: '',
          maxPrice: '',
          startDate: '',
          endDate: '',
          node: '',
          status: '',
          time: []
        },
        orderListTitle: [],
        listTitle: [
          {
            title: '订单编号',
            key: 'orderNo',
            align: 'center',
          },
          {
            title: '用户昵称',
            align: 'center',
            key: 'customerName'
          },
          {
            title: '用户手机号',
            align: 'center',
            key: 'customerPhone'
          },
          {
            title: '设计师',
            align: 'center',
            key: 'designerName'
          },
          {
            title: '系统标签',
            align: 'center',
            key: '_systemTags',
            render: (h, params) => {
              let row = params.row;
              return `${row.genderTagName || ''}${row.genderTagName ? ' - ' : ''}${row.typeTagName || ''}${row.typeTagName ? ' - ' : ''}${row.seasonTagName || ''}`;
            }
          },
          {
            title: '标签',
            key: '_commonTags',
            align: 'center',
            render: (h, params) => {
              return params.row.commonTags ? params.row.commonTags.replace(/,/g, '/') : '-';
            }
          },
          {
            title: '原价',
            align: 'center',
            key: 'totalListPrice',
            render: (h, params) => {
              if (!Number(params.row.totalListPrice)) {
                return '-';
              }
              return '¥' + params.row.totalListPrice;
            }
          },
          {
            title: '优惠',
            align: 'center',
            key: 'discount',
            render: (h, params) => {
              if (!params.row.discount) {
                return '-';
              }
              params.row.discount = Number(params.row.discount);
              if (params.row.discount >= 1) {
                return '无优惠';
              }

              return `${(params.row.discount * 10).toFixed(2)}折`
            }
          },
          {
            title: '实际支付',
            align: 'center',
            key: 'totalAmount',
            render: (h, params) => {
              return params.row.totalAmount ? ('¥' + params.row.totalAmount) : '-';
            }
          },
          {
            title: '排号号码',
            align: 'center',
            type: 2,
            key: 'sortNo',
            render: (h, params) => {
              return params.row.sortNo || '-';
            }
          },
          {
            title: '订单金额',
            align: 'center',
            type: 2,
            key: 'totalAmount',
            render: (h, params) => {
              return params.row.totalAmount || '-';
            }
          },
          {
            title: '订单级别',
            align: 'center',
            key: 'orderGrade',
            render: (h, params) => {
              return params.row.orderGrade || '-';
            }
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createDateStr'
          },
          {
            title: '处理状态',
            align: 'center',
            key: '_operation',
            render: (h, params) => {
              if ((this.user.userType === 1 || this.user.userType === 3) && params.row.tacheId === 2 && !params.row.designerId) {
                return '待分配'
              } else {
                return params.row.operation === '2' ? '待处理' : '-';
              }
            }
          },
          {
            title: '流程节点',
            align: 'center',
            key: '_step',
            render: (h, params) => {
              return `${params.row.flowName} - ${params.row.tacheName}`
            }
          },
          {
            title: '操作',
            width: 150,
            align: 'center',
            render: (h, params) => {
              let btns = []
                , item = params.row;

              if ((this.user.userType === 1 || this.user.userType === 3) && item.tacheId === 2) {
                btns.push(this.createBtn(h, '分配', () => {
                  this.orderItem = item;
                  this.getOrderInfo(item.orderNo);
                }));
              }

              if (item.operation === '2') {
                item.designerId && btns.push(this.createBtn(h, '处理', () => {
                  this.$router.push({path: '/order/customer/detail', query: {id: item.orderNo, type: 1}});
                }));
              } else {
                btns.push(this.createBtn(h, '查看', () => {
                  this.$router.push({path: '/order/customer/detail', query: {id: item.orderNo}});
                }));
              }

              return h('div', btns);
            }
          }
        ]
      }
    },
    created() {
      let sessionSearch = this.$sessionStore.get('order_customer_search');

      this.user = this.$localStore.get('user') || {};

      if (!_.isEmpty(sessionSearch)) {
        this.formSearch = sessionSearch;
      }

      this.orderListTitle = _.filter(this.listTitle, val => {
        return val.type !== 2;
      });

      this.getOrderList();
      this.getTagList();
    },
    methods: {
      getOrderList(page){
        let params;
        if (_.isNumber(page)) {
          this.formSearch.page = page - 1;
        }

        params = _.clone(this.formSearch);

        if (params.time[0]) {
          params.startDate = this.$dateFormat(params.time[0], 'yyyy-mm-dd');
        }
        if (params.time[1]) {
          params.endDate = this.$dateFormat(params.time[1], 'yyyy-mm-dd');
        }
        params.keyWord = params.keyWord.trim();

        this.listLoading = true;
        this.ajax.post('/v3/store/order/getOrderInfoList', params)
          .then(data => {
            this.listLoading = false;
            this.order = data;
            this.$sessionStore.set('order_customer_search', params);
          });
      },
      getOrderInfo(id){
        this.modelAllot = true;
        this.modelAllotLoading = true;
        this.orderTagItem = {};
        this.ajax.post('/v3/store/order/getAssignOrderInfo', {orderNo: id})
          .then(data => {
            let designer;

            // 默认选中系统标签
            _.map(data.pictureInfo.systemList, val => {
              switch (val.type) {
                case 1:
                  this.formAllot.sexTagId = val.id;
                  break;
                case 2:
                  this.formAllot.styleTagId = val.id;
                  break;
                case 3:
                  this.formAllot.seasonTagId = val.id;
              }
            });
            this.selectedTags = _.pluck(data.pictureInfo.commonList, 'id');

            this.formAllot.assignComment = data.pictureInfo.assignComment;


            data.pictureInfo.new_pictures = data.pictureInfo.pictures.split(';');

            this.selectDesigner = {
              name: data.pictureInfo.designerName,
              photo: data.pictureInfo.designerPhoto,
              id: data.pictureInfo.designerId
            };

            this.orderTagItem = data;

            this.modelAllotLoading = false;
          });
      },
      getTagList(){
        this.ajax.get('/v3/store/tag/getSearchTagList').then(data => {
          this.tagList = data;
        });
      },
      submitAllot(){
        let designerAllot;

        if (!this.$refs.systemTag.validate()) return;
        if (!this.$refs.addTag.validate()) return;
        if (!this.$refs.allotDesigner.validate()) return;

        designerAllot = this.$refs.allotDesigner.getData();
        // 获取系统标签数据
        this.formAllot = _.extend(this.formAllot, this.$refs.systemTag.getData());

        this.formAllot.commonTags = this.$refs.addTag.getData(3).join('||');

        this.formAllot.designerId = designerAllot.id;
        this.formAllot.orderNo = this.orderItem.orderNo;

        return this.ajax.post('/v3/store/order/assignOrder', this.formAllot)
          .then(data => {
            this.$Message.success('分配成功！');
            this.getOrderList();
            this.modelAllot = false;
            this.modelAllotLoading = false;
          })
          .catch(() => {
            this.modelAllotLoading = false;
          });

      },
      changePageSize(len){
        this.formSearch.pageLength = len;
        this.formSearch.page = 0;
        this.getOrderList();
      },
      handleReset(){
        this.formSearch = this.$options.data().formSearch;
        this.getOrderList();
      },
      createBtn(render, label, callback){
        return render('Button', {
          props: {
            type: 'text',
            size: 'small'
          },
          on: {
            click: () => {
              callback && callback();
            }
          }
        }, label)
      },
      showExportData(){
        let date = []
          , storeName = this.$localStore.get('user').storeName;

        if (!storeName) {
          this.$Message.warning('门店获取失败，请重新登录后再次使用！');
        }

        this.exportModal.name = `${storeName}_客户订单报表`;

        /*if (this.formSearch.startDate) {
         date.push(this.$dateFormat(this.formSearch.startDate, 'yyyy-mm-dd'));
         }
         if (this.formSearch.endDate) {
         date.push(this.$dateFormat(this.formSearch.endDate, 'yyyy-mm-dd'));
         }*/

        /*if (!_.isEmpty(date)) {
         this.exportModal.name += '_' + date.join('~');
         }*/
        this.exportModal.name += '_' + this.$dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');

        this.exportModal.show = true;
      },
      exportData(){
        let params = _.clone(this.formSearch);
        params.page = 0;
        if (this.exportModal.type === 1) {
          params.pageLength = this.order.totalSize;
        }

        this.exportModal.loading = true;
        this.$Message.loading('请稍等，正在导出数据...');
        this.ajax.post('/v3/store/order/getOrderInfoList', params)
          .then(data => {
            let exData = []
              , columns = _.initial(this.listTitle);

            this.exportModal.loading = false;
            this.exportModal.show = false;

            exData = _.map(data.data, val => {
              val.orderNo = `#${val.orderNo}`;
              val._systemTags = `${val.genderTagName || ''}${val.genderTagName ? ' - ' : ''}${val.typeTagName || ''}${val.typeTagName ? ' - ' : ''}${val.seasonTagName || ''}`;
              val._commonTags = val.commonTags ? val.commonTags.replace(/,/g, '/') : '-';
              val._step = `${val.flowName} - ${val.tacheName}`;
              val.sortNo = val.sortNo || '';

              if ((this.user.userType === 1 || this.user.userType === 3) && val.tacheId === 2 && !val.designerId) {
                val._operation = '待分配'
              } else {
                val._operation = val.operation === '2' ? '待处理' : '-';
              }

              return val;
            });
            this.$refs.orderTable.exportCsv({
              filename: this.exportModal.name,
              columns: columns,
              data: exData,
              quoted: true
            });
          })
          .catch(() => {
            this.exportModal.loading = false;
          });
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .model-allot .ivu-form-item {
    margin-bottom: 10px;
  }

  .model-allot .designer-list {
    line-height: 20px;
    display: inline-block;
    margin-right: 15px;
    margin-top: 15px;
    text-align: center;
    cursor: pointer;
    opacity: .3;
  }

  .model-allot .designer-list.active {
    opacity: 1;
  }

  .model-allot .small-image {
    max-height: 88px;
    max-width: 66px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
