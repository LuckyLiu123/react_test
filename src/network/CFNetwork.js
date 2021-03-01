import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'
import Network from './network'
import {FormatDate} from '@/utils/date'

const aesPub = getAESKey();

//厨房后台接口
export default new Network({
    processRequest,
    processResponse
})

//上传文件请求参数
export function uploadFileData(data){
    return processRequest(data, {
        req: true
    })
}

//解密上传文件返回信息
export function decrypt(data){
    return processResponse(data);
}

//解密数据
function processResponse(data){
    if(data){
        if(typeof data === 'string'){
            const result = JSON.parse(decodeAES(data, aesPub));
            return result;
        }else{
            return data;
        }
    }
    return data;
}

//加密请求参数
function processRequest(params, cfg){
    const nowTime = new Date();
    const timestamp = nowTime.getTime();

    // const defaultParam = {
    //     sdkVersion: '1.0',
    //     deviceId: timestamp,
    //     deviceModel: 'H5',
    //     deviceOSAndVersion: 'H5',
    // }

    //加入统一的业务参数
    // Object.assign(defaultParam, params);

    //业务参数，使用AES加密
    let result = {};
    let requestData = null;
    let encodeKey = null;

    //加签
    if(cfg.req !== false){
        requestData = encryptAES(JSON.stringify(Object.assign({}, params)), aesPub);
        encodeKey = encryptRSA(aesPub);
        Object.assign(result, config.params, {
            requestId: timestamp,
            timestamp: FormatDate(nowTime, 'yyyyMMDDhhmmss'),
            requestData,
            encodeKey
        })

        const sign = addSign(result);
        result.sign = sign;
    }else{
        result = Object.assign(config.params, params, {
            requestId: timestamp,
            timestamp: FormatDate(nowTime, 'yyyyMMDDhhmmss'),
        })
    }
    return result;
}

//aes 数据解密
function decodeAES(value, aesPub){
    var aesKey = CryptoJS.enc.Utf8.parse(aesPub);
    var decrypted = CryptoJS.AES.decrypt(value, aesKey, {
        iv: CryptoJS.enc.Utf8.parse('1234567812345678'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return CryptoJS.enc.Utf8.stringify(decrypted).trim();
}

//rsa 加密
function encryptRSA(value){
    let encryptObj = new JSEncrypt();
    encryptObj.setPublicKey(config.publicKey);
    return encryptObj.encrypt(value);
}

//aes 参数加密
function encryptAES(value, aesPub){
    return CryptoJS.enc.Base64.stringify(CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(aesPub), {
        iv: CryptoJS.enc.Utf8.parse('1234567812345678'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).ciphertext);
}

//加签
function addSign(params){
    let source = '';
    Object.keys(params).sort().forEach((key) => {
        source += `${key}=${params[key]}, `;
    });
    source = source.slice(0, -2);
    return CryptoJS.SHA256(`{${source}}`).toString(CryptoJS.enc.Hex);
}

//随机生成16位的aesKey
function getAESKey(){
    let key = [];
    for(let i = 0; i < 16; i++){
        let num = Math.floor(Math.random() * 26);
        let charStr = String.fromCharCode(97 + num);
        key.push(charStr.toUpperCase());
    }
    let result = key.join('');
    return result;
}