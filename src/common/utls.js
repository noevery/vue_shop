// export function throttle(fn, delay) {
//   let lastTiem = 0;
//   return function () {
//     let newTiem = Date.now()
//     if (newTiem - lastTiem > delay ) {
//       fn.call(this)
//       lastTiem = newTiem;
//       console.log('------');
//     }
//   }
// }

//表单验证
export function formCheck(value, formValue, reg, firstCheckValue, secondValue, callback) {
  if (value === '') {
    callback(new Error(firstCheckValue));
  }else if (!reg.test(formValue)) {
    callback(new Error(secondValue));
  }else {
    callback();
  }
}
// 递归获取三级权限的ID
export function getRightsId(node, arr) {
  if (!node.children) return arr.push(node.id);
  node.children.forEach(item => getRightsId(item, arr));
}
