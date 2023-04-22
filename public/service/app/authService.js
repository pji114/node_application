const baseServiceObject = require('../../../com/baseServiceObject');
const tokenManager = require('../../../manager/tokenManager');
const stringUtil  = require('../../../com/utils/stringUtil');
const resCodeConst = require('../../../com/enums/resCodeConst').codeEnum;

function authService() {
    this.className = "authService";               //수행 Class명

}

authService.prototype = new baseServiceObject();
authService.prototype.constructor = authService;

//AccessToken Service 실행
authService.prototype.accessExecute = async function(headers, data) { 
    baseServiceObject.prototype._init.call(this);

    this.paramCheck = ['Csno', 'Name', 'UserEmail', 'PhoneNumber', 'BirthDate', 'Gender'];  //필수 체크 파라미터
    try {
        /**
         * 1. 최초 로그인 시 csno에 빈값으로 요청
         * 2. 최초 가입자는 기본정보 바탕으로 csno 발급 후 인증토큰 발급
         * 3. csno에 값이 있을 시 기존 사용자의 갱신토큰까지 만료단계 서비스 재로그인으로 인증토큰 발급 후 DB Update.
         */
        this.resultObj.code = resCodeConst.SUCCESS;
        
        //필수 파라미터 Key Check!
        var validateData = this._validateData(data);
        if (!validateData.variable) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_BODY;
            this.resultObj.data = validateData.param;
            this._debugLog([`${this.className} >>accessExecute`, validateData.param]);
            return this.resultObj;
        }

        //이메일 형식 체크
        if (!stringUtil.isEmail(data.UserEmail)) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_EMAIL;
            this.resultObj.data = `UserEmail is waring.`;
            this._debugLog([`${this.className} >>accessExecute`, validateData.param]);
            return this.resultObj;
        }

        //전화번호 형식 체크
        if (!stringUtil.isPhoneNumber(data.PhoneNumber)) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_PHONENUMBER;
            this.resultObj.data = `PhoneNumber is waring.`;
            this._debugLog([`${this.className} >>accessExecute`, validateData.param]);
            return this.resultObj;
        }

        //생년월일 형식 체크(Ex. 19XX0101)
        if (!stringUtil.isBirthDate(data.BirthDate)) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_DATE;
            this.resultObj.data = `BirthDate is waring.`;
            this._debugLog([`${this.className} >>accessExecute`, validateData.param]);
            return this.resultObj;
        }

        if (!stringUtil.isGender(data.Gender)) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_DATE;
            this.resultObj.data = `Gender is waring.`;
            this._debugLog([`${this.className} >>accessExecute`, validateData.param]);
            return this.resultObj;
        }        
        
        let clientInfo = {
            csno : "",
            name : "",
            userEmail : "",
            phoneNumber : "",
            birthDate : "",
            gender : ""
        }

        //Request Body 파싱        
        //TODO: 매직플러스-고객번호 체번(비회원일경우? TP2023040700001)
        clientInfo.csno = data.Csno ?? ''
        if (clientInfo.csno == '') {
            //TODO: 신규 csno 발급 처리.
            clientInfo.csno = 'MP2023040700001';
        }

        clientInfo.name = data.Name
        clientInfo.userEmail = data.UserEmail
        clientInfo.phoneNumber = stringUtil.makePhoneNumber(data.PhoneNumber)
        clientInfo.birthDate = stringUtil.makeBirthDate(data.BirthDate)
        clientInfo.gender = data.Gender

        let accessToken = await tokenManager.jwtAccessToken(clientInfo).data;                             //Access Token 
        let refreshToken = await tokenManager.jwtRefreshToken(clientInfo.csno).data;                      //Refresh Token
        let expiresIn = await tokenManager.jwtVerify(accessToken, this.secretInfo.jwtAccessKey).data.exp; //Expires In
        this._debugLog([`${this.className} >>accessExecute`, `발급토큰(JWT) 만료일시 체크 : ${stringUtil.UTCtoKSTDate(expiresIn)} [${expiresIn}]`]);

        //Return Data.
        this.resultObj.data = {
            Csno : clientInfo.csno,
            Type : tokenManager.type,
            AccessToken : accessToken,
            RefreshToken : refreshToken,
            ExpiresIn : expiresIn,
            RedirectUrl : data.RedirectUrl ?? ''
        };
        this._debugLog([`${this.className} >>accessExecute`, `Execute Data: ${JSON.stringify(this.resultObj.data)}`]);        

    } catch(ex) {
        this.resultObj.code = resCodeConst.UNKNOWN_ERROR;
        this.resultObj.data = ex.message;
        this._errorLog([`${this.className}.accessExecute`, this.resultObj.data]);
    }
    return this.resultObj;    
}

//RefreshToken Service 실행
authService.prototype.refreshExecute = async function(token, data) { 
    baseServiceObject.prototype._init.call(this);
    
    this.paramCheck = [ 'Csno', 'RedirectUrl'];  //필수 체크 파라미터

    try {
        /**
         * 1. 인증토큰 만료 시 Client단에서는 가지고 있는 갱신토큰으로 인증토큰 재발급
         * 2. base단에서 갱신토큰이 만료가 되었을 시 Client는 재로그인을 통해 인증토큰을 발급
         */
        this.resultObj.code = resCodeConst.SUCCESS;
        
        //필수 파라미터 Key Check!
        var validateData = this._validateData(data);
        if (!validateData.variable) {
            this.resultObj.code = resCodeConst.BAD_REQUEST_BODY;
            this.resultObj.data = validateData.param;
            this._debugLog([`${this.className} >>refreshExecute`, validateData.param]);
            return this.resultObj;
        }

        //Request Body 파싱
        let csno = data.Csno ?? '';
        let accessToken = undefined;
        let expiresIn = undefined;
        
        //토큰으로 csno를 추출하기 위해 base단에서 검증 이후 Verify
        var validation = await tokenManager.jwtVerify(token, this.secretInfo.jwtRefreshKey);
        if (validation.code == resCodeConst.SUCCESS) {
            if (validation.data.client == csno) {
                //TODO: 사용자정보 조회(Csno, Name, UserEmail, PhoneNumber)

                var clientInfo = {
                    name : "유현욱",
                    userEmail : "yoohyunouk@kakao.com",
                    phoneNumber : "010-5546-8411",
                    csno : csno,
                }
                accessToken = await tokenManager.jwtAccessToken(clientInfo).data;                             //Access Token 
                expiresIn = await tokenManager.jwtVerify(accessToken, this.secretInfo.jwtAccessKey).data.exp; //Expires In
                this._debugLog([`${this.className} >>refreshExecute`, `갱신토큰(Refresh)된 토큰 만료일시 체크 : ${stringUtil.UTCtoKSTDate(expiresIn)} [${expiresIn}]`]);                
            }
        }

        //갱신된Token 발급 후 Return.
        this.resultObj.data = {
            Csno : clientInfo.csno,
            Type : tokenManager.type,
            AccessToken : accessToken,
            ExpiresIn : expiresIn,
            RedirectUrl : data.RedirectUrl ?? ''
        };
        this._debugLog([`${this.className} >>refreshExecute`, `Execute Data: ${JSON.stringify(this.resultObj.data)}`]);        

    } catch(ex) {
        this.resultObj.code = resCodeConst.UNKNOWN_ERROR;
        this.resultObj.data = ex.message;
        this._errorLog([`${this.className}.refreshExecute`, this.resultObj.data]);
    }
    return this.resultObj;
    
}

module.exports = new authService;
