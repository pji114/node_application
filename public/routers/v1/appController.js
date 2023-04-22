
const baseControllerObject = require('../../../com/baseControllerObject');
const resCodeConst = require('../../../com/enums/resCodeConst').codeEnum;
const express = require('express');

//const temp = require('../service/test')

let instance = undefined;

function appController() {
    this.className = "appController";
}

appController.prototype = new baseControllerObject();
appController.prototype.constructor = appController;

appController.prototype.initRouter = function () {
    baseControllerObject.prototype._init.call(this);

    this.router = express.Router();

    //어플리케이션 초기 initRouter 시 Service.js 참조처리 
    const appService = require('../../service/app/appService');        //WEB & APP 기본 서비스
    const authService = require('../../service/app/authService');      //인증(갱신)토큰 처리서비스     
    const loginService = require('../../service/app/loginService');    //login 서비스   

    /**
     * @swagger
     * tags:
     *   name: Auth/Login
     *   description: 토큰(갱신)인증 및 로그인, 서비스정보
     */
    //서비스 정보
    this.router.post(`/service-info`, async (req, res, next) => {
        try {
            //초기 Default ResultCode.
            this.resObject = this._resCode(resCodeConst.SUCCESS);

            //Request 헤더 검증.
            this.resObject = this._requestParser(req.path, req.headers, req.body);
            if (this.resObject.ResCode == resCodeConst.SUCCESS) {
                //Service 실행(Execute)
                var result = await appService.execute(req.body);
                this._debugLog([`${this.className} [${appService.className} >>execute]`, `${JSON.stringify(result)}`]);

                //Service 반환 코드/메세지 처리                
                this.resObject = this._resCode(result.code);
                this.resObject.ResData = result.data;
            };
        } catch (ex) {
            //Exception.
            this.resObject = this._resCode(resCodeConst.UNKNOWN_ERROR);
            this._errorLog([this.className + `${req.path}`, ex.message]);
        };
        this._sendResJson(req, res, this.resObject.ResCode, this.resObject);
    })
    
    //인증토큰 발급
    this.router.post(`/auth/get-access-token`, async (req, res, next) => {
        try {
            //초기 Default ResultCode.
            this.resObject = this._resCode(resCodeConst.SUCCESS);

            //Request 검증
            this.resObject = this._requestParser(req.path, req.headers, req.body);            
            if (this.resObject.ResCode == resCodeConst.SUCCESS) {

                //Service 실행(accessExecute)
                var result = await authService.accessExecute(req.headers, req.body);
                this._debugLog([`${this.className} [${authService.className} >>accessExecute]`, `Result: ${JSON.stringify(result)}`]);

                //Service 반환 코드/메세지 처리                
                this.resObject = this._resCode(result.code);
                this.resObject.ResData = result.data;
            }
        } catch (ex) {
            //Exception.
            this.resObject = this._resCode(resCodeConst.UNKNOWN_ERROR);
            this._errorLog([this.className + `${req.path}`, ex.message]);
        };
        this._sendResJson(req, res, this.resObject.ResCode, this.resObject);
    })

    //갱신토큰 발급
    this.router.post(`/auth/get-refresh-token`, async (req, res, next) => {
        try {
            //초기 Default ResultCode.
            this.resObject = this._resCode(resCodeConst.SUCCESS);

            //Request headers, 인증키 등 검증. 
            this.resObject = this._requestParser(req.path, req.headers, req.body);
            if (this.resObject.ResCode == resCodeConst.SUCCESS) {
                
                //TODO: 이 체크를 왜했엇지??
                if (this.authToken != undefined) {
                    //Service 실행(refreshExecute)
                    var result = await authService.refreshExecute(this.authToken, req.body);
                    this._debugLog([`${this.className} [${authService.className} >>refreshExecute]`, `Result: ${JSON.stringify(result)}`]);

                    //Service 반환 코드/메세지 처리                
                    this.resObject = this._resCode(result.code);
                    this.resObject.ResData = result.data;
                } else {
                    throw new Error('SKMG-Plus Sever is Error.');
                }
            }
            
        } catch (ex) {
            //Exception.
            this.resObject = this._resCode(resCodeConst.UNKNOWN_ERROR);
            this._errorLog([this.className + `${req.path}`, ex.message]);
        };
        this._sendResJson(req, res, this.resObject.ResCode, this.resObject);
    })

    //로그인
    this.router.post(`/login`, async (req, res, next) => {
        try {
            //초기 Default ResultCode.
            this.resObject = this._resCode(resCodeConst.SUCCESS);

            //Request 로그 및 인증키 검증.
            this.resObject = this._requestParser(req.path, req.headers, req.body);
            if (this.resObject.ResCode == resCodeConst.SUCCESS) {

                //Service 실행(Execute)
                var result = await loginService.execute(req.body);
                this._debugLog([`${this.className} [${loginService.className} >>execute]`, `Result: ${JSON.stringify(result)}`]);

                //Service 반환 코드/메세지 처리
                this.resObject = this._resCode(result.code);
                this.resObject.ResData = result.data;
            }

        } catch (ex) {
            //Exception.
            this.resObject = this._resCode(resCodeConst.UNKNOWN_ERROR);
            this._errorLog([this.className + `${req.path}`, ex.message]);
        };
        this._sendResJson(req, res, this.resObject.ResCode, this.resObject);
    })

    //로그아웃
    this.router.post(`/logout`, async (req, res, next) => {
        try {
            //초기 Default ResultCode.
            this.resObject = this._resCode(resCodeConst.SUCCESS);

            //Request 로그 및 인증키 검증.
            this.resObject = this._requestParser(req.path, req.headers, req.body);
            if (this.resObject.ResCode == resCodeConst.SUCCESS) {

                //Service 실행(Execute)
            }

        } catch (ex) {
            //Exception.
            this.resObject = this._resCode(resCodeConst.UNKNOWN_ERROR);
            this._errorLog([this.className + `${req.path}`, ex.message]);
        };
        this._sendResJson(req, res, this.resObject.ResCode, this.resObject);
    })

    //TODO: ... router Controller
}

instance = new appController();
instance.initRouter();

module.exports = instance;