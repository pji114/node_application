const config = require('../conf/config.json');
const path = require('path');
const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'SKMG-PLUS API',
            version: '1.0.0',
            description: 'SKMagic-Plus API with Express',
        },
        //host: `localhost:${config.serverInfo.Port}/${config.serverInfo.mainPath}`, 
        //basePath: '/' 
        //schemes: ['http', 'https'], // 사용 가능한 통신 방식
        servers:[
            {
                url: `http://localhost:${config[config.nodeENV].serverInfo.appPort}/${config.mainPath}/${config.profileActive}`
            }
        ]
    },
    apis: [
            path.join((config.nodeENV == 'local') ? config[config.nodeENV].swaggerInfo.path : __dirname, `/public/routers/${config.apiVersion}/*.js`), 
            path.join((config.nodeENV == 'local') ? config[config.nodeENV].swaggerInfo.path : __dirname, `/public/routers/swagger/*.yaml`)
        ]
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
}