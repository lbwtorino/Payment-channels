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
    mapping(address=>uint) balances;
    mapping(uint=>MAPSTR) bitmap;
    // mapping(uint=>uint8) bitmap;
    struct MAPSTR {
        uint[] mapList;
    }
    // uint blkNum;
    uint counter = 0;
    mapping(uint=>CID) cidMapping;
    struct CID {
        address[] channelID;
        uint[] balA;
        uint[] balB;
        uint[] round;
    }
    // uint tag = 0;
    function Tower() public {
        owner = msg.sender;
    }

    function deposit() public payable{
        balances[msg.sender] += msg.value;
    }

    function withdraw(address sender) public payable{
        test2 = 501;
        sender.send(balances[sender]);
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

    function getDeposit(address addr) returns (uint){
        return balances[addr];
    }

    uint test1;
    uint test2;
    function getInfor() public returns (uint, uint){
       return (test1, test2);
    }

    function update(uint[] value) public {
        assert(msg.sender == owner);
        for (uint i=0; i<value.length; i++){
            bitmap[counter].mapList.push(value[i]);
        }
        counter += 1;
        callBack(counter - 1);
    }

    function callBack(uint _counter) public {
        for (uint i=0; i<cidMapping[_counter].channelID.length; i++){
            if (bitmap[_counter].mapList[i/256].bit(i%256) == 1){
                test1 += 100;
                // cidMapping[counter].channelID[i].call(bytes4(keccak256("payout(uint256,uint256,uint256,uint256)")),cidMapping[blkNum].balA[i], cidMapping[blkNum].balB[i], cidMapping[blkNum].round[i], 1);
                cidMapping[_counter].channelID[i].call(bytes4(keccak256("payout(uint256,uint256,uint256,uint256)")),cidMapping[_counter].balA[i], cidMapping[_counter].balB[i], cidMapping[_counter].round[i], 1);
            }else {
                // cidMapping[counter].channelID[i].call(bytes4(keccak256("payout(uint256,uint256,uint256,uint256)")),cidMapping[blkNum].balA[i], cidMapping[blkNum].balB[i], cidMapping[blkNum].round[i], 1);
                cidMapping[_counter].channelID[i].call(bytes4(keccak256("payout(uint256,uint256,uint256,uint256)")),cidMapping[_counter].balA[i], cidMapping[_counter].balB[i], cidMapping[_counter].round[i], 0);
            }
        } 
        delete cidMapping[_counter];
        delete bitmap[_counter];
    }
}
