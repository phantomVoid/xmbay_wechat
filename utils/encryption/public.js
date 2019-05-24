var CryptoJS = require('aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("1231231231231231");//十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse('1231231231231231');//十六位十六进制数作为秘钥偏移量
//解密方法
function Decrypt(word) {
var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
return decryptedStr.toString();
}
//加密方法
function Encrypt(word) {
var srcs = CryptoJS.enc.Utf8.parse(word);
var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
return encrypted.ciphertext.toString().toUpperCase();
}
//base64加密
function base64_encode(str) { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0, len = str.length, strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}
module.exports.Decrypt = Decrypt;
module.exports.Encrypt = Encrypt;
module.exports.base64_encode = base64_encode;