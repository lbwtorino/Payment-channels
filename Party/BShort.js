var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
AShortStorage = new LocalStorage('./short/AShort');
BShortStorage = new LocalStorage('./short/BShort');
CidShortStorage = new LocalStorage('./short/cidShort');
AShortKeyStorage = new LocalStorage('./short/AShortKey');
BShortKeyStorage = new LocalStorage('./short/BShortKey');
var AShort = require('../Party/AShort.js');

var privateKeyB = BShortKeyStorage.getItem("private");
var publicKeyA = AShortKeyStorage.getItem("public");
var publicKeyB = BShortKeyStorage.getItem("public");

function pad(num) {
    var str = ''
    for (var i=0; i<num; i++){
        str += '0'
    }
    return str
}


function receiveFromParty(balA, balB, round, counter, blkhash, signatureA, cid){
    if (publicKeyA == web3.eth.accounts.recover(signatureA)){
        sendToParty(balA, balB, round, counter, blkhash, signatureA, cid);
   }
}

function sendToParty(balA, balB, round, counter, blkhash, signatureA, cid){
    var wholeMsg = balA.toString() + balB.toString() + round.toString() + counter.toString() + blkhash.substring(2)+pad(64-blkhash.substring(2).length);
    var signatureB = web3.eth.accounts.sign(wholeMsg, privateKeyB);
    AShort.receiveFromParty(balA, balB, round, counter, blkhash, signatureA, signatureB, cid);
    var stateDic = {balanceA:balA, balanceB:balB, sequence:round, nonce:counter, blockhash: blkhash, sigA:signatureA, sigB:signatureB};
    var stateDicToStr = JSON.stringify(stateDic);
    BShortStorage.setItem(cid, stateDicToStr);
}


module.exports.sendToParty = sendToParty;
module.exports.receiveFromParty = receiveFromParty;
