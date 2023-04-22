const baseManagerObject = require('../com/baseManagerObject');
const { swaggerUi, specs } = require('./swaggerManager');
const express = require('express');

//const dbManager = require('./dbManager');

let instance = undefined;

function appManager() {
    this.className = "appManager";         //ClassName 정보
}

appManager.prototype = new baseManagerObject();
appManager.prototype.constructor = appManager;

appManager.prototype.initExpress = function(worker) {
    baseManagerObject.prototype._init.call(this);
    try {
        const appServer = express();
        
        //Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
        appServer.use(express.json());
        appServer.use(express.urlencoded({ extended: true }));

        this._validateRouteJson(appServer);     //미들웨어단에서 요청시 JSON형식 검증

        let webSever = undefined;
        let serviceName = global.serviceName.trim().toLowerCase();
        let serverActive = this.profileActive ?? '';
        let protocol = this.serverInfo.protocol;
        let host = this.serverInfo.host;
        let port = undefined;
        let appController = undefined;
        let homeController = undefined;
        let myController = undefined;
        let productController = undefined;
        let eventContorller = undefined;

        //Swagger Path 설정 (prod 운영은 swagger 적용제외.)
        if (this.nodeENV != 'prod') {
            appServer.use(`/${serviceName}/api-docs`, swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
            this._infoLog([`SKMG-Plus [${this.nodeENV}] Express Server SwaggerUI API docs require.`]);
        }

        if (serverActive == '') {
            //전체 라우터 application 서비스 
            port = process.env.PORT || this.serverInfo.port;

            // 라우터 참조
            appController = require(`../public/routers/${this.apiVersion}/appController`).router
            homeController = require(`../public/routers/${this.apiVersion}/homeController`).router
            myController = require(`../public/routers/${this.apiVersion}/myController`).router
            productController = require(`../public/routers/${this.apiVersion}/productController`).router
            eventContorller = require(`../public/routers/${this.apiVersion}/eventContorller`).router
            orderContorller = require(`../public/routers/${this.apiVersion}/orderController`).router

            // 라우터 미들웨어 등록
            appServer.use(`/${serviceName}/app/${this.apiVersion}`, appController);                 //app컨트롤러
            appServer.use(`/${serviceName}/home/${this.apiVersion}`, homeController);               //login $ story 라우팅 컨트롤러
            appServer.use(`/${serviceName}/product/${this.apiVersion}`, productController);         //product 라우팅 컨트롤러
            appServer.use(`/${serviceName}/my/${this.apiVersion}`, myController);                   //my 라우팅 컨트롤러
            appServer.use(`/${serviceName}/event/${this.apiVersion}`, eventContorller);             //event 라우팅 컨트롤러
            appServer.use(`/${serviceName}/order/${this.apiVersion}`, orderContorller);             //order 라우팅 컨트롤러

            //Express서버 Create Server
            webSever = require(protocol).createServer(appServer);
        } else {
            //config profileActive에 설정된 application 서비스
            switch(serverActive) {
                case 'app': port = process.env.PORT || this.serverInfo.appPort;
                    break;
                case 'home': port = process.env.PORT || this.serverInfo.homePort;
                    break;
                case 'product': port = process.env.PORT || this.serverInfo.productPort;
                    break;
                case 'my': port = process.env.PORT || this.serverInfo.myPort;
                    break;
                case 'event': port = process.env.PORT || this.serverInfo.eventPort;
                    break;
                case 'order': port = process.env.PORT || this.serverInfo.orderPort;
                    break;
                default: port = process.env.PORT || this.serverInfo.port;
                    break;
            }

            // 지정 라우터 참조
            appController = require(`../public/routers/${this.apiVersion}/${serverActive}Controller`).router
            // 지정 라우터 미들웨어 등록
            appServer.use(`/${serviceName}/${serverActive}/${this.apiVersion}`, appController);
            //Express서버 Create Server
            webSever = require(protocol).createServer(appServer);
        }

        if (webSever != undefined) {
            //Express서버 리스닝 Start.
            webSever.listen(port, host, () => {
                this._infoLog([`SKMG-Plus [${this.nodeENV}] Express [${serverActive}]-Server Strart.`, `Worker-PID/ID=[${worker.process.pid} / ${worker.id}]:${port}`]);
            })
            webSever.setTimeout(this.timeOut);
        } else {
            throw new Error('SKMG-Plus webSever is Undefined.');
        }
    } catch(ex) {
        //Exception
        this._errorLog([`${this.className} [initExpress.exception]`, ex.message]);
        process.exit();
    };
}

/*
appManager.prototype.initDB = function() {
    dbManager.connectDB();
}
*/

instance = new appManager();
//instance.initDB();

module.exports = instance;