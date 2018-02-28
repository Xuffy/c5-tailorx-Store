<template>
  <div class="tx-order-add-tag">
    <Form :label-width="90">
      <FormItem v-if="!readonly" label="添加标签：" style="margin-bottom: 10px">
        <Input v-model="addTagName" placeholder="自定义标签" style="max-width: 200px;margin-right: 10px"></Input>
        <Button type="ghost" :loading="addTagLoading" @click="addTag()">添加</Button>
      </FormItem>

      <FormItem label="已选标签：" style="margin-bottom: 10px">
        <Tag :closable="!readonly" :color="readonly ? 'default' : 'blue'" v-for="item in selected"
             :key="item.id || item"
             @on-close="deleteTag(item)">
          {{item.tagName || item}}
        </Tag>
      </FormItem>

      <FormItem v-if="!readonly" label="推荐标签：" style="margin-bottom: 10px">
        <Tag v-for="item in recommendList" :key="item.id" @click.native="addTag(item)"
             :color="isSelected(item) ? 'blue' : 'default'">{{item.tagName}}
        </Tag>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  // 添加自定义标签组件

  export default {
    name: 'addTag',
    props: {
      readonly: { // 只读
        type: Boolean,
        default: false
      },
      dataList: { // 已选择标签列表
        type: Array,
        default: []
      },
      maxNum: { // 最多选择数量
        type: Number,
        default: 5
      }
    },
    data () {
      return {
        selected: _.compact(this.dataList || []),
        addTagName: '',
        recommendList: null,
        addTagLoading: false
      }
    },
    mounted() {
      this.$getTags(2).then(data => {
        this.recommendList = data;
      });
    },
    watch: {
      dataList(curVal, oldVal){
        if (_.isEqual(curVal, oldVal)) {
          return this.selected;
        }
        this.selected = curVal || [];
      }
    },
    methods: {
      getData(type){ // 1：完整标签对象   2：只返回标签名称数组  3：只返回标签ID数组

        return _.map(this.selected, val => {
          switch (type) {
            case 2:
              return val.tagName || val;
            case 3:
              return val.id || val;
          }
          return val;
        });
      },
      validate(){
        if (_.isEmpty(this.selected)) {
          this.$Message.warning('请选择自定义标签');
          return false;
        }
        return true;
      },
      isSelected(item){
        return !!_.find(this.selected, val => {
          if (_.isString(val)) {
            return item.tagName === val;
          } else {
            return item.id === val.id;
          }
        });

      },
      deleteTag(item){
        this.selected = _.filter(this.selected, val => {
          if (_.isString(val)) {
            return val !== item;
          } else {
            return val.id !== item.id;
          }
        });
      },
      addTag(item){
        if (!_.isEmpty(this.selected) && this.selected.length >= this.maxNum) {
          return this.$Message.warning(`最多选择${this.maxNum}个标签！`);
        }

        if (item) {
          if (_.findWhere(this.selected, {id: item.id})) {
            return this.$Message.warning('标签已选择！');
          }
          return this.selected.push(item);
        }

        if (!this.addTagName) {
          return this.$Message.warning('请输入自定义标签名称！');
        }

        if (_.findWhere(this.selected, {tagName: this.addTagName}) || _.indexOf(this.selected, this.addTagName) !== -1) {
          return this.$Message.warning('标签已存在！');
        }

        this.addTagLoading = true;
        this.ajax.post('/v3/store/tag/searchOrAddCommonTag', {tagName: this.addTagName})
          .then(data => {
            this.selected.push(data);
          })
          .finally(() => {
            this.addTagLoading = false;
          });
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
