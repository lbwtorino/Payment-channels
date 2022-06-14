pragma solidity >=0.4.21 <0.6.0;
import {Bits} from "./imported/Bits.sol";
import "./imported/strings.sol";
import "./imported/verify.sol";
pragma experimental "ABIEncoderV2";
contract Tower {

    verify.Data data;
    using verify for verify.Data;
    address public owner;
    using Bits for uint256;
    // using Bits for uint8;
    mapping(address=>CUSTOMER) balances;
    // mapping(uint=>MAPSTR) bitmap;
    // mapping(uint=>uint8) bitmap;
    // struct MAPSTR {
    //     uint[] mapList;
    // }
    uint counter = 0;
    mapping(uint=>CID) cidMapping;
    struct CID {
        address[] channelID;
        uint[] balA;
        uint[] balB;
        uint[] round;
    }
    struct CUSTOMER {
        address boss;
        uint money;
    }
    // uint tag = 0;
    function Tower() public {
        owner = msg.sender;
    }

    function deposit(address cid) public payable{
        balances[cid].money = msg.value;
        balances[cid].boss = msg.sender;
        test3 = balances[cid].money;
        test4 = address(this).balance;
    }

    function withdraw(address cid, address sender, uint percentage) public payable{
        assert(sender == balances[cid].boss);
        assert(msg.sender == cid);
        test2 = 501;
        if (percentage > 48){
            percentage = 48;
        }
        sender.transfer(percentage);
        // test5 = balances[cid].money;
        // test6 = address(this).balance;
        owner.transfer(48 - percentage);
        // test7 = balances[cid].money;
        // test8 = address(this).balance;
        balances[cid].money = 0;
        // test9 = balances[cid].money;
        // test10 = address(this).balance;
    }

    function earn(address cid, uint percentage) public payable{
        assert(tx.origin == owner);
        assert(msg.sender == cid);
        balances[cid].boss.transfer(percentage);
        // test5 = balances[cid].money;
        // test6 = address(this).balance;
        owner.transfer(48 - percentage);
        // test7 = balances[cid].money;
        // test8 = address(this).balance;
        balances[cid].money = 0;
        // test9 = balances[cid].money;
        // test10 = address(this).balance;
    }

    function find(address cid, uint round) returns (uint) {
        for (uint i=0; i<cidMapping[counter].channelID.length; i++){
            if (cidMapping[counter].channelID[i] == cid){
                return i+1;
            }
        } 
        return 0;
    }

    function close(address cid, uint A, uint B, uint round) returns (uint){
        uint index = find(cid, round);
        if (index == 0){
            cidMapping[counter].channelID.push(cid);
            cidMapping[counter].balA.push(A);
            cidMapping[counter].balB.push(B);
            cidMapping[counter].round.push(round);
        }else {
            cidMapping[counter].balA[index-1] = A;
            cidMapping[counter].balB[index-1] = B;
            cidMapping[counter].round[index-1] = round;
        } 
    }

    function getCid() public returns (address[]){
       return cidMapping[counter].channelID;
    }

    uint test1;
    uint test2;
    uint test3;
    uint test4;
    uint test5;
    uint test6;
    uint test7;
    uint test8;
    uint test9;
    uint test10;

    function getInfor() public returns (uint, uint, uint, uint, uint, uint, uint, uint, uint, uint){
       return (test1, test2, test3, test4, test5, test6, test7, test8, test9, test10);
    }

    function update(uint[] value) public {
        assert(msg.sender == owner);
        // for (uint i=0; i<value.length; i++){
        //     bitmap[counter].mapList.push(value[i]);
        // }
        counter += 1;
        respond(counter - 1, value);
    }

    function respond(uint _counter, uint[] value) public {
        for (uint i=0; i<cidMapping[_counter].channelID.length; i++){
            // if (bitmap[_counter].mapList[i/256].bit(i%256) == 1){
            if (value[i/256].bit(i%256) == 1){
                test1 += 100;
                cidMapping[_counter].channelID[i].call(bytes4(keccak256("payout(uint256,uint256,uint256,uint256)")),cidMapping[_counter].balA[i], cidMapping[_counter].balB[i], cidMapping[_counter].round[i], 1);
            }else {
                cidMapping[_counter].channelID[i].call(bytes4(keccak256("payout(uint256,uint256,uint256,uint256)")),cidMapping[_counter].balA[i], cidMapping[_counter].balB[i], cidMapping[_counter].round[i], 0);
            }
        } 
        delete cidMapping[_counter];
    }
}
