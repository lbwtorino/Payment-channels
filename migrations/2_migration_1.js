var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var channel = artifacts.require("./Channel.sol");
var tower = artifacts.require("./Tower.sol");
var Lib = artifacts.require("./imported/verify.sol");
var LocalStorage = require('node-localstorage').LocalStorage;
AStorage = new LocalStorage('../data/A');
BStorage = new LocalStorage('../data/B');
TowerStorage = new LocalStorage('../data/Tower');
CidStorage = new LocalStorage('../data/cid');
AKeyStorage = new LocalStorage('../data/AKey');
BKeyStorage = new LocalStorage('../data/BKey');
TowerKeyStorage = new LocalStorage('../data/TowerKey');

module.exports = function(deployer, network, accounts) {
    if (network == "development") {
        var offchainTower = require('../Tower/Tower.js')
        deployer.deploy(Lib);
        deployer.link(Lib, tower);
        deployer.link(Lib, channel);
        //account[3]
        var publickeyA = "0xd48881c011A3f9b9c8017253F83C8416E6c94DA6";
        AKeyStorage.setItem("private", "0xc7e06b93d050bb76204321743ba7da6d5a2486d1abce5bd83b7788a6bedaf372");
        AKeyStorage.setItem("public", publickeyA);
        //account[4]
        var publickeyB = "0xb1D4f06aCb529622C70779ED9cDC59aE5220D1b3";
        BKeyStorage.setItem("private", "0x84fcce5eba1db05ce018fbe79dd5b22c7618e7f199e527844267311bef7a8999");
        BKeyStorage.setItem("public", publickeyB);
        //account[1]
        var publickeyTower = "0xBa7F9239A21A678b334F3dF8Ba4Dc6669492e44a";
        TowerKeyStorage.setItem("private", "0x6ccf2f938d8bab6c66ff333d6ab6e5cb9775912285d345ecdf2e8262289ef69f");
        TowerKeyStorage.setItem("public", publickeyTower);
        console.log("XXXXXXXXXXXXXXXXXXXXXx");
        deployer.deploy(tower, {from:accounts[1]}).then(function(towerInstance){
            CidStorage.setItem("tower", towerInstance.address);
            // return towerInstance.deposit({from:accounts[4], value:48}).then(function(depoistInstance){
            //     // return towerInstance.getDeposit.call(accounts[1]).then(function(deIns){

                    return deployer.deploy(channel, {from:accounts[2]}).then(function(channelInstance){
                        CidStorage.setItem("1", channelInstance.address);
                        return towerInstance.deposit(CidStorage.getItem("1"), {from:accounts[4], value:48}).then(function(depoistInstance){
                        // return towerInstance.getDeposit.call(accounts[1]).then(function(deIns){

                            return channelInstance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                                console.log(towerInstance.address)

                                return channelInstance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                    console.log('first test!')
                                });
                            });
                        });
                    }); 
        });
    }else {
        console.log("wrong nework configuration!");
    }    
};