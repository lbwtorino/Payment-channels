var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
var tower = artifacts.require("./Tower.sol");
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
        
        var channelAddr = CidStorage.getItem("1");
        var channel2Addr = CidStorage.getItem("2");
        var channel3Addr = CidStorage.getItem("3");
        var channel4Addr = CidStorage.getItem("4");
        var channel5Addr = CidStorage.getItem("5");
        var channel6Addr = CidStorage.getItem("6");
        var channel7Addr = CidStorage.getItem("7");
        var channel8Addr = CidStorage.getItem("8");
        var channel9Addr = CidStorage.getItem("9");
        var channel10Addr = CidStorage.getItem("10");

        var txNum = 10;
        var balanceA = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
        var balanceB = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var sequence = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var cid = [channelAddr, channel2Addr,channel3Addr,channel4Addr, channel5Addr,channel6Addr,channel7Addr, channel8Addr,channel9Addr,channel10Addr];

        for (var i=0; i<txNum; i++){
            A.sendToB(balanceA[i], balanceB[i], sequence[i], cid[i]);
        }
        console.log('1')

        var _random = [];
        var _v = [];
        var _r = [];
        var _s = [];
    

        for (var i=0; i<txNum; i++){
            var v = [];
            var r = [];
            var s = [];
            _random.push(JSON.parse(AStorage.getItem(cid[i])).r);
            v.push(JSON.parse(AStorage.getItem(cid[i])).sigA.v);
            r.push(JSON.parse(AStorage.getItem(cid[i])).sigA.r);
            s.push(JSON.parse(AStorage.getItem(cid[i])).sigA.s);
            v.push(JSON.parse(AStorage.getItem(cid[i])).sigB.v);
            r.push(JSON.parse(AStorage.getItem(cid[i])).sigB.r);
            s.push(JSON.parse(AStorage.getItem(cid[i])).sigB.s);
            _v.push(v);
            _r.push(r);
            _s.push(s);
        }
        console.log(_v, _r, _s)



        function convertToList(strbitmap, intbitmap){
            var times = strbitmap.length / 256;
            var result = [];
            for (var i=0; i<times; i++){
                result.push(parseInt(intbitmap % Math.pow(2,256)));
                intbitmap = parseInt(intbitmap / Math.pow(2,256));
            }
            return result;
        }

        // console.log(balA, balB, round, _random, _v, _r, _s);


        
        return channel.deployed().then(function(channelInstance) {
            return channel2.deployed().then(function(channel2Instance){
            return channel3.deployed().then(function(channel3Instance){
            return channel4.deployed().then(function(channel4Instance){
            return channel5.deployed().then(function(channel5Instance){
            return channel6.deployed().then(function(channel6Instance){
            return channel7.deployed().then(function(channel7Instance){
            return channel8.deployed().then(function(channel8Instance){
            return channel9.deployed().then(function(channel9Instance){
            return channel10.deployed().then(function(channel10Instance){
                return channelInstance.terminate(balA, balB, round, _random[0], _v[0], _r[0], _s[0], {from: accounts[3]}).then(function(res){
                    var logging = res.logs[0];
                    var counter = 0;
                    if (logging.event == "Closure"){
                        var CID = logging.args.cid;
                        var eventState = [parseInt(logging.args.A), parseInt(logging.args.B), parseInt(logging.args.random), parseInt(logging.args.round)];
                        var randomMsg = eventState[0].toString() + eventState[1].toString() + eventState[2].toString();
                        var eventHvalue = web3.utils.sha3(randomMsg);
                        var latestHvalue = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                        if (eventHvalue == latestHvalue && eventState[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                            console.log('It is latest !');
                            if (BitmapStorage.getItem(counter) == null){
                                var channelSequence = {};
                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                channelSequence[CID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                            }else{
                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                currentCid[CID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                            }
                        }else {
                            console.log('It is not latest !')
                            if (BitmapStorage.getItem(counter) == null){
                                var channelSequence = {};
                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                channelSequence[CID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                            }else{
                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                currentCid[CID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                            }
                        }
                    }
                    console.log(_v[1], _r[1], _s[1])
                    return channel2Instance.terminate(balA, balB, round, _random[1], _v[1], _r[1], _s[1], {from: accounts[3]}).then(function(res2){
                        var logging2 = res2.logs[0];
                        var counter = 0;
                        if (logging2.event == "Closure"){
                            var CID = logging2.args.cid;
                            var eventState2 = [parseInt(logging2.args.A), parseInt(logging2.args.B), parseInt(logging2.args.random), parseInt(logging2.args.round)];
                            var randomMsg2 = eventState2[0].toString() + eventState2[1].toString() + eventState2[2].toString();
                            var eventHvalue2 = web3.utils.sha3(randomMsg2);
                            var latestHvalue2 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                            if (eventHvalue2 == latestHvalue2 && eventState2[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                console.log('It is latest !');
                                if (BitmapStorage.getItem(counter) == null){
                                    var channelSequence = {};
                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                    channelSequence[CID] = tmp;
                                    BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                }else{
                                    var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                    currentCid[CID] = tmp;
                                    BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                }
                            }else {
                                console.log('It is not latest !')
                                if (BitmapStorage.getItem(counter) == null){
                                    var channelSequence = {};
                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                    channelSequence[CID] = tmp;
                                    BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                }else{
                                    var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                    currentCid[CID] = tmp;
                                    BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                }
                            }
                        }
                        return channel3Instance.terminate(balA, balB, round, _random[2], _v[2], _r[2], _s[2], {from: accounts[3]}).then(function(res3){
                            var logging3 = res3.logs[0];
                            var counter = 0;
                            if (logging3.event == "Closure"){
                                var CID = logging3.args.cid;
                                var eventState3 = [parseInt(logging3.args.A), parseInt(logging3.args.B), parseInt(logging3.args.random), parseInt(logging3.args.round)];
                                var randomMsg3 = eventState3[0].toString() + eventState3[1].toString() + eventState3[2].toString();
                                var eventHvalue3 = web3.utils.sha3(randomMsg3);
                                var latestHvalue3 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                if (eventHvalue3 == latestHvalue3 && eventState3[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                    console.log('It is latest !');
                                    if (BitmapStorage.getItem(counter) == null){
                                        var channelSequence = {};
                                        var tmp = {timestamp: microtime.now(), bitmap: 1};
                                        channelSequence[CID] = tmp;
                                        BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                    }else{
                                        var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                        var tmp = {timestamp: microtime.now(), bitmap: 1};
                                        currentCid[CID] = tmp;
                                        BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                    }
                                }else {
                                    console.log('It is not latest !')
                                    if (BitmapStorage.getItem(counter) == null){
                                        var channelSequence = {};
                                        var tmp = {timestamp: microtime.now(), bitmap: 0};
                                        channelSequence[CID] = tmp;
                                        BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                    }else{
                                        var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                        var tmp = {timestamp: microtime.now(), bitmap: 0};
                                        currentCid[CID] = tmp;
                                        BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                    }
                                }
                            }
                            return channel4Instance.terminate(balA, balB, round, _random[3], _v[3], _r[3], _s[3], {from: accounts[3]}).then(function(res4){
                                var logging4 = res4.logs[0];
                                var counter = 0;
                                if (logging4.event == "Closure"){
                                    var CID = logging4.args.cid;
                                    var eventState4 = [parseInt(logging4.args.A), parseInt(logging4.args.B), parseInt(logging4.args.random), parseInt(logging4.args.round)];
                                    var randomMsg4 = eventState4[0].toString() + eventState4[1].toString() + eventState4[2].toString();
                                    var eventHvalue4 = web3.utils.sha3(randomMsg4);
                                    var latestHvalue4 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                    if (eventHvalue4 == latestHvalue4 && eventState4[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                        console.log('It is latest !');
                                        if (BitmapStorage.getItem(counter) == null){
                                            var channelSequence = {};
                                            var tmp = {timestamp: microtime.now(), bitmap: 1};
                                            channelSequence[CID] = tmp;
                                            BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                        }else{
                                            var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                            var tmp = {timestamp: microtime.now(), bitmap: 1};
                                            currentCid[CID] = tmp;
                                            BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                        }
                                    }else {
                                        console.log('It is not latest !')
                                        if (BitmapStorage.getItem(counter) == null){
                                            var channelSequence = {};
                                            var tmp = {timestamp: microtime.now(), bitmap: 0};
                                            channelSequence[CID] = tmp;
                                            BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                        }else{
                                            var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                            var tmp = {timestamp: microtime.now(), bitmap: 0};
                                            currentCid[CID] = tmp;
                                            BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                        }
                                    }
                                }
                                return channel5Instance.terminate(balA, balB, round, _random[4], _v[4], _r[4], _s[4], {from: accounts[3]}).then(function(res5){
                                    var logging5 = res5.logs[0];
                                    var counter = 0;
                                    if (logging5.event == "Closure"){
                                        var CID = logging5.args.cid;
                                        var eventState5 = [parseInt(logging5.args.A), parseInt(logging5.args.B), parseInt(logging5.args.random), parseInt(logging5.args.round)];
                                        var randomMsg5 = eventState5[0].toString() + eventState5[1].toString() + eventState5[2].toString();
                                        var eventHvalue5 = web3.utils.sha3(randomMsg5);
                                        var latestHvalue5 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                        if (eventHvalue5 == latestHvalue5 && eventState5[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                            console.log('It is latest !');
                                            if (BitmapStorage.getItem(counter) == null){
                                                var channelSequence = {};
                                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                channelSequence[CID] = tmp;
                                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                            }else{
                                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                currentCid[CID] = tmp;
                                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                            }
                                        }else {
                                            console.log('It is not latest !')
                                            if (BitmapStorage.getItem(counter) == null){
                                                var channelSequence = {};
                                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                channelSequence[CID] = tmp;
                                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                            }else{
                                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                currentCid[CID] = tmp;
                                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                            }
                                        }
                                    }
                                    return channel6Instance.terminate(balA, balB, round, _random[5], _v[5], _r[5], _s[5], {from: accounts[3]}).then(function(res6){
                                        var logging6 = res6.logs[0];
                                        var counter = 0;
                                        if (logging6.event == "Closure"){
                                            var CID = logging6.args.cid;
                                            var eventState6 = [parseInt(logging6.args.A), parseInt(logging6.args.B), parseInt(logging6.args.random), parseInt(logging6.args.round)];
                                            var randomMsg6 = eventState6[0].toString() + eventState6[1].toString() + eventState6[2].toString();
                                            var eventHvalue6 = web3.utils.sha3(randomMsg6);
                                            var latestHvalue6 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                            if (eventHvalue6 == latestHvalue6 && eventState6[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                                console.log('It is latest !');
                                                if (BitmapStorage.getItem(counter) == null){
                                                    var channelSequence = {};
                                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                    channelSequence[CID] = tmp;
                                                    BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                }else{
                                                    var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                    currentCid[CID] = tmp;
                                                    BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                }
                                            }else {
                                                console.log('It is not latest !')
                                                if (BitmapStorage.getItem(counter) == null){
                                                    var channelSequence = {};
                                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                    channelSequence[CID] = tmp;
                                                    BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                }else{
                                                    var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                    currentCid[CID] = tmp;
                                                    BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                }
                                            }
                                        }
                                        return channel7Instance.terminate(balA, balB, round, _random[6], _v[6], _r[6], _s[6], {from: accounts[3]}).then(function(res7){
                                            var logging7 = res7.logs[0];
                                            var counter = 0;
                                            if (logging7.event == "Closure"){
                                                var CID = logging7.args.cid;
                                                var eventState7 = [parseInt(logging7.args.A), parseInt(logging7.args.B), parseInt(logging7.args.random), parseInt(logging7.args.round)];
                                                var randomMsg7 = eventState7[0].toString() + eventState7[1].toString() + eventState7[2].toString();
                                                var eventHvalue7 = web3.utils.sha3(randomMsg7);
                                                var latestHvalue7 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                                if (eventHvalue7 == latestHvalue7 && eventState7[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                                    console.log('It is latest !');
                                                    if (BitmapStorage.getItem(counter) == null){
                                                        var channelSequence = {};
                                                        var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                        channelSequence[CID] = tmp;
                                                        BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                    }else{
                                                        var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                        var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                        currentCid[CID] = tmp;
                                                        BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                    }
                                                }else {
                                                    console.log('It is not latest !')
                                                    if (BitmapStorage.getItem(counter) == null){
                                                        var channelSequence = {};
                                                        var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                        channelSequence[CID] = tmp;
                                                        BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                    }else{
                                                        var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                        var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                        currentCid[CID] = tmp;
                                                        BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                    }
                                                }
                                            }
                                            return channel8Instance.terminate(balA, balB, round, _random[7], _v[7], _r[7], _s[7], {from: accounts[3]}).then(function(res8){
                                                var logging8 = res8.logs[0];
                                                var counter = 0;
                                                if (logging8.event == "Closure"){
                                                    var CID = logging8.args.cid;
                                                    var eventState8 = [parseInt(logging8.args.A), parseInt(logging8.args.B), parseInt(logging8.args.random), parseInt(logging8.args.round)];
                                                    var randomMsg8 = eventState8[0].toString() + eventState8[1].toString() + eventState8[2].toString();
                                                    var eventHvalue8 = web3.utils.sha3(randomMsg8);
                                                    var latestHvalue8 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                                    if (eventHvalue8 == latestHvalue8 && eventState8[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                                        console.log('It is latest !');
                                                        if (BitmapStorage.getItem(counter) == null){
                                                            var channelSequence = {};
                                                            var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                            channelSequence[CID] = tmp;
                                                            BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                        }else{
                                                            var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                            var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                            currentCid[CID] = tmp;
                                                            BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                        }
                                                    }else {
                                                        console.log('It is not latest !')
                                                        if (BitmapStorage.getItem(counter) == null){
                                                            var channelSequence = {};
                                                            var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                            channelSequence[CID] = tmp;
                                                            BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                        }else{
                                                            var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                            var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                            currentCid[CID] = tmp;
                                                            BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                        }
                                                    }
                                                }
                                                return channel9Instance.terminate(balA, balB, round, _random[8], _v[8], _r[8], _s[8], {from: accounts[3]}).then(function(res9){
                                                    var logging9 = res9.logs[0];
                                                    var counter = 0;
                                                    if (logging9.event == "Closure"){
                                                        var CID = logging9.args.cid;
                                                        var eventState9 = [parseInt(logging9.args.A), parseInt(logging9.args.B), parseInt(logging9.args.random), parseInt(logging9.args.round)];
                                                        var randomMsg9 = eventState9[0].toString() + eventState9[1].toString() + eventState9[2].toString();
                                                        var eventHvalue9 = web3.utils.sha3(randomMsg9);
                                                        var latestHvalue9 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                                        if (eventHvalue9 == latestHvalue9 && eventState9[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                                            console.log('It is latest !');
                                                            if (BitmapStorage.getItem(counter) == null){
                                                                var channelSequence = {};
                                                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                                channelSequence[CID] = tmp;
                                                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                            }else{
                                                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                                currentCid[CID] = tmp;
                                                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                            }
                                                        }else {
                                                            console.log('It is not latest !')
                                                            if (BitmapStorage.getItem(counter) == null){
                                                                var channelSequence = {};
                                                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                                channelSequence[CID] = tmp;
                                                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                            }else{
                                                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                                currentCid[CID] = tmp;
                                                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                            }
                                                        }
                                                    }
                                                    return channel10Instance.terminate(balA, balB, round, _random[9], _v[9], _r[9], _s[9], {from: accounts[3]}).then(function(res10){
                                                        var logging10 = res10.logs[0];
                                                        var counter = 0;
                                                        if (logging10.event == "Closure"){
                                                            var CID = logging10.args.cid;
                                                            var eventState10 = [parseInt(logging10.args.A), parseInt(logging10.args.B), parseInt(logging10.args.random), parseInt(logging10.args.round)];
                                                            var randomMsg10 = eventState10[0].toString() + eventState10[1].toString() + eventState10[2].toString();
                                                            var eventHvalue10 = web3.utils.sha3(randomMsg10);
                                                            var latestHvalue10 = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                                                            if (eventHvalue10 == latestHvalue10 && eventState10[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                                                                console.log('It is latest !');
                                                                if (BitmapStorage.getItem(counter) == null){
                                                                    var channelSequence = {};
                                                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                                    channelSequence[CID] = tmp;
                                                                    BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                                }else{
                                                                    var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                                    var tmp = {timestamp: microtime.now(), bitmap: 1};
                                                                    currentCid[CID] = tmp;
                                                                    BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                                }
                                                            }else {
                                                                console.log('It is not latest !')
                                                                if (BitmapStorage.getItem(counter) == null){
                                                                    var channelSequence = {};
                                                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                                    channelSequence[CID] = tmp;
                                                                    BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                                                                }else{
                                                                    var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                                                    var tmp = {timestamp: microtime.now(), bitmap: 0};
                                                                    currentCid[CID] = tmp;
                                                                    BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                                                                }
                                                            }
                                                        }
                                                        return tower.deployed().then(function(towerInstance){
                                                            return towerInstance.getCid.call().then(function(cidInstance){
                                                                var bitmapToUpdate = "";
                                                                var bitmapToUpdateValue = 0;
                                                                for (var i=0; i<cidInstance.length; i++){
                                                                    bitmapToUpdate = JSON.parse(BitmapStorage.getItem(counter))[cidInstance[i]].bitmap.toString() + bitmapToUpdate ;
                                                                    bitmapToUpdateValue += parseInt(JSON.parse(BitmapStorage.getItem(counter))[cidInstance[i]].bitmap.toString()) * Math.pow(2,i);
                                                                }
                                                                var bitmapList = [];
                                                                bitmapList = convertToList(bitmapToUpdate, bitmapToUpdateValue);
                                                                console.log(bitmapList);
                                                                return towerInstance.update(bitmapList, {from:accounts[1]}).then(function(updateInstance){
                                                                    return towerInstance.getInfor.call().then(function(val){
                                                                        console.log(val); 
                                                                        return channelInstance.getInfor.call().then(function(channelVal){
                                                                            console.log(channelVal); 
                                                                            return channel2Instance.getInfor.call().then(function(channel2Val){
                                                                                console.log(channel2Val); 
                                                                                return channel3Instance.getInfor.call().then(function(channel3Val){
                                                                                    console.log(channel3Val); 
                                                                                    return channel4Instance.getInfor.call().then(function(channel4Val){
                                                                                        console.log(channel4Val); 
                                                                                        return channel5Instance.getInfor.call().then(function(channel5Val){
                                                                                            console.log(channel5Val); 
                                                                                            return channel6Instance.getInfor.call().then(function(channel6Val){
                                                                                                console.log(channel6Val); 
                                                                                                return channel7Instance.getInfor.call().then(function(channel7Val){
                                                                                                    console.log(channel7Val); 
                                                                                                    return channel8Instance.getInfor.call().then(function(channel8Val){
                                                                                                        console.log(channel8Val); 
                                                                                                        return channel9Instance.getInfor.call().then(function(channel9Val){
                                                                                                            console.log(channel9Val); 
                                                                                                            return channel10Instance.getInfor.call().then(function(channel10Val){
                                                                                                                console.log(channel10Val); 
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
