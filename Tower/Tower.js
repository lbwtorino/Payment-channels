var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
AStorage = new LocalStorage('./data/A');
BStorage = new LocalStorage('./data/B');
TowerStorage = new LocalStorage('./data/Tower');
CidStorage = new LocalStorage('./data/cid');
AKeyStorage = new LocalStorage('./data/AKey');
BKeyStorage = new LocalStorage('./data/BKey');
TowerKeyStorage = new LocalStorage('./data/TowerKey');
var A = require('../Party/A.js');
var B = require('../Party/B.js');

var privateKeyTower = TowerKeyStorage.getItem("private");
var publicKeyA = AKeyStorage.getItem("public");
var publicKeyB = BKeyStorage.getItem("public");

function pad(num) {
    var str = ''
    for (var i=0; i<num; i++){
        str += '0'
    }
    return str
}

function checkNull(){
    if (TowerStorage.getItem("round") == null){
        return 0;
    }else {
        return 1;
    }
}

function receiveFromB(round, hvalue, signatureA, signatureB, cid){
    var wholeMsg = hvalue.toString() + round.toString();
    // console.log(microtime.now()/1000000.0);
    var t1 = web3.eth.accounts.recover(signatureB);
    var t2 = web3.eth.accounts.recover(signatureA)
    // console.log(microtime.now()/1000000.0);
    if (publicKeyB == web3.eth.accounts.recover(signatureB) &&  publicKeyA == web3.eth.accounts.recover(signatureA)){
        var stateDic = {Hvalue: hvalue, sequence:round, sigA: signatureA, sigB:signatureB};
        var stateDicToStr = JSON.stringify(stateDic);
        TowerStorage.setItem(cid, stateDicToStr); 
        sendToAB(round, hvalue, signatureA, signatureB, cid);
    }else {
        console.log("tower received from B failed")
    }
}


function sendToAB(round, hvalue, signatureA, signatureB, cid){
    var wholeMsg = hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var signatureTower = web3.eth.accounts.sign(wholeMsg, privateKeyTower);
    // console.log("tower sign:"+wholeMsg);
    A.receiveFromTower(hvalue, round, signatureA, signatureB, signatureTower, cid);
    B.receiveFromTower(hvalue, round, signatureA, signatureB, signatureTower, cid);
}

module.exports.sendToAB = sendToAB;
module.exports.receiveFromB = receiveFromB;
