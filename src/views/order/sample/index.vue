<template>
  <div class="order-customer tx-container">
    <div class="tx-form-search">
      <Form ref="formSearch" :model="formSearch" :label-width="65" inline style="max-width: 1300px">
        <FormItem label="关键字">
          <Input v-model="formSearch.searchTerm" placeholder="订单、昵称、设计师、手机号"></Input>
        </FormItem>
        <FormItem label="性别标签">
          <Select v-model="formSearch.sexTagId" clearable placeholder="全部">
            <Option v-for="item in tagList" v-if="item.tagType == 1" :key="item.tagId" :value="item.tagId">
              {{item.tagName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="款式标签">
          <Select v-model="formSearch.styleTagId" clearable placeholder="全部">
            <Option v-for="item in tagList" v-if="item.tagType == 2" :key="item.tagId" :value="item.tagId">
              {{item.tagName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="季节标签">
          <Select v-model="formSearch.seasonTagId" clearable placeholder="全部">
            <Option v-for="item in tagList" v-if="item.tagType == 3" :key="item.tagId" :value="item.tagId">
              {{item.tagName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="处理状态">
          <Select v-model="formSearch.status" clearable placeholder="全部">
            <Option value="0">待处理</Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间">
          <!--<Row>
            <Col span="11">
            <DatePicker type="date" placeholder="开始时间" v-model="formSearch.startTime"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">
            -</Col>
            <Col span="11">
            <DatePicker type="date" placeholder="截至时间" v-model="formSearch.endTime"></DatePicker>
            </Col>
          </Row>-->

          <DatePicker type="daterange" v-model="formSearch.time" confirm placement="bottom-end" placeholder="选择时间范围"
                      style="width: 240px"></DatePicker>
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
        <FormItem>
          <Button type="primary" @click="getOrderList(1)">查询</Button>
          <Button type="ghost" style="margin-left: 8px" @click="handleReset()">重置</Button>
          <Button type="success" style="margin-left: 8px" @click="$router.push({path: '/order/sample/detail/edit'})">
            添加样衣单
          </Button>
        </FormItem>
      </Form>
    </div>

    <Table border ref="orderTable" :loading="listLoading" :columns="listTitle" :data="order.data"
           style="margin-top: 20px"></Table>

    <div style="text-align: right;width: 100%;margin-top: 30px">
      <Page :total="order.totalSize" :current="formSearch.page + 1" show-total show-elevator show-sizer placement="top"
            @on-change="getOrderList"
            @on-page-size-change="changePageSize"></Page>
    </div>

  </div>
</template>

<script>
  import VSystemTag from 'components/order/systemTag'
  import VAddTag from 'components/order/addTag'
  import VImage from 'components/common/image'

  export default {
    name: 'order',
    components: {VSystemTag, VAddTag, VImage},
    data() {
      return {
        listLoading: true,
        order: [],
        user: {},
        tagList: [],
        formSearch: {
          searchTerm: '',
          page: 0,
          pageLength: 10,
          sexTagId: '',
          styleTagId: '',
          seasonTagId: '',
          minPrice: '',
          maxPrice: '',
          startTime: '',
          endTime: '',
          status: '',
          time: []
        },
        listTitle: [
          {
            title: '订单编号',
            key: 'sampleNo',
            align: 'center',
          },
          {
            title: '系统标签',
            align: 'center',
            render: (h, params) => {
              let row = params.row;
              return `${row.genderName || ''}${row.genderName ? ' - ' : ''}${row.styleName || ''}${row.styleName ? ' - ' : ''}${row.seasonName || ''}`;
            }
          },
          {
            title: '自定义标签',
            align: 'center',
            render: (h, params) => {
              return params.row.tagsName ? params.row.tagsName.replace(/,/g, '/') : '-';
            }
          },
          {
            title: '订单金额',
            align: 'center',
            render: (h, params) => {
              return params.row.price || '-';
            }
          },
          {
            title: '订单级别',
            align: 'center',
            render: () => {
              return 'D';
            }
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createTimeStr'
          },
          {
            title: '处理状态',
            align: 'center',
            render: (h, params) => {
              if ((this.user.userType === 1 || this.user.userType === 3) && params.row.tacheId === 2 && !params.row.designerId) {
                return '待分配'
              } else {
                return params.row.operation === '2' ? '待处理' : '-';
              }
            }
          },
          {
            title: '操作',
            width: 150,
            align: 'center',
            render: (h, params) => {
              let btns = []
                , item = params.row;

              if (item.operation === '2') {
                item.designerId && btns.push(this.createBtn(h, '处理', () => {
                  this.$router.push({path: '/order/sample/detail', query: {id: item.id, type: 1}});
                }));
              } else {
                btns.push(this.createBtn(h, '查看', () => {
                  this.$router.push({path: '/order/sample/detail', query: {id: item.id}});
                }));
              }

              return h('div', btns);
            }
          }
        ]
      }
    },
    created() {
      let sessionSearch = this.$sessionStore.get('order_sample_search');

      this.user = this.$localStore.get('user') || {};

      if (!_.isEmpty(sessionSearch)) {
        this.formSearch = sessionSearch;
      }

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

        if(params.time[0]){
          params.startTime = this.$dateFormat(params.time[0], 'yyyy-mm-dd');
        }
        if(params.time[1]){
          params.endTime = this.$dateFormat(params.time[1], 'yyyy-mm-dd');
        }

        params.searchTerm = params.searchTerm.trim();
        this.listLoading = true;
        this.ajax.post('/v3/store/sampleOrder/findList', params)
          .then(data => {
            this.listLoading = false;
            data.data = data.data || [];
            this.order = data;
            this.$sessionStore.set('order_sample_search', params);
          });
      },
      getTagList(){
        this.ajax.get('/v3/store/tag/getSearchTagList').then(data => {
          this.tagList = data;
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
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
