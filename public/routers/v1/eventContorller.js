
const baseControllerObject = require('../../../com/baseControllerObject');
const express = require('express');    

let instance = undefined;

function eventController() {
    this.className = "eventController";
}

eventController.prototype = new baseControllerObject();
eventController.prototype.constructor = eventController;

eventController.prototype.initRouter = function() {
    baseControllerObject.prototype._init.call(this);
    //console.log(this.className) 
       
    this.router = express.Router();
    this.router.get('/get', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })   

    this.router.post('/post', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    this.router.delete('/delete', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    
}

instance = new eventController();
instance.initRouter();

module.exports = instance;