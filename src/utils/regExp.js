const phoneReg = /^[1][345789][0-9]{9}$/;
// const emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// 8~32位数字、字母和特殊字符的组合
// const password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[=\-~`!@#$%^&*()+_{}\[\];:"'\\|<>?,.\/])[0-9a-zA-Z=\-~`!@#$%^&*()+_{}\[\];:"'\\|<>?,.\/]{8,32}$/;

const isPhone = PN => {
  return phoneReg.test(PN);
};

const checkphone = (rule, value, callback) => {
  if (value == '') {
    callback(new Error('请输入手机号'));
  } else if (!isPhone(value)) {
    callback(new Error('请输入正确的手机号!'));
  } else {
    callback();
  }
};

export { checkphone };
