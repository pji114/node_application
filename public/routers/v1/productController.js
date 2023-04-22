
const baseControllerObject = require('../../../com/baseControllerObject');
const express = require('express');    

let instance = undefined;

function productController() {
    this.className = "productController";
}

productController.prototype = new baseControllerObject();
productController.prototype.constructor = productController;

productController.prototype.initRouter = function() {
    baseControllerObject.prototype._init.call(this);
    //console.log(this.className) 
       
    this.router = express.Router();

    this.router.post('/product-list', (req, res, next) => {
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

instance = new productController();
instance.initRouter();

module.exports = instance;