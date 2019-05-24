let code = 'xykP+1DAyIl/mKTfJ41ENjqaGkWHEuQzwxAxS95bIXpzVJLT+aFygm2Nuz/tgaoewRkRIgGPNmPH5Q9kNroqszBSM3nLTbaAUV76AEWbVvZqWTNBwhMGh2+9xpDdR3OJG/Uf/a2Sjx9AUJbe0U70l+rgzwzZcEQxMAWTS/vD3SpMDc72Su+56jgGTrAklTeQd40b4VXcWRWYYjtrYP+vh70oEfbgiTxXA1EuGbHfbPLi4ZVVDbyrsa+9K/M3dgL3Srqr+3rNJ8E8wwA4T/dUsM5lm0z3EhnnIobH2MqF67dIF+HC+3Bmo13r9RFwxLGofG9gYqDfufXACm54Kvftf1Ywokx8lXtkWvV8dKBlLx7HE2XH0RHhx9nKnamwEWvuJm/o6zWuOM7fVchd/8UsJIoQRiaWUC8YlISPKbfP55K87Pg6bNn9vmUlszPb07MD5hMX9hCezX9XIlTPx7r1b1mZWnJoW2dWBJtIyFCb8itOkDNSePTY1uXo71mQqxw6OmtseE5hZHA5NL2/njBOEOdaDwf3aJWyfydErdOqDd8/nOnswlMRcdbjLdfCz/l8kTlzNk16YHZ7TAfSMH+iEznMOEf6+41cM8eEKjbvRxAtPj80mdQdC2ZY4AiIj2spsJuZxMAkrmp3RYYZiKYM+Ch+YskPV2oIUg4/mTCFYT49VMDhn/vChJ3Lw2c/FNnDxlABHle2TxsIzlSPCp1/hbThGnS1MWTgn7vk4VPDLwaq/CRrK/BUh739m3JF0LgymxBIBx6dROZh0jwSi8zfucE95dFa+LtquKnnFD0Q6YwAWJ0aGid/Punnnv31QRYzc2zjsTE/xzyysfpfnOAG1LGuNy4T9DEj4R5LL2hHDyXi/D8oDBRx+BhAonjeil2x4oLkW4b+hbb+keSKVxURh/j1kGmdhIzNiqR44EG1brfglvs0OJOS6a2JECZEl6lzD1cUTvXkV0tWgwKyZLXbBC+c8MTEOSj+wR22PP+oqWArCeu0XS9gzRMKOLjxO1IYJchewo09FVMJsLOaCtrmMBr29CdxxM8gQmlBBdeK4/+9BUVDwlfSrWrgVNyGjq0RTPv2qH6HB/drSyhQz62j12Oc+W+N7W+fQOuLGqkuKxtLbA7VP1UOHaR3PwG2pg363DXWMbXyCLf1RTL2L4lT7fuw7HclTHKeTUyKFljYjLFgonLTjRGG2n5D1FN/2qTKz8y9y2i6pErs70AvmaFwCD8/knSRSx8tCf8Cf+Sbz0OpfWcIXECSfYbvWwDZgV0jTEMB3cN1puYFLbKavSlFox1wGp8ErnRyIwDmYsZWMXwqi20F37foay9Gi7RSCnQA235c6dbaeefe5a7847371660d98cd8cf'
const CryptoJS = require('aes.js');
const str = '123456'

//将字符串转换成二进制形式
function strToBinary(str) {
  let result = [];
  let list = str.split("");
  for (let i = 0, len = list.length; i < len; i++) {
    if (i != 0) {
      result.push("");
    }
    let item = list[i];
    let binaryStr = item.charCodeAt().toString(2);
    result.push(binaryStr);
  }
  return result.join("");
}

console.log('--', strToBinary(str))
const key = CryptoJS.enc.Utf8.parse(str); //十六位十六进制数作为秘钥
// const iv = CryptoJS.enc.Utf8.parse(''); //十六位十六进制数作为秘钥偏移量
//解密方法
function Decrypt(word) {
  // let CryptoJS_iv = code.substr(code.length - 32)
  let CryptoJS_word = code.substr(0,code.length - 32)
  // console.log(CryptoJS_word)
  // console.log(strToBinary(CryptoJS_iv))
  let iv = CryptoJS.enc.Utf8.parse('1231231231231231'); //十六位十六进制数作为秘钥偏移量
  let encryptedHexStr = CryptoJS.enc.Hex.parse(CryptoJS_word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

module.exports = {
  Encrypt: Encrypt,
  Decrypt: Decrypt
}