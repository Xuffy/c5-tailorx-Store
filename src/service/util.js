import DateFormat from  'dateformat';
import {localStore, sessionStore} from  'service/store';

export default{
  install(Vue, options)
  {
    let alertShow = false;

    /**
     * 阻塞message提示（只能提示显示一个message）
     * @param param
     * @returns {boolean}
     */
    Vue.prototype.$alert = function (param) {
      if (alertShow) return false;

      if (_.isString(param)) {
        param = {content: param};
      }

      param.onClose = () => {
        alertShow = false;
      };

      this.$Message.warning(param);
      alertShow = true;
    };

    /**
     * 本地永久缓存
     */
    Vue.prototype.$localStore = localStore;

    /**
     * 本地会话缓存
     */
    Vue.prototype.$sessionStore = sessionStore;

    /**
     * 格式化日期
     */
    Vue.prototype.$dateFormat = DateFormat;


    /**
     * text转换html 替换<br>、&nbsp;
     * @param value
     * @returns {string}
     */
    Vue.prototype.$textToHtml = function (value) {
      let val_array, val_num = 0, val_new = '';

      if (!_.isString(value)) {
        return '';
      }

      value = value.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
      val_array = value.split('&nbsp;');
      _.map(val_array, function (val) {
        if (val) {
          val_new += val;
          val_num = 0;
        } else if (val_num < 4) {
          val_num++;
          val_new += '&nbsp;';
        }
      });

      return val_new;
    };


    /**
     * html转换text 替换<br>、&nbsp;
     * @param value
     * @returns {string}
     */
    Vue.prototype.$htmlToText = function (value) {
      if (!_.isString(value)) {
        return '';
      }
      return value.replace(/<br\/>/g, '\n').replace(/&nbsp;/g, ' ');
    }

  }
}
