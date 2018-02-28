<template>
  <div class="tx-container new-detail">
    <div class="tx-form-search">
      <Form :label-width="75" inline>
        <FormItem label="关键字">
          <Input placeholder="搜索资讯编号/标签/设计师名字/标签" v-model="searchParam.tag"></Input>
        </FormItem>
        <FormItem label="性别标签">
          <Select placeholder="全部" v-model="searchParam.firstCategoryId" clearable>
            <template v-for="(item,index) in systemSex">
              <Option :value="item.tagId">{{item.tagName}}</Option>
            </template>
          </Select>
        </FormItem>
        <FormItem label="季节标签">
          <Select placeholder="全部" v-model="searchParam.secondCategoryId" clearable>
            <template v-for="(item,index) in systemSeason">
              <Option :value="item.tagId">{{item.tagName}}</Option>
            </template>
          </Select>
        </FormItem>
        <FormItem label="款式标签">
          <Select placeholder="全部" v-model="searchParam.thirdCategoryId" clearable>
            <template v-for="(item,index) in systemStyle">
              <Option :value="item.tagId">{{item.tagName}}</Option>
            </template>
          </Select>
        </FormItem>
        <FormItem label="审核状态">
          <Select placeholder="全部" v-model="searchParam.status" clearable>
            <Option :value="1">待审核</Option>
            <Option :value="2">已通过</Option>
            <Option :value="3">未通过</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="newList()">查询</Button>
          <Button type="ghost" @click="handleReset('searchParam')">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div>
      <div style="padding: 10px 0;">
        <Button @click="newlistTableDelAll">批量删除</Button>
        <Button @click="newlistTableAdd">添加资讯</Button>
      </div>
      <Table border ref="selection" :columns="newListTitle" :data="newListData"
             @on-selection-change="newListSelect"></Table>
      <div style="text-align: right;width: 100%;margin-top: 20px;">
        <Page :total="pageTotal" show-total :current="searchParam.page + 1" show-total show-elevator show-sizer placement="top"
              @on-change="newList" @on-page-size-change="changePageSize"></Page>
      </div>
      <Spin size="large" fix v-if="dataLoading"></Spin>
    </div>
  </div>
</template>

<script>
  /* import env_config from 'service/config'*/
  import VImage from 'components/common/image'

  export default {
    name: 'picture',
    components: { VImage},
    data() {
      return {
        dataLoading:false,
        //搜索参数
        searchParam: {
          tag: '',
          firstCategoryId: '',
          secondCategoryId: '',
          thirdCategoryId: '',
          status: '',
          minPrice: '',
          maxPrice: '',
          pageLength: 10,
          page: 0,
        },
        pageTotal: 0,
        systemSex: [],
        systemStyle: [],
        systemSeason: [],
        //批量删除 选中
        selectCheck: [],
        //列表数据
        newListData: [],
        newListTitle: [
          {
            title: '全选',
            type: 'selection',
            align: 'center',
            width: '60',
          },
          {
            title: '资讯编号',
            align: 'center',
            key: 'informationNo'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name',
          },
          {
            title: '封面',
            align: 'center',
            render: (h, param) => {
              return h(VImage, {
                props: {
                  src: param.row.coverUrl,
                  width: 70,
                  height: 50
                },
              })
            }
          },
          {
            title: '系统标签',
            align: 'center',
            render: (h, param) => {
              return param.row.systemTags ? param.row.systemTags.replace(/,/g, '/') : '';
            },
          },
          {
            title: '自定义标签',
            align: 'center',
            render: (h, param) => {
              return param.row.commonTags ? param.row.commonTags.replace(/,/g, '/') : '';
            }
          },
          {
            title: '状态',
            align: 'center',
            render: (h, param) => {
              let row = param.row;
              return row.status == 1 ? '待审核' : (row.status == 2 ? '已通过' : row.status == 3 ? '已拒绝' : '' );
            }

          },
          {
            title: '设计师',
            align: 'center',
            key:'designerName'
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createDateStr',
            width: '150',
          },
          {
            title: '操作',
            align: 'center',
            width: '150',
            render: (h, param) => {
              let btns = []
                , item = param.row
                , _this = this;
              if (item.status != 0 || item.status != 1) {
                btns.push(this.createBtn(h, '删除', () => {
                  this.newlistTableDel(item.id)
                }));
                if (item.status != 2) {
                  btns.push(this.createBtn(h, '编辑', () => {
                    this.$router.push({path: '/new/detail', query: {newsId: item.id, type: 2}})
                  }));
                  if (!item.status) {
                    btns.push(this.createBtn(h, '提交审核', () => {
                      this.submitAgain(1, item.id);
                    }));
                  }
                  if (item.status == 3) {
                    btns.push(this.createBtn(h, '重新提交', () => {
                      this.submitAgain(2, item.id);
                    }));
                  }
                }
              }


              btns.push(this.createBtn(h, '查看详情', () => {
                this.$router.push({path: '/new/detail', query: {newsId: item.id, type: 3}})
              }));


              return h('div', btns);
            }
          }
        ]
      }
    },
    created() {
      this.newList();
      this.systemTag();
    },
    mounted() {
    },
    methods: {
      //列表
      newList(page) {
        let _this = this;
        if (page) {
          this.searchParam.page = page - 1;
        }
        this.dataLoading = true;
        this.ajax.get('/v2/store/news/findNewsList', {params: this.searchParam}).then(res => {
          _this.newListData = res.data;
          _this.pageTotal = res.totalSize;
        }).finally(() =>{
          this.dataLoading = false;
        })
      },
      //查看系统标签
      systemTag() {
        let _this = this;
        _this.ajax.get('/v3/store/tag/getSearchTagList').then(res => {
          _this.systemSex = res.filter(item => item.tagType == 1);
          _this.systemStyle = res.filter(item => item.tagType == 2);
          _this.systemSeason = res.filter(item => item.tagType == 3)
        })
      },
      //changePageSize  页数改变
      changePageSize(len) {
        this.searchParam.pageLength = len,
          this.searchParam.page = 0;
        this.newList();
      },
      //重置
      handleReset(name) {
        this.searchParam = this.$options.data().searchParam;
        this.newList();
      },
      //按钮
      createBtn(render, label, callback) {
        return render('Button', {
          props: {
            type: 'text',
            size: 'small',
          },
          on: {
            click: () => {
              callback && callback();
            }
          }
        }, label)
      },
      //删除
      newlistTableDel(id) {
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除？',
          onOk: () => {
            this.ajax.get('/v2/store/news/delNews', {params: {delNewsIds: id}}).then(res => {
              this.newList();
            })
          },
        })

      },
      //添加
      newlistTableAdd() {
        this.$router.push({path: '/new/detail', query: {type: 1}});
      },
      newListSelect(valueId) {
        this.selectCheck = valueId;
      },
      //批量删除
      newlistTableDelAll() {
        let selectCheckStr = ''
          , _this = this;
        selectCheckStr = this.selectCheck.map((e) => e.id);
        selectCheckStr = selectCheckStr.join(',')
        if (!selectCheckStr) {
          this.$Message.warning({
            content: '请选择要删除的数据',
            duration: 3,
            top: 20
          });
          return;
        }
        this.newlistTableDel(selectCheckStr);
      },
      //重新提交
      submitAgain(type, id) {
        let content = '';
        if (type == 1) {
          content = '确认提交审核？'
        } else {
          content = '确认重新提交？'
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: content,
          onOk: () => {
            this.ajax.get('/v2/store/news/updateStatus', {params: {newsId: id}}).then(res => {
              this.newList();
            })
          }

        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }*/
</style>
