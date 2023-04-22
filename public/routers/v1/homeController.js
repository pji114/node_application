
const baseControllerObject = require('../../../com/baseControllerObject');
const express = require('express');    

let instance = undefined;

function homeController() {
    this.className = "homeController";
}

homeController.prototype = new baseControllerObject();
homeController.prototype.constructor = homeController;

homeController.prototype.initRouter = function() {
    baseControllerObject.prototype._init.call(this);
    //console.log(this.className) 
       
    this.router = express.Router();
    this.router.get('/login', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })   

    this.router.post('/logout', (req, res, next) => {    
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    

    this.router.post('/story', (req, res, next) => {    
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })
}

instance = new homeController();
instance.initRouter();

module.exports = instance;