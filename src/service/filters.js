let dateFormat = (timeMillis, formatString) => {
  /*//计算给定时间与当期系统时间的时间差
  //计算相差毫秒数
  let now = new Date();
  let date = now.getTime() - timeMillis; //时间差的毫秒数

  if (formatString === undefined) {
    formatString = 'yyyy-MM-dd HH:mm:ss'
  }
  let dtime = format(timeMillis, formatString);

  //计算出相差天数
  let days = Math.floor(date / (24 * 3600 * 1000));

  //计算出小时数
  let leave1 = date % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000));

  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000);       //计算小时数后剩余的毫秒数
  let mins = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数
  let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000);
  let formatDtime = dtime;

  if (days === 0 && hours === 0) {
    if (mins < 1) {
      formatDtime = seconds + "秒前"
    } else {
      formatDtime = mins + "分钟前"
    }
  }
  else {
    if (days === 0 && hours !== 0) {
      formatDtime = hours + "小时前"
    } else {
      if (days < 7) {
        formatDtime = days + "天前"
      }
      // 当前年份
      else {
        if (now.getFullYear().toString() === dtime.substring(0, 4)) {
          formatDtime = dtime.substring(5)
        }
        else if (now.getFullYear().toString() - 1 === dtime.substring(0, 4)) {
          formatDtime = "去年" + dtime.substring(5)
        }
        else {
          formatDtime = dtime
        }
      }
    }
  }

  return formatDtime*/
};

export { dateFormat }
