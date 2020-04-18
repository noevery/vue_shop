import { formCheck } from "./utls";

//邮箱和手机的验证规则
export const formRules = {
  data() {
    let checkEmail = (rule, value, callback) => {
      let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
      formCheck(value, this.userForm.email, reg, '请输入邮箱地址', '请输入正确的邮箱地址', callback)
    };
    let checkMobile = (rule, value, callback) => {
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      formCheck(value, this.userForm.mobile, reg, '请输入手机号码', '请输入正确的手机号码', callback)
    };
    return {
      userFormRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  }
}