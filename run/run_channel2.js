var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
var tower = artifacts.require("./Tower.sol");
var channel = artifacts.require("./Channel.sol");
var channel2 = artifacts.require("./Channel2.sol");
var Tower = require('../Tower/Tower.js')
var A = require('../Party/A.js')
var B = require('../Party/B.js')
AStorage = new LocalStorage('./data/A');
BStorage = new LocalStorage('./data/B');
CidStorage = new LocalStorage('./data/cid');
TowerStorage = new LocalStorage('./data/Tower');
BitmapStorage = new LocalStorage('./data/Bitmap');
AKeyStorage = new LocalStorage('./data/AKey');
BKeyStorage = new LocalStorage('./data/BKey');
TowerKeyStorage = new LocalStorage('./data/TowerKey');

contract('Channel', function(accounts) {
    it("test Channel", function() {
        var privateKeyA = AKeyStorage.getItem("private");
        var privateKeyB = BKeyStorage.getItem("private");
        var privateKeyTower = TowerKeyStorage.getItem("private");
        var balA = 10;
        var balB = 0;
        var round = 1;
        var wholeMsg = balA.toString() + balB.toString() + round.toString();
        var _v = web3.eth.accounts.sign(wholeMsg, privateKeyA).v.toString();
        var _r = web3.eth.accounts.sign(wholeMsg, privateKeyA).r.toString();
        var _s = web3.eth.accounts.sign(wholeMsg, privateKeyA).s.toString();
        var channelAddr = CidStorage.getItem("1");
        var channel2Addr = CidStorage.getItem("2");

        var txNum = 2;
        var balanceA = [10, 7, 4];
        var balanceB = [0, 3, 6];
        var sequence = [1, 2, 3];
        var cid = [channelAddr, channel2Addr,channelAddr];

        for (var i=0; i<txNum; i++){
            A.sendToParty(balanceA[i], balanceB[i], sequence[i], cid[i]);
        }

        function nearestBlkNum (blockNumber){
            if (blockNumber % 10 == 0){
                return blockNumber;
            }else if(blockNumber % 10 == 1){
                return blockNumber+9;
            }else if(blockNumber % 10 == 2){
                return blockNumber+8;
            }else if(blockNumber % 10 == 3){
                return blockNumber+7;
            }else if(blockNumber % 10 == 4){
                return blockNumber+6;
            }else if(blockNumber % 10 == 5){
                return blockNumber+5;
            }else if(blockNumber % 10 == 6){
                return blockNumber+4;
            }else if(blockNumber % 10 == 7){
                return blockNumber+3;
            }else if(blockNumber % 10 == 8){
                return blockNumber+2;
            }else{
                return blockNumber+1;
            }
        }
        
        return channel.deployed().then(function(channelInstance) {
            return channel2.deployed().then(function(channel2Instance){
                return channelInstance.terminate(balA, balB, round, _v, _r, _s, {from: accounts[3]}).then(function(res){
                    console.log(res.logs);
                    var logging = res.logs[0];
                    var blockNumber = logging.blockNumber;
                    console.log('current terminate block:'+blockNumber);
                    var blkNum = nearestBlkNum(blockNumber);
                    console.log('latest block:'+blkNum);
                    if (logging.event == "Closure"){
                        var CID = logging.args.cid;
                        var eventState = [parseInt(logging.args.A), parseInt(logging.args.B), parseInt(logging.args.round)];
                        var latestJson = JSON.parse(TowerStorage.getItem(CID));
                        if (latestJson.balanceA == eventState[0] && latestJson.balanceB == eventState[1] && latestJson.sequence == eventState[2]){
                            console.log('It is latest !');
                            if (BitmapStorage.getItem(blkNum) == null){
                                var channelSequence = {};
                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                channelSequence[CID] = tmp;
                                BitmapStorage.setItem(blkNum, JSON.stringify(channelSequence));
                            }else{
                                var currentCid = JSON.parse(BitmapStorage.getItem(blkNum));
                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                currentCid[CID] = tmp;
                                BitmapStorage.setItem(blkNum, JSON.stringify(currentCid));
                            }
                        }else {
                            console.log('It is not latest !')
                            if (BitmapStorage.getItem(blkNum) == null){
                                var channelSequence = {};
                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                channelSequence[CID] = tmp;
                                BitmapStorage.setItem(blkNum, JSON.stringify(channelSequence));
                            }else{
                                var currentCid = JSON.parse(BitmapStorage.getItem(blkNum));
                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                currentCid[CID] = tmp;
                                BitmapStorage.setItem(blkNum, JSON.stringify(currentCid));
                            }
                        }
                    }
                    return channel2Instance.terminate(balA, balB, round, _v, _r, _s, {from: accounts[3]}).then(function(res2){
                        console.log(res2.logs);
                        var logging2 = res2.logs[0];
                        var blockNumber2 = logging2.blockNumber;
                        console.log('current terminate block:'+blockNumber2);
                        var blkNum2 = nearestBlkNum(blockNumber2);
                        console.log('latest block:'+blkNum2);
                        if (logging2.event == "Closure"){
                            var CID = logging2.args.cid;
                            var eventState2 = [parseInt(logging.args.A), parseInt(logging.args.B), parseInt(logging.args.round)];
                            var latestJson2 = JSON.parse(TowerStorage.getItem(CID));
                            if (latestJson2.balanceA == eventState2[0] && latestJson2.balanceB == eventState[1] && latestJson2.sequence == eventState2[2]){
                                console.log('It is latest !');
                                if (BitmapStorage.getItem(blkNum2) == null){
                                    var channelSequence = {};
                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                    channelSequence[CID] = tmp;
                                    BitmapStorage.setItem(blkNum2, JSON.stringify(channelSequence));
                                }else{
                                    var currentCid = JSON.parse(BitmapStorage.getItem(blkNum2));
                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                    currentCid[CID] = tmp;
                                    BitmapStorage.setItem(blkNum2, JSON.stringify(currentCid));
                                }
                            }else {
                                console.log('It is not latest !')
                                if (BitmapStorage.getItem(blkNum2) == null){
                                    var channelSequence = {};
                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                    channelSequence[CID] = tmp;
                                    BitmapStorage.setItem(blkNum2, JSON.stringify(channelSequence));
                                }else{
                                    var currentCid = JSON.parse(BitmapStorage.getItem(blkNum2));
                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                    currentCid[CID] = tmp;
                                    BitmapStorage.setItem(blkNum2, JSON.stringify(currentCid));
                                }
                            }
                        }
                        return tower.deployed().then(function(towerInstance){
                            return towerInstance.getCid.call().then(function(cidInstance){
                                var bitmapToUpdate = "";
                                var bitmapToUpdateValue = 0;
                                console.log('cidlist:'+cidInstance);
                                for (var i=0; i<cidInstance.length; i++){
                                    bitmapToUpdate = JSON.parse(BitmapStorage.getItem(blkNum))[cidInstance[i]].bitmap.toString() + bitmapToUpdate ;
                                    bitmapToUpdateValue += parseInt(JSON.parse(BitmapStorage.getItem(blkNum))[cidInstance[i]].bitmap.toString()) * Math.pow(2,i);
                                }
                                console.log("bitmapToUpdate:"+bitmapToUpdate);
                                console.log("bitmapToUpdateValue:"+bitmapToUpdateValue);
                                return towerInstance.callBack(parseInt(bitmapToUpdate), {from:accounts[1]}).then(function(updateInstance){
                                    return towerInstance.getInfor.call().then(function(val){
                                        console.log(val); 
                                        return channelInstance.getInfor.call().then(function(channelVal){
                                            console.log(channelVal); 
                                            return channel2Instance.getInfor.call().then(function(channel2Val){
                                                console.log(channel2Val); 
                                            });
                                        });
                                    });
                                });
                            });
                        });    
                    });
                });
            });
        });
    });
});
