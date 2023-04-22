
const baseControllerObject = require('../../../com/baseControllerObject');
const express = require('express');    

let instance = undefined;

function orderController() {
    this.className = "orderController";
}

orderController.prototype = new baseControllerObject();
orderController.prototype.constructor = orderController;

orderController.prototype.initRouter = function() {
    baseControllerObject.prototype._init.call(this);
    //console.log(this.className) 
       
    this.router = express.Router();

    this.router.post('/order', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    this.router.delete('/order-delete', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    
}

instance = new orderController();
instance.initRouter();

module.exports = instance;