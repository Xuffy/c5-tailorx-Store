<template>
  <div class="works-list tx-container">
    <div class="tx-form-search">
      <Form ref="formSearch" :model="formSearch" :label-width="65" inline style="max-width: 1300px">
        <FormItem label="关键字">
          <Input v-model="formSearch.searchTerm" placeholder="搜索标签、主题、设计师"></Input>
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
        <FormItem label="发布状态">
          <Select v-model="formSearch.status" clearable placeholder="全部">
            <Option value="2">已发布</Option>
            <Option value="1">未发布</Option>
          </Select>
        </FormItem>
        <FormItem label="作品来源">
          <Select v-model="formSearch.sourceType" clearable placeholder="全部">
            <Option value="1">上传</Option>
            <Option value="2">资讯</Option>
            <Option value="3">图库</Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间">
          <DatePicker type="daterange" v-model="formSearch.time" confirm placement="bottom-end" placeholder="选择时间范围"
                      style="width: 240px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getDataList(1)">查询</Button>
          <Button type="ghost" style="margin-left: 8px" @click="handleReset()">重置</Button>
          <Button type="success" style="margin-left: 8px" @click="$router.push({path: '/works/edit'})">
            上传作品
          </Button>
        </FormItem>
      </Form>
    </div>

    <Table border ref="orderTable" :loading="listLoading" :columns="listTitle" :data="dataList.data"
           style="margin-top: 20px"></Table>

    <div style="text-align: right;width: 100%;margin-top: 30px">
      <Page :total="dataList.totalSize" :current="formSearch.page + 1" show-total show-elevator show-sizer placement="top"
            @on-change="getDataList"
            @on-page-size-change="changePageSize"></Page>
    </div>

  </div>
</template>

<script>
  import VSystemTag from 'components/order/systemTag'
  import VAddTag from 'components/order/addTag'
  import VImage from 'components/common/image'

  export default {
    name: 'works',
    components: {VSystemTag, VAddTag, VImage},
    data() {
      return {
        listLoading: true,
        dataList: [],
        tagList: [],
        formSearch: {
          searchTerm: '',
          page: 0,
          pageLength: 10,
          sexTagId: '',
          styleTagId: '',
          seasonTagId: '',
          startTime: '',
          endTime: '',
          status: '',
          sourceType: '',
          time: []
        },
        listTitle: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '来源',
            key: 'sourceType',
            align: 'center',
            render: (h, params) => {
              switch (params.row.sourceType) {
                case 1:
                  return '上传';
                case 2:
                  return '资讯';
                case 3:
                  return '图库';
                default:
                  return '未知';
              }
            }
          },
          {
            title: '标题',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              /*let tpl
                ,item=params.row;
              tpl = h('Poptip', {
                props: {placement: 'right', trigger: 'click'}
              }, [h('p',item.title),h('div',{slot: 'content',style:{width:'200px'}}, item.title)]);*/
              return params.row.title || '--';
            }
          },
          {
            title: '参考照片',
            align: 'center',
            render: (h, params) => {
              let src = params.row.referencePictures;
              src = src ? src.split(';')[0] : '';
              return h(VImage, {
                props: {
                  src: src,
                  width: 80,
                  height: 60
                },
              })
            }
          },
          {
            title: '设计稿',
            align: 'center',
            render: (h, params) => {
              let src = params.row.designUrl;
              src = src ? src.split(',')[0] : '';
              return h(VImage, {
                props: {
                  src: src,
                  width: 80,
                  height: 60
                },
              })
            }
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
              return params.row.commonName ? params.row.commonName.replace(/,/g, '/') : '-';
            }
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createDateStr'
          },
          {
            title: '价格',
            align: 'center',
            key: 'price'
          },
          {
            title: '状态',
            align: 'center',
            key: 'status',
            render: (h, params) => {
              switch (params.row.status) {
                case 1:
                  return '未发布';
                case 2:
                  return '已发布';
                default:
                  return '未知状态'
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let _this = this
                , btns = []
                , item = params.row;

              switch (item.status) {
                case 1:
                  btns.push(this.createBtn(h, '编辑', () => {
                    this.$router.push({path: '/works/edit', query: {id: item.id}});
                  }));
                  btns.push(this.createBtn(h, '发布', () => {
                    this.$Modal.confirm({
                      title: '发布提示',
                      content: '是否确认发布？',
                      onOk(){
                        _this.updateStatus(2, item.id, '发布');
                      }
                    })
                  }));
                  break;
                case 2:
                  btns.push(this.createBtn(h, '下架', () => {
                    this.$Modal.confirm({
                      title: '下架提示',
                      content: '是否确认下架？',
                      onOk(){
                        _this.updateStatus(1, item.id, '下架');
                      }
                    })
                  }));
              }

              return h('div', btns);
            }
          }
        ]
      }
    },
    created() {
      let sessionSearch = this.$sessionStore.get('works_list_search');

      if (!_.isEmpty(sessionSearch)) {
        this.formSearch = sessionSearch;
      }

      this.getDataList();
      this.getTagList();
    },
    methods: {
      getDataList(page){
        let params;
        if (_.isNumber(page)) {
          this.formSearch.page = page - 1;
        }
        params = _.clone(this.formSearch);

        if (params.time[0]) {
          params.startTime = this.$dateFormat(params.time[0], 'yyyy-mm-dd');
        }
        if (params.time[1]) {
          params.endTime = this.$dateFormat(params.time[1], 'yyyy-mm-dd');
        }

        params.searchTerm = params.searchTerm.trim();
        this.listLoading = true;
        this.ajax.post('/v3/store/designerWork/findList', params)
          .then(data => {
            this.listLoading = false;
            data.data = data.data || [];
            this.dataList = data;
            this.$sessionStore.set('works_list_search', params);
          });
      },
      updateStatus(type,id, str){
        this.ajax.post('/v3/store/designerWork/updateStatus', {designerWorkId: id, status: type})
          .then(() => {
            this.getDataList();
            this.$Message.success(`${str}成功！`);
          })
          .catch(() => {
            this.$Message.success(`${str}失败，请重试！`);
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
        this.getDataList();
      },
      handleReset(){
        this.formSearch = this.$options.data().formSearch;
        this.getDataList();
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
