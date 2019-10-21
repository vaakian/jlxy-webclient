a = { "NJVYC-BMHX2-G77MM-4XJMR-6Q8Qn": { "uid": 19, "watchId": "NJVYC-BMHX2-G77MM-4XJMR-6Q8Qn", "nickName": "", "vipExpire": 0, "grade": 1, "term": 1 } }
function ObjToArr(obj) {
  const keys = Object.keys(obj);
  let result = [];
  for (let i = 0; i < keys.length; ++i) {
    result.push(obj[keys[i]]);
  }
  return result;
}
console.log(ObjToArr(a));