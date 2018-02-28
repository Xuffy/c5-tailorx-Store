<template>
  <div class="tx-order-material-table">
    <!--<Table border :columns="columns" :data="dataList.data"></Table>-->
    <table class="data-list" border="1" borderColor="#DDDEE1">
      <tr>
        <th v-for="item in columns" v-text="item.title"></th>
      </tr>
      <tr v-for="item in dataList.data">
        <td :style="{backgroundImage:'url(' + item[valueKey[0]] + ')'}"><!--{{item[valueKey[0]]}}-->
          <Upload :action="uploadParams.action"
                  ref="uploadPhoto"
                  :headers="uploadParams.headers"
                  :data="uploadParams.data"
                  name="files"
                  :show-upload-list="false"
                  :on-success="file => {item[valueKey[0]] = file.data[0]}"
                  :format="['jpg','jpeg','png']">
            <div class="upload-box">
              <Icon type="upload" style="color:#ffffff"></Icon>
            </div>
          </Upload>
        </td>
        <td class="input">
          <Input v-model="item[valueKey[1]]" :placeholder="'填写' + columns[1].title"></Input>
        </td>
        <td class="input">
          <Input v-model="item[valueKey[2]]" :placeholder="'填写' + columns[2].title"></Input>
        </td>
        <td class="input">
          <Input v-model="item[valueKey[3]]" :placeholder="'填写' + columns[3].title"></Input>
        </td>
        <td class="input">
          <Input v-model="item[valueKey[4]]" :placeholder="'填写' + columns[4].title" type="textarea"></Input>
        </td>
        <td></td>
      </tr>
    </table>
    <!--<Spin size="large" fix v-else></Spin>-->
  </div>

</template>

<script>
  // 选择面料组件
  import _config from 'service/config'

  export default {
    name: 'materialTable',
    props: {
      dataList: Object,         // 数据集合 数据格式： {data:[]}
      type: {                  // 表格类型
        type: String,
        default: ''
      },
      valueKey: Array           // label字段key集合
    },
    data () {
      return {
        uploadParams: {
          data: {type: 1},
          action: `${_config.ENV.api}/v2/store/file/uploadFiles`,
          headers: {'utouu-open-client-ticket': this.$localStore.get('ticket')}
        },
        columns: [
          {
            'title': '图片',
            /*render: (h, params) => {
             let item = params.row[params.column.key];
             return item || h('div', [
             h('Upload', {
             props: {
             action: `${_config.ENV.api}/v2/store/file/uploadFiles`,
             headers: {'utouu-open-client-ticket': this.$localStore.get('ticket')},
             data: {type: 1},
             name: 'files',
             showUploadList: false,
             format: ['jpg', 'jpeg', 'png'],
             onSuccess: file => {
             item = file.data[0]
             }
             }
             }, '上传' + item,
             [
             h('div', {})
             ])
             ]);
             }*/
          },
          {'title': `${this.type}编号`},
          {'title': `${this.type}色号`},
          {'title': `${this.type}用料`},
          {'title': '备注'},
          {'title': '操作'}
        ]
      }
    },
    created() {
      _.map(this.valueKey, (val, index) => {
        this.columns[index].key = val;
      });
      if (_.isEmpty(this.dataList.data)) {
        this.dataList.data = [];
        this.dataList.data.push(_.object(this.valueKey, ['', '', '', '', '']));
      }
    },
    methods: {}
  }
</script>

<style>
  .tx-order-material-table .data-list .input input,
  .tx-order-material-table .data-list .input textarea {
    width: 100%;
    height: 100%;
    border: none;
    font-size: 14px;
    resize: none;
  }
</style>
<style scoped>
  .data-list {
    width: 100%;
    border-collapse: collapse;
    border-color: #DDDEE1;
  }

  .data-list th {
    height: 30px;
    background-color: rgb(238, 238, 238);
  }

  .data-list td {
    height: 60px;
    position: relative;
  }

  .data-list .upload-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    opacity: 0;
    background-color: rgba(0, 0, 0, .5);
    transition: all 1s;
    cursor: pointer;
  }

  .data-list .upload-box i {
    font-size: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .data-list td:first-child {
    background-size: cover;
    background-position: center;
  }

  .data-list td:first-child:hover .upload-box {
    opacity: 1;
  }

  .tx-order-material-table .data-list .input {
    width: 20%;
  }
</style>
