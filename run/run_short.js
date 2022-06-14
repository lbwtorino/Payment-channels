var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
var Short = artifacts.require("./Short.sol");
var AShort = require('../Party/AShort.js')
var BShort = require('../Party/BShort.js')
AShortStorage = new LocalStorage('./short/AShort');
BShortStorage = new LocalStorage('./short/BShort');
CidShortStorage = new LocalStorage('./short/cidShort');
AShortKeyStorage = new LocalStorage('./short/AShortKey');
BShortKeyStorage = new LocalStorage('./short/BShortKey');

contract('Short', function(accounts) {
    it("test Short", function() {
        var shortAddr = CidShortStorage.getItem("1");
        // console.log(shortAddr)
        var txNum = 1;
        var balanceA = [10, 7, 4];
        var balanceB = [0, 3, 6];
        var sequence = [1, 2, 3];
        var cid = [shortAddr, shortAddr,shortAddr];
         
        function pad(num) {
            var str = ''
            for (var i=0; i<num; i++){
                str += '0'
            }
            return str
        }

        var privateKeyA = AShortKeyStorage.getItem("private");
        let publicKeyA = AShortKeyStorage.getItem("public");
        var publicKeyB = BShortKeyStorage.getItem("public");
        var privateKeyB = BShortKeyStorage.getItem("private");

        // console.log(privateKeyA)
        

        // let counter = 0;
        
        return Short.deployed().then(function(ShortInstance) {
            return web3.eth.getBlockNumber().then(function(blknum){
                return web3.eth.getBlock(blknum).then(function(blkhash){
                    var counter = 0;
                    var blkhashvalue = blkhash.hash;
                    var wholeMsg = balanceA[0].toString() + balanceB[0].toString() + sequence[0].toString() + counter.toString() + blkhashvalue.substring(2)+pad(64-blkhashvalue.substring(2).length);
                    // console.log(wholeMsg, balanceA[0], balanceB[0], sequence[0], counter, blkhashvalue);
                    var signatureA = web3.eth.accounts.sign(wholeMsg, AShortKeyStorage.getItem("private"));
                    BShort.receiveFromParty(balanceA[0], balanceB[0], sequence[0], counter, blkhashvalue, signatureA, cid[0]);
                    counter = counter + 1;
                    // console.log('sending:'+ blknum);
                    // console.log('testing:');
                    // console.log(blkhash.number);
                    var _v = [];
                    var _r = [];
                    var _s = [];
                    var balA = JSON.parse(AShortStorage.getItem(shortAddr)).balanceA;
                    var balB = JSON.parse(AShortStorage.getItem(shortAddr)).balanceB;
                    var round = JSON.parse(AShortStorage.getItem(shortAddr)).sequence;
                    var counter = JSON.parse(AShortStorage.getItem(shortAddr)).nonce;
                    var hashvalue = JSON.parse(AShortStorage.getItem(shortAddr)).blockhash;
                    _v.push(JSON.parse(AShortStorage.getItem(shortAddr)).sigA.v);
                    _r.push(JSON.parse(AShortStorage.getItem(shortAddr)).sigA.r);
                    _s.push(JSON.parse(AShortStorage.getItem(shortAddr)).sigA.s);
                    _v.push(JSON.parse(AShortStorage.getItem(shortAddr)).sigB.v);
                    _r.push(JSON.parse(AShortStorage.getItem(shortAddr)).sigB.r);
                    _s.push(JSON.parse(AShortStorage.getItem(shortAddr)).sigB.s);
                    return ShortInstance.terminate(balA, balB, round, counter, hashvalue, _v, _r, _s, {from: accounts[3]}).then(function(res){
                        return ShortInstance.getInfor.call().then(function(channelVal){
                            console.log(channelVal); 
                        });                      
                    });    
                });
            });
        });
    });
});
