var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var channel = artifacts.require("./Channel.sol");
var channel2 = artifacts.require("./Channel2.sol");
var channel3 = artifacts.require("./Channel3.sol");
var channel4 = artifacts.require("./Channel4.sol");
var channel5 = artifacts.require("./Channel5.sol");
var channel6 = artifacts.require("./Channel6.sol");
var channel7 = artifacts.require("./Channel7.sol");
var channel8 = artifacts.require("./Channel8.sol");
var channel9 = artifacts.require("./Channel9.sol");
var channel10 = artifacts.require("./Channel10.sol");
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
        deployer.link(Lib, channel2);
        deployer.link(Lib, channel3);
        deployer.link(Lib, channel4);
        deployer.link(Lib, channel5);
        deployer.link(Lib, channel6);
        deployer.link(Lib, channel7);
        deployer.link(Lib, channel8);
        deployer.link(Lib, channel9);
        deployer.link(Lib, channel10);
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

        deployer.deploy(tower, {from:accounts[1]}).then(function(towerInstance){
            CidStorage.setItem("tower", towerInstance.address);
            return towerInstance.deposit({from:accounts[4], value:48}).then(function(depoistInstance){
                
                    deployer.deploy(channel, {from:accounts[2]}).then(function(channelInstance){
                        CidStorage.setItem("1", channelInstance.address);
                        return channelInstance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channelInstance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('1st test!')
                            });
                        });
                    });
                    deployer.deploy(channel2, {from:accounts[2]}).then(function(channel2Instance){
                        CidStorage.setItem("2", channel2Instance.address);
                        return channel2Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel2Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('2nd test!')
                            });
                        });
                    });
                    deployer.deploy(channel3, {from:accounts[2]}).then(function(channel3Instance){
                        CidStorage.setItem("3", channel3Instance.address);
                        return channel3Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel3Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('3rd test!')
                            });
                        });
                    });
                    deployer.deploy(channel4, {from:accounts[2]}).then(function(channel4Instance){
                        CidStorage.setItem("4", channel4Instance.address);
                        return channel4Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel4Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('4th test!')
                            });
                        });
                    });
                    deployer.deploy(channel5, {from:accounts[2]}).then(function(channel5Instance){
                        CidStorage.setItem("5", channel5Instance.address);
                        return channel5Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel5Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('5th test!')
                            });
                        });
                    });
                    deployer.deploy(channel6, {from:accounts[2]}).then(function(channel6Instance){
                        CidStorage.setItem("6", channel6Instance.address);
                        return channel6Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel6Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('6th test!')
                            });
                        });
                    });
                    deployer.deploy(channel7, {from:accounts[2]}).then(function(channel7Instance){
                        CidStorage.setItem("7", channel7Instance.address);
                        return channel7Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel7Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('7th test!')
                            });
                        });
                    });
                    deployer.deploy(channel8, {from:accounts[2]}).then(function(channel8Instance){
                        CidStorage.setItem("8", channel8Instance.address);
                        return channel8Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel8Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('8th test!')
                            });
                        });
                    });
                    deployer.deploy(channel9, {from:accounts[2]}).then(function(channel9Instance){
                        CidStorage.setItem("9", channel9Instance.address);
                        return channel9Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel9Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('9th test!')
                            });
                        });
                    });
                    return deployer.deploy(channel10, {from:accounts[2]}).then(function(channel10Instance){
                        CidStorage.setItem("10", channel10Instance.address);
                        return channel10Instance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
                            return channel10Instance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
                                console.log('10th test!')
                            });
                        });
                    });
            }); 
        });
    }else {
        console.log("wrong nework configuration!");
    }    
};