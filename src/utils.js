/**
 * 工具库
 */
import MD5 from 'md5';
const utils = {
  GenSign(param) {
    let appScret = process.env.APP_SECRET
    let keys = Object.keys(param);
    keys.sort();
    let rawStr = '';
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (key === 'sign')
        continue;
      rawStr += param[key];
    }
    rawStr += appScret;
    let md5 = MD5(rawStr);
    return md5;
  },
  ObjToArr(obj) {
    const keys = Object.keys(obj);
    let result = [];
    for (let i = 0; i < keys.length; ++i) {
      result.push(obj[keys[i]]);
    }
    return result;
  },
  timeStampToDate(ts) {
    const date = new Date(ts * 1000);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  }
}


export default utils;