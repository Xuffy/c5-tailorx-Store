import {localStore, sessionStore} from  'service/store';

export default{
  install(Vue, options)
  {
    /**
     * 获取标签
     * @param type  1:系统标签   2:推荐标签
     * @returns {Promise.<T>|*}
     */
    Vue.prototype.$getTags = function (type) {
      let tag_cache = localStore.get('tags');
      if (_.isEmpty(tag_cache)) {
        return this.ajax.post('/v3/store/tag/findAllTags').then(data => {
          let param = _.clone(data);
          switch (type) {
            case 1:
              param = param.systemTags;
              break;
            case 2:
              param = param.commonTags;
              break;
          }
          localStore.set('tags', data);
          return param;
        }).catch(() => {
          this.$getTags();
        });
      } else {
        return new Promise(resolve => {
          switch (type) {
            case 1:
              return resolve(tag_cache.systemTags);
            case 2:
              return resolve(tag_cache.commonTags);
          }
          return resolve(tag_cache);
        });
      }
    }
  }
}
