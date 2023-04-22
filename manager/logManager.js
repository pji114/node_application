const winSton = require('winston');
require('winston-daily-rotate-file');
const colorizer = winSton.format.colorize();
const stringUtil  = require('../com/utils/stringUtil')

let logger = winSton.createLogger({
    level: 'debug', // 최소 레벨
    // 파일저장
    transports: [
        new winSton.transports.DailyRotateFile({
            filename : `log/${global.serviceName}_%DATE%.log`, // log 폴더에 DataSend.log 이름으로 저장
            datePattern: 'YYYY-MM-DD',            
            maxSize: '50m',      // 최대 용량
            maxFiles: '60d',     // 파일 유효 기간
            json: true,          // JSON여부
            zippedArchive: true, // 압축여부            
            format: winSton.format.printf(
                info => `${stringUtil.nowDate()} : [${info.level.toUpperCase()}] - ${info.message}`)
        }),
        // 콘솔 출력
        new winSton.transports.Console({
            format: winSton.format.printf(
                info => colorizer.colorize(info.level, `${stringUtil.nowDate()} : [${info.level.toUpperCase()}] - ${info.message}`))
        })
    ]
})

module.exports = logger

