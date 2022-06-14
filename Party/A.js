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
var B = require('../Party/B.js')
var Tower = require('../Tower/Tower.js')

var privateKeyA = AKeyStorage.getItem("private");
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

function sendToB(balA, balB, round, cid){
    var random = parseInt(Math.random()*(255+1),10);
    var randomMsg = balA.toString() + balB.toString() + random.toString();
    var hvalue = web3.utils.sha3(randomMsg);
    var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var signatureA = web3.eth.accounts.sign(wholeMsg, privateKeyA);
    // console.log(wholeMsg);
    B.receiveFromA(balA, balB, round, random, hvalue, signatureA, cid);
}

function receiveFromB(balA, balB, round, random, hvalue, signatureA, signatureB, cid){
    if (publicKeyB == web3.eth.accounts.recover(signatureB)){
        var stateDic = {balanceA:balA, balanceB:balB, sequence:round, r: random, sigA:signatureA, sigB:signatureB};
        var stateDicToStr = JSON.stringify(stateDic);
        AStorage.setItem(cid, stateDicToStr); 
        // sendToTower(balA, balB, round, publicKeyA);
   }
}

function receiveFromTower(hvalue, round, signatureA, signatureB, signatureTower, cid){
    if (publicKeyTower == web3.eth.accounts.recover(signatureTower)){
        var stateFromTowerDic = {Hvalue: hvalue, sequence:round, sigA: signatureA, sigB:signatureB, sigTower:signatureTower};
        var stateFromTowerToStr = JSON.stringify(stateFromTowerDic);
        AStorage.setItem("tower", stateFromTowerToStr); 
    }
}

module.exports.sendToB = sendToB;
module.exports.receiveFromB = receiveFromB;
module.exports.receiveFromTower = receiveFromTower;
