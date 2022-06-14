var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
AShortStorage = new LocalStorage('./short/AShort');
BShortStorage = new LocalStorage('./short/BShort');
CidShortStorage = new LocalStorage('./short/cidShort');
AShortKeyStorage = new LocalStorage('./short/AShortKey');
BShortKeyStorage = new LocalStorage('./short/BShortKey');
var BShort = require('../Party/BShort.js')

var privateKeyA = AShortKeyStorage.getItem("private");
var publicKeyA = AShortKeyStorage.getItem("public");
var publicKeyB = BShortKeyStorage.getItem("public");
// function sendToParty(balA, balB, round, cid){
//     return web3.eth.getBlockNumber().then(function(blknum){
//         var wholeMsg = balA.toString() + balB.toString() + round.toString() + blknum.toString();
//         var signatureA = web3.eth.accounts.sign(wholeMsg, privateKeyA);
//         BShort.receiveFromParty(balA, balB, round, blknum, signatureA, cid);
//         console.log('sending'+ blknum);
//         // web3.eth.getBlock(blknum).then(function(blkhash){
//         //     console.log(blkhash.hash);
//         // });
//     });
// }

function receiveFromParty(balA, balB, round, counter, blkhash, signatureA, signatureB, cid){
    if (publicKeyB == web3.eth.accounts.recover(signatureB)){
        var stateDic = {balanceA:balA, balanceB:balB, sequence:round, nonce:counter, blockhash: blkhash, sigA:signatureA, sigB:signatureB};
        var stateDicToStr = JSON.stringify(stateDic);
        AShortStorage.setItem(cid, stateDicToStr); 
        // console.log(cid);
        // console.log("from A"+JSON.parse(AShortStorage.getItem(cid)))
   }
}

// module.exports.sendToParty = sendToParty;
module.exports.receiveFromParty = receiveFromParty;
