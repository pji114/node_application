
const config = require('./conf/config.json');
const crypto = require('crypto-js');
const AES = require('crypto-js/aes');
const SHA256 = require('crypto-js/sha256');
const SHA512 = require('crypto-js/sha512');
const stringUtil  = require('./com/utils/stringUtil');

const jwt = require('jsonwebtoken');

const nickname = { name : "Yoon Hyun Wook" };
const tel = { tel : "010-5546-8411" };
const email = { mail : "hyunwook.yoo@gmail.or.kr" };
const bidate = { date : "840101" };
const Gender = { gen : "M" };

var temp = Gender.gen
console.log(stringUtil.isGender(temp))

/*
//토큰 생성
Acctoken = jwt.sign({
    alg: 'HS256',
    type: 'JWT',
    client: nickname,
  }, config.secretInfo.jwtAccessKey, {
    expiresIn: '10m', // 만료시간 10분
    issuer: 'MAGICPLUS',
  });

  Retoken = jwt.sign({
    alg: 'HS256',
    type: 'JWT',
  }, config.secretInfo.jwtRefreshKey, {
    expiresIn: '10m', // 만료시간 10분
    issuer: 'MAGICPLUS',
  });  

console.log(Acctoken);
console.log(Retoken);

//토큰 검증
var re1 = jwt.verify(Acctoken, config.secretInfo.jwtAccessKey)
console.log(re1);

var re2 = jwt.verify(Retoken, config.secretInfo.jwtRefreshKey)
console.log(re2);
*/


/*
var temp = {};

temp['test'] = 'test';

console.log(temp);
*/

//var temp  = '2023-02-21'
//console.log(temp.substring(0, 10).replaceAll('-', ''))

/*
var temp1  =  crypto.SHA256(config.secretInfo.jwtAccessKey).toString()
console.log(temp1);
var temp2  =  crypto.SHA256(config.secretInfo.jwtRefreshKey).toString()
console.log(temp2);
*/

//var temp  =  crypto.SHA512('msg').toString()
//console.log(temp);

/*
var temp1  =  AES.encrypt(config.prod.databaseInfo.password, 'SKMG-PLUS').toString()
console.log(temp1);

var temp2  = AES.decrypt(config.prod.databaseInfo.password, 'SKMG-PLUS').toString(crypto.enc.Utf8)
console.log(temp2);
*/


//var temp  =  '안녕하세요.!!!!sd'

/*
const encodedWord = crypto.enc.Utf8.parse('NzUzMjI1NDE='); // encodedWord Array object
const encoded = crypto.enc.Base64.stringify(encodedWord); // string: 'NzUzMjI1NDE='
console.log(encoded)


const encodedWord2 = crypto.enc.Base64.parse('NzUzMjI1NDE='); // encodedWord via Base64.parse()
const decoded = crypto.enc.Utf8.stringify(encodedWord2); // decode encodedWord via Utf8.stringify() '75322541'
console.log(decoded)
*/
/*
var temp  =  SHA512('test').toString();
console.log(temp)
*/
/*
const path = require('path')
console.log(path.sep) 
console.log(path.join(__dirname, '/public/routers/*.js'));
console.log('/public/routers/*.js');
*/

//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'prod' ) ? 'prod' : 'dev';
//console.log(config['dev']);


