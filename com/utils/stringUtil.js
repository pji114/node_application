const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault(process.env.TZ);

let instance = undefined;

function stringUtil() {
    this.className = "stringUtil"
    this.kstOffset = 9 * 60 * 60; /// KST(한국 표준시) 오프셋
}

stringUtil.prototype = new stringUtil();
stringUtil.prototype.constructor = stringUtil;

stringUtil.prototype.nowDate = function(format) {
    var now = moment().format(format)
    if (format == undefined) 
        now = now.substring(0, 19).replace('T', ' ');

    return now;
}

stringUtil.prototype.Date = function(date, format) {
    var now = moment(date).format(format)
    if (format == undefined)
        now = now.substring(0, 19)
    
    return now;
}

stringUtil.prototype.addDay = function(day, cnt, format) {
    if (format == undefined) {
        format = 'YYYYMMDD'
    }
    var result = moment(day).add(cnt, 'days').format(format);

    return result;
}

stringUtil.prototype.addMonth = function(day, cnt, format) {
    if (format == undefined) {
        format = 'YYYYMMDD'
    }
    var result = moment(day).add(cnt, 'months').format(format);

    return result;
}

stringUtil.prototype.subtractDay = function(day, sub, format) {
    if (format == undefined) {
        format = 'YYYYMMDD'
    }
    var result = moment(day).subtract(sub, 'days').format(format)
    return result 
}

stringUtil.prototype.subtractMonth = function(day, sub, format) {
    if (format == undefined) {
        format = 'YYYYMMDD'
    }
    var result = moment(day).subtract(sub, 'months').format(format)
    return result 
}

//TimeStamp to DateFormat Converter
stringUtil.prototype.simpleDateFormat = function(timeStamp, separator) {
    var todayString = '';
    if (timeStamp != '') {
        var dateTime = new Date(
            timeStamp._seconds * 1000 + timeStamp._nanoseconds / 1000000,
        );

	    if (separator == undefined || separator == null || separator == "") {
	    	separator = "-";
	    }
    
	    todayString = dateTime.getFullYear() + separator;
	    todayString += (((dateTime.getMonth() + 1) < 10) ? "0" : "") + (dateTime.getMonth() + 1) + separator;
	    todayString += ((dateTime.getDate() < 10) ? "0" : "") + dateTime.getDate();
    }    
	
	return todayString;    
}

//UTC to KST Converter
stringUtil.prototype.UTCtoKSTDate = function(timeStamp, format) {
    var dateString = '';    
    try {
        if (timeStamp != '') {
            /**
             * UTC timeStamp (Ex. expiresIn)
             * KST Offset : 9 * 60 * 60
             * KST timeStamp : (UTC)timeStamp + Offset
             * = new Date(KST-timeStamp * 1000)
             */
            //const kstTimestamp = timeStamp + this.kstOffset;
            const kstTimestamp = timeStamp;  //moment 라이브러리 사용으로 this.kstOffset 처리 제외
            dateString = new Date(kstTimestamp * 1000);
        }

        if (format == undefined) {
            format = 'YYYY-MM-DD HH:mm:ss';
        }
        
        dateString = this.Date(dateString, format);
        return dateString;
    } catch(ex) {
        console.log(`${ex.message}`)
    }
}

//성명 마스킹 처리 함수
stringUtil.prototype.maskingName = function(name) {
    if (name.length <= 2) {
      return name.replace(name.substring(0, 1), "*");
    }
    
    return (
      name[0] +
      "*".repeat(name.substring(1, name.length - 1).length) +
      name[name.length - 1]
    );
}

//전화번호 마스킹 처리 함수
stringUtil.prototype.maskingPhoneNumber = function(phoneNumber) {
    const values = phoneNumber.split("-");

    values[1] = "*".repeat(values[1].length);
  
    return values.join("-");
}

//이메일 마스킹 처리 함수
stringUtil.prototype.maskingEmail = function(email) {
    const mask = "*".repeat(email.split("@")[0].length - 3);
    return email[0] + mask + email.slice(mask.length + 1, email.length);
}

//전화번호 체크 정규식
stringUtil.prototype.isPhoneNumber = function(phoneNumber) {
    var number = phoneNumber.replace(/[^0-9]/g, '')
                            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    var regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return regExp.test(number); // 형식에 맞는 경우 true 리턴
}

//이메일 체크 정규식
stringUtil.prototype.isEmail = function(email) {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(email); // 형식에 맞는 경우 true 리턴
}

//생년월일 체크 정규식
stringUtil.prototype.isBirthDate = function(biDate, type) {
    var date = biDate.replace(/[^0-9]/g, '')
    var regExp = undefined;
    if (type == 6)
        regExp = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/
    else
        regExp = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/

    return regExp.test(date);    
}

//성별 체크
stringUtil.prototype.isGender = function(gender) {
    var varGen = gender;
    var regExp = /M|F/
    return regExp.test(varGen);
}

//전화번호 특수문자replace
stringUtil.prototype.makePhoneNumber = function(phoneNumber) {
    var number = phoneNumber.replace(/[^0-9]/g, '') // 특수문자 제거
    return number; 
}

//생년월일 특수문자replace
stringUtil.prototype.makeBirthDate = function(biDate) {
    var date = biDate.replace(/[^0-9]/g, '') // 특수문자 제거
    return date; 
}


instance = new stringUtil()
module.exports = instance;
