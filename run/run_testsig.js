var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
var TestSig = artifacts.require("./TestSig.sol");

contract('TestSig', function(accounts) {
    it("test TestSig", function() {

        var pk = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("A")).address;
        var sk = web3.utils.sha3("A");
        // console.log(pk, sk)

        var balA = 10;
        var balB = 20;
        var whole = balA.toString();
        // console.log(whole,  web3.utils.sha3("10"), web3.eth.accounts.hashMessage("10"))
        var v = web3.eth.accounts.sign(whole, accounts[1]).v;
        var r = web3.eth.accounts.sign(whole, accounts[1]).r;
        var s = web3.eth.accounts.sign(whole, accounts[1]).s;
        // console.log(v, r, s);

        web3.eth.defaultAccount = accounts[1];
        // web3.eth.personal.sign(whole, web3.eth.defaultAccount).then(console.log);
        var tt;
        web3.eth.personal.sign(whole, accounts[1], function (err, signature) { 
            // tt = console.log; 
            // console.log("signature:"+tt);
            console.log(err); 
        });

        web3.eth.personal.sign("0x" + whole.toString("hex"), "0xF4D2B942c3baebef5B81F4B909904015166b238A", function(err, signature) {
            // console.log(signature);
            console.log;
            // Be sure to make use of the signature only here.
            // It will not be defined until this callback is invoked.
        });

        return TestSig.deployed().then(function(TestSigInstance) {
            return TestSigInstance.test(balA, v, r, s).then(function(testRes){
                return TestSigInstance.getInfor.call().then(function(res){
                    console.log(res); 
                });  
            });                    
        });
    });
});
