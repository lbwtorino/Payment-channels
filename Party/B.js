var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
AStorage = new LocalStorage('./data/A');
BStorage = new LocalStorage('./data/B');
TowerStorage = new LocalStorage('./data/Tower');
CidStorage = new LocalStorage('./data/cid');
AKeyStorage = new LocalStorage('./data/AKey');
BKeyStorage = new LocalStorage('./data/BKey');
TowerKeyStorage = new LocalStorage('./data/TowerKey');
var A = require('../Party/A.js');
var Tower = require('../Tower/Tower.js');

var privateKeyB = BKeyStorage.getItem("private");
var publicKeyA = AKeyStorage.getItem("public");
var publicKeyB = BKeyStorage.getItem("public");
var publicKeyTower = TowerKeyStorage.getItem("public");

function pad(num) {
    var str = ''
    for (var i=0; i<num; i++){
        str += '0'
    }
    return str
}

function receiveFromA(balA, balB, round, random, hvalue, signatureA, cid){
    if (publicKeyA == web3.eth.accounts.recover(signatureA)){
        var randomMsg = balA.toString() + balB.toString() + random.toString();
        var hvalue = web3.utils.sha3(randomMsg);
        var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
        var signatureB = web3.eth.accounts.sign(wholeMsg, privateKeyB);
        // console.log(wholeMsg);
        A.receiveFromB(balA, balB, round, random, hvalue, signatureA, signatureB, cid);
        sendToTower(balA, balB, round, random, hvalue, signatureA, signatureB, cid);
    }else{
        console.log("B received from A failed !")
    }
}

function sendToTower(balA, balB, round, random, hvalue, signatureA, signatureB, cid){
    var stateDic = {balanceA:balA, balanceB:balB, sequence:round, r: random, sigA:signatureA, sigB: signatureB};
    var stateDicToStr = JSON.stringify(stateDic);
    BStorage.setItem(cid, stateDicToStr); 
    Tower.receiveFromB(round, hvalue, signatureA, signatureB, cid);
}

function receiveFromTower(hvalue, round, signatureA, signatureB, signatureTower, cid){
    if (publicKeyTower == web3.eth.accounts.recover(signatureTower)){
        var stateFromTowerDic = {Hvalue: hvalue, sequence:round, sigA: signatureA, sigB:signatureB, sigTower:signatureTower};
        var stateFromTowerToStr = JSON.stringify(stateFromTowerDic);
        BStorage.setItem("tower", stateFromTowerToStr); 
    }
}

module.exports.receiveFromA = receiveFromA;
module.exports.receiveFromTower = receiveFromTower;
