<template>
  <div class="material-inventory tx-container">
    <div class="tx-form-search">
      <Form :label-width="65" inline>
        <FormItem label="关键字">
          <Input v-model="searchParam.searchTerm" placeholder="搜索面料名称/编号/条形码/供应商"></Input>
        </FormItem>
        <FormItem label="分类">
          <Select v-model="searchParam.type" clearable placeholder="全部">
            <Option value="1">面料</Option>
            <Option value="2">里料</Option>
            <Option value="3">辅料</Option>
          </Select>
        </FormItem>
        <FormItem label="">
          <Button type="primary" @click="getDataList(1)">查询</Button>
          <Button type="ghost" style="margin-left: 8px;" @click="resetForm">重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="success" :loading="syncLoading" @click="syncData">同步数据</Button>
        </FormItem>
      </Form>
    </div>

    <Table border :columns="tableData" :data="dataList.data"></Table>


    <div style="text-align: right;width: 100%;margin-top: 30px">
      <Page :total="dataList.totalSize" show-total show-elevator @on-change="getDataList"></Page>
    </div>

    <Spin size="large" fix v-if="dataLoading"></Spin>

    <!--弹窗-->
    <Modal
      title="编辑面辅料"
      :width="700"
      v-model="editModal">
      <Form :label-width="80" inline>
        <FormItem label="面料：">{{dataDetail.name}}
        </FormItem>
        <FormItem label="编号：">{{dataDetail.no}}
        </FormItem>
        <FormItem label="色号：">{{dataDetail.color}}
        </FormItem>
        <br>
        <FormItem label="幅宽：">{{dataDetail.width}}
        </FormItem>
        <FormItem label="克重：">{{dataDetail.weight}}
        </FormItem>
        <FormItem label="成分：">{{dataDetail.content}}
        </FormItem>
        <FormItem label="供应商：">{{dataDetail.provider}}
        </FormItem>
        <br>
        <FormItem label="联系方式：">
          <Input v-model="dataDetail.contact" placeholder="请输入联系方式"></Input>
        </FormItem>
        <br>
        <FormItem label="图片：">
          <v-upload ref="uploadImage" :data-list="dataDetail.picture"></v-upload>
        </FormItem>
        <br>
        <FormItem label="介绍：" style="width:90%">
          <Input type="textarea" v-model="dataDetail.introduction" :rows="4" placeholder="请面辅料填写介绍"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitEdit">确定</Button>
      </div>
    </Modal>

    <!--参考大图显示-->
    <v-preview-image ref="previewImage"></v-preview-image>
  </div>
</template>

<script>
  import VUpload from 'components/common/upload'
  import VImage from 'components/common/image'
  import VPreviewImage from 'components/common/previewImage'

  export default {
    name: 'materialInventory',
    components: {VUpload, VImage, VPreviewImage},
    data() {
      return {
        dataLoading: false,
        syncLoading: false,
        submitLoading: false,
        dataList: {},
        dataDetail: {},
        searchParam: {
          searchTerm: '',
          type: '',
          page: 0,
          pageLength: 10
        },
        tableData: [
          {
            title: '名称',
            key: 'name',
            align: 'center',
          },
          {
            title: '分类',
            align: 'center',
            key: 'no',
            render: (h, param) => {
              switch (param.row.type) {
                case 1:
                case 4:
                  return '面料';
                case 2:
                case 5:
                  return '里料';
                case 3:
                case 6:
                  return '辅料';
                default:
                  return '其他';
              }
            }
          },
          {
            title: '编号',
            align: 'center',
            key: 'no',
          },
          {
            title: '条形码',
            align: 'center',
            key: 'barCode',
          },
          {
            title: '颜色',
            align: 'center',
            key: 'color',
          },
          {
            title: '成分',
            align: 'center',
            key: 'content'
          },
          {
            title: '克重',
            align: 'center',
            key: 'weight'
          },
          {
            title: '幅宽',
            align: 'center',
            key: 'width'
          },
          {
            title: '图片',
            align: 'center',
            render: (h, param) => {
              return h(VImage, {
                props: {
                  src: param.row.picture,
                  width: 70,
                  height: 50
                },
                /*on: {
                 click: () => {
                 console.log(this.$refs.previewImage)
                 this.$refs.previewImage.show(param.row.picture);
                 }
                 }*/
              })
            }
          },
          {
            title: '供应商',
            align: 'center',
            key: 'provider'
          },
          {
            title: '联系方式',
            align: 'center',
            key: 'contact',
          },
          {
            title: '最近同步时间',
            align: 'center',
            key: 'fetchTimeStr'
          },
          {
            title: '库存',
            align: 'center',
            key: 'stock',
            render: (h, param) => {
              return param.row.stock + ( param.row.unit || '');
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'edit',
            width: '160',
            render: (h, param) => {
              let btns = [];

              btns.push(this.createBtn(h, '编辑', () => {
                this.dataDetail = _.clone(param.row);
                this.dataDetail.picture = this.dataDetail.picture ? [this.dataDetail.picture] : [];
                this.editModal = true;
              }));

              return h('div', btns);
            }
          }
        ],
        editModal: false  // 编辑弹窗
      }
    },
    mounted () {
    },
    created() {
      this.getDataList();
    },
    methods: {
      getDataList(page){
        if (_.isNumber(page)) {
          this.searchParam.page = page - 1;
        }
        this.searchParam.searchTerm = this.searchParam.searchTerm.trim();
        this.dataLoading = true;
        this.ajax.post('/v3/store/material/findAll', this.searchParam).then(data => {
          this.dataList = data;
          this.dataLoading = false;
        }).catch(() => {
          this.dataLoading = false;
        });
      },
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
      submitEdit(){
        if (!this.$refs.uploadImage.validate()) {
          return false;
        }
        this.submitLoading = true;
        this.ajax.post('/v3/store/material/updateInfo', {
          id: this.dataDetail.id,
          picture: this.$refs.uploadImage.getData(),
          contact: this.dataDetail.contact,
          introduction: this.dataDetail.introduction,
        }).then(data => {
          this.getDataList();
          this.$Message.success('修改成功');
          this.editModal = false;
          this.submitLoading = false;
        }).catch(() => {
          this.submitLoading = false;
        });
      },
      resetForm(){
        this.searchParam = this.$options.data().searchParam;
        this.getDataList();
      },
      syncData(){
        this.syncLoading = true;
        this.ajax.post('/v3/store/material/fetchData').then(data => {
          this.getDataList();
          this.$Message.success('同步数据成功');
          this.syncLoading = false;
        }).catch(() => {
          this.syncLoading = false;
        });
      }
    }
  }
</script>
<style scoped>
</style>
