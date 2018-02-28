<template>
  <div class="material-price tx-container">
    <div class="tx-form-search">
      <Form ref="searchForm" :model="searchForm" :label-width="65" inline>
        <FormItem label="关键字">
          <Input v-model="searchForm.searchTerm" placeholder="搜索面料名称/编号"></Input>
        </FormItem>
        <FormItem label="性别标签">
          <Select v-model="searchForm.gender" clearable placeholder="全部">
            <Option v-for="item in tagList.sex" :key="item.tagId" :value="item.tagName">{{item.tagName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="款式标签">
          <Select v-model="searchForm.style" clearable placeholder="全部">
            <Option value="短款">短款</Option>
            <Option value="中长款">中长款</Option>
            <Option value="长款">长款</Option>
            <Option value="超长款">超长款</Option>
            <Option value="非常规款">非常规款</Option>
          </Select>
        </FormItem>
        <FormItem label="分类标签">
          <Select v-model="searchForm.type" clearable placeholder="全部">
            <Option v-for="item in tagList.type" :key="item.tagId" :value="item.tagName">{{item.tagName}}</Option>
          </Select>
        </FormItem>
        <br>
        <FormItem label="价格区间">
          <InputNumber v-model="searchForm.minPrice" :step="50" :min="0" placeholder="最小值"></InputNumber>
          &nbsp;&nbsp;~&nbsp;&nbsp;
          <InputNumber v-model="searchForm.maxPrice" :step="50" placeholder="最大值"></InputNumber>
          </Row>
        </FormItem>
        <Button type="primary" @click="getDataList(1)">查询</Button>
        <Button type="ghost" style="margin-left: 8px;" @click="resetForm">重置</Button>
      </Form>
    </div>

    <Table border :columns="dataTitle" :data="dataList.data"></Table>

    <div style="text-align: right;width: 100%;margin-top: 30px">
      <Page :total="dataList.totalSize" show-total show-elevator @on-change="getDataList"></Page>
    </div>

    <!--弹窗-->
    <Modal
      title="编辑价格"
      :width="700"
      :mask-closable="false"
      :styles="{top: '50px'}"
      v-model="editModal">
      <h4>
        <span v-text="editItem.materialName"></span>&nbsp;&nbsp;
        <span v-text="editItem.materialNo"></span>&nbsp;&nbsp;
        <span v-if="editItem.colorSet" v-text="editItem.colorSet.join('/')"></span>
      </h4><br>

      <Row class="edit-row">
        <Col span="4">
        选择性别</Col>
        <Col span="4">
        选择款式</Col>
        <Col span="4">
        选择分类</Col>
        <Col span="4">
        输入常规价格</Col>
        <Col span="4">
        输入精品价格</Col>
      </Row>

      <Row class="edit-row-input" v-for="(item,index) in addStyleArray" :key="index">
        <Col span="4">

        <Select v-model="item.genderName" placeholder="性别">
          <Option v-for="(cItem,cIndex) in tagList.sex" :key="cIndex" :value="cItem.tagName">{{cItem.tagName}}</Option>
        </Select>
        </Col>
        <Col span="4">
        <Select v-model="item.styleName" placeholder="款式">
          <Option value="短款">短款</Option>
          <Option value="中长款">中长款</Option>
          <Option value="长款">长款</Option>
          <Option value="超长款">超长款</Option>
          <Option value="非常规款">非常规款</Option>
        </Select>
        </Col>
        <Col span="4">
        <Select v-model="item.typeName" placeholder="分类">
          <Option v-for="(cItem,cIndex) in tagList.type" :key="cIndex" :value="cItem.tagName">{{cItem.tagName}}</Option>
        </Select>
        </Col>
        <Col span="4">
        ¥&nbsp;<InputNumber v-model="item.price1" :min="0" :step="50"></InputNumber>
        </Col>
        <Col span="4">
        ¥&nbsp;<InputNumber v-model="item.price2" :min="0" :step="50"></InputNumber>
        </Col>
        <Col span="2" v-if="index + 1 === addStyleArray.length">
        <Button type="primary" icon="android-add" @click="addStyleItem()"></Button>
        </Col>
        <Col span="2" v-else>
        <Button type="primary" icon="android-remove" @click="deleteStyleItem(index,1)"></Button>
        </Col>
      </Row>

      <template v-for="(pItem,pIndex) in styleArray">
        <Row class="edit-row" v-for="(item,index) in pItem" :key="index">
          <Col span="4">
          {{item.genderName}}</Col>
          <Col span="4">
          {{item.styleName}}</Col>
          <Col span="4">
          {{item.typeName}}</Col>
          <Col span="4">
          ¥{{item.price1}}</Col>
          <Col span="4">
          ¥{{item.price2}}</Col>
          <Col span="2">
          <Button type="text" icon="android-delete" style="font-size: 18px;line-height: 10px"
                  @click="deleteStyleItem(index,2,pIndex)"></Button>
          </Col>
        </Row>
      </template>

      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitEdit()">确定</Button>
      </div>
    </Modal>

    <Spin size="large" fix v-if="dataLoading"></Spin>
  </div>

</template>
<script>
  export default {
    name: 'materialPrice',
    data() {
      return {
        editModal: false,
        dataList: [],
        dataLoading: false,
        submitLoading: false,
        tagList: {sex: null, type: null},
        editItem: {},
        styleArray: [],
        addStyleArray: [],
        searchForm: {
          searchTerm: '',
          gender: '',
          style: '',
          type: '',
          minPrice: 0,
          maxPrice: 0,
          page: 0,
          pageLength: 10
        },
        dataTitle: [
          {
            title: '面料名称',
            align: 'center',
            key: 'materialName',
          },
          {
            title: '面料编号',
            align: 'center',
            key: 'materialNo',
          },
          {
            title: '颜色',
            align: 'center',
            render: (h, param) => {
              return !_.isEmpty(param.row.colorSet) ? param.row.colorSet.join('/') : '--';
            }
          },
          {
            title: '成分',
            align: 'center',
            key: 'content',
          },
          {
            title: '短款',
            align: 'center',
            render: (h, param) => {
              return this.styleDataFilter(param.row.shortStyle, h);
            }
          },
          {
            title: '中长款',
            align: 'center',
            render: (h, param) => {
              return this.styleDataFilter(param.row.midLengthStyle, h);
            }
          },
          {
            title: '长款',
            align: 'center',
            render: (h, param) => {
              return this.styleDataFilter(param.row.longStyle, h);
            }
          },
          {
            title: '超长款',
            align: 'center',
            render: (h, param) => {
              return this.styleDataFilter(param.row.superLongStyle, h);
            }
          },
          {
            title: '非常规款',
            align: 'center',
            render: (h, param) => {
              return this.styleDataFilter(param.row.unnormalStyle, h);
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'edit',
            render: (h, param) => {
              return h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.editItem = param.row;
                    this.editModal = true;
                    this.styleArray = [];
                    this.styleArray.push(param.row.shortStyle);
                    this.styleArray.push(param.row.superLongStyle);
                    this.styleArray.push(param.row.midLengthStyle);
                    this.styleArray.push(param.row.unnormalStyle);
                    this.styleArray.push(param.row.longStyle);
                    this.addStyleItem(true);
                  }
                }
              }, '编辑')
            }
          }
        ]
      }
    },
    created() {
      this.getDataList();
      this.getTagList();
    },
    methods: {
      getDataList(page){
        if (_.isNumber(page)) {
          this.searchForm.page = page - 1;
        }
        this.dataLoading = true;
        this.searchForm.searchTerm = this.searchForm.searchTerm.trim();
        this.ajax.post('/v3/store/material/findAllPrice', this.searchForm).then(data => {
          this.dataList = data;
          this.dataLoading = false;
        }).catch(() => {
          this.dataLoading = false;
        });
      },
      getTagList(){
        this.ajax.get('/v3/store/tag/getSearchTagList').then(data => {
          this.tagList.sex = _.where(data, {tagType: 1});
          this.tagList.type = _.where(data, {tagType: 2});
        });
      },
      resetForm(){
        this.searchForm = this.$options.data().searchForm;
        this.getDataList();
      },
      addStyleItem(val){
        let item = {genderName: '', styleName: '', typeName: '', price1: 0, price2: 0};
        if (val) {
          this.addStyleArray = [item];
        } else {
          this.addStyleArray.push(item);
        }
      },
      deleteStyleItem(index, type, pIndex){
        if (type === 1) {
          this.addStyleArray = _.filter(this.addStyleArray, (val, ind) => {
            return ind !== index;
          });
        }
        if (type === 2) {
          let item = this.styleArray[pIndex],
            itemList = _.filter(item, (val, ind) => {
              return ind !== index;
            });

          this.$set(this.styleArray, pIndex, itemList);
        }

      },
      submitEdit(){
        let params = _.flatten(this.styleArray);

        this.submitLoading = true;

        _.map(this.addStyleArray, (val, index) => {
          if (!this.submitLoading) return;

          if ((!val.genderName || !val.styleName || !val.typeName || !val.price1) &&
            (val.genderName || val.styleName || val.typeName || val.price1)) {
            this.$Message.warning('请填写完整信息');
            return this.submitLoading = false;
          }

          _.map(params, styleVal => {
            if (val.genderName === styleVal.genderName && val.styleName === styleVal.styleName && val.typeName === styleVal.typeName) {
              this.$Message.warning('已存在相同面料定价');
              this.submitLoading = false;
            }
          });
        });


        if (!this.submitLoading) return false;

        _.map(this.addStyleArray, val => {
          val.genderName && params.push(val);
        })

        this.ajax.post('/v3/store/material/updatePriceInfo', {
          marterialNo: this.editItem.materialNo,
          priceList: JSON.stringify(params)
        }).then(data => {
          this.getDataList();
          this.$Message.success('编辑成功！');
          this.editModal = false;
          this.submitLoading = false;
        }).catch(() => {
          this.submitLoading = false;
        });

      },
      styleDataFilter(item, h){
        let li = [], tpl;

        _.map(item, (val, index) => {
          li.push(h('li', `${val.genderName}${val.typeName}：¥${val.price1} / ¥${val.price2}`));
        });

        if (_.isEmpty(li)) {
          tpl = '--';
        } else {
          if (li.length > 2) {
            let showLi = _.filter(li, (val, index) => {
              return index < 2;
            });

            showLi.push(h('li', '点击查看更多'))

            tpl = h('Poptip', {
              props: {placement: 'right', width: 200, trigger: 'click'}
            }, [h('ul', showLi), h('ul', {slot: 'content'}, li)])
          } else {
            tpl = h('ul', li);
          }
        }

        return tpl;
      }
    }
  }
</script>
<style scoped>
  .edit-row .ivu-col {
    line-height: 32px;
    text-align: center;
  }

  .edit-row-input {
    margin-bottom: 8px;
  }

  .edit-row-input .ivu-col {
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }
</style>
