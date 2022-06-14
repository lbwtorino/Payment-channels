var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var Short = artifacts.require("./Short.sol");
var Lib = artifacts.require("./imported/verify.sol");
var LocalStorage = require('node-localstorage').LocalStorage;
AShortStorage = new LocalStorage('../short/AShort');
BShortStorage = new LocalStorage('../short/BShort');
CidShortStorage = new LocalStorage('../short/cidShort');
AShortKeyStorage = new LocalStorage('../short/AShortKey');
BShortKeyStorage = new LocalStorage('../short/BShortKey');

module.exports = function(deployer, network, accounts) {
    if (network == "development") {
        deployer.deploy(Lib);
        deployer.link(Lib, Short);
        // var publickeyA = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("A")).address;
        // var publickeyB = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("B")).address;
        // AShortKeyStorage.setItem("private", web3.utils.sha3("A"));
        // BShortKeyStorage.setItem("private", web3.utils.sha3("B"));
        // AShortKeyStorage.setItem("public", publickeyA);
        // BShortKeyStorage.setItem("public", publickeyB);

        //account[3]
        var publickeyA = "0xd48881c011A3f9b9c8017253F83C8416E6c94DA6";
        AShortKeyStorage.setItem("private", "0xc7e06b93d050bb76204321743ba7da6d5a2486d1abce5bd83b7788a6bedaf372");
        AShortKeyStorage.setItem("public", publickeyA);
        //account[4]
        var publickeyB = "0xb1D4f06aCb529622C70779ED9cDC59aE5220D1b3";
        BShortKeyStorage.setItem("private", "0x84fcce5eba1db05ce018fbe79dd5b22c7618e7f199e527844267311bef7a8999");
        BShortKeyStorage.setItem("public", publickeyB);
        
        deployer.deploy(Short, {from:accounts[2]}).then(function(ShortInstance){
            CidShortStorage.setItem("1", ShortInstance.address);
            return ShortInstance.setUp( {from:accounts[3], value:10}).then(function(setUpAInstance){


                return ShortInstance.deposit( {from:accounts[4], value:0}).then(function(setUpBInstance){
                    console.log('first test!')
                });

            });
        });      
    }else {
        console.log("wrong nework configuration!");
    }    
};