
const baseControllerObject = require('../../..//com/baseControllerObject');
const express = require('express');    

let instance = undefined;

function myController() {
    this.className = "myController";
}

myController.prototype = new baseControllerObject();
myController.prototype.constructor = myController;

myController.prototype.initRouter = function() {
    baseControllerObject.prototype._init.call(this);
    //console.log(this.className) 
       
    this.router = express.Router();

    //회원정보
    this.router.post('/user-info', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    //배송지 목록
    this.router.post('/shipping-addr-list', (req, res, next) => {
        try {

            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    

    //배송지 등록 & 기본배송지 설정
    this.router.post('/shipping-addr-reg', (req, res, next) => {
        try {
            //
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    

    //배송지 삭제(전체 & 선택)    
    this.router.delete('/shipping-addr-del', (req, res, next) => {
        try {

            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    // 결제수단 정보 목록
    this.router.post('/payment-info-list', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    

    // 결제수단 정보 등록
    this.router.post('/payment-info-reg', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    // 결제수단 정보 삭제
    this.router.delete('/payment-info-del', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    // 약관 수신동의 정보
    this.router.post('/terms-info-list', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    // 약관 수신동의 설정
    this.router.post('/terms-info-reg', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })

    // 회원탈퇴
    this.router.post('/unregister', (req, res, next) => {
        try {
            res.send(this.resObject);
        } catch(ex) {
            //Exception
        }
    })    


}

instance = new myController();
instance.initRouter();

module.exports = instance;