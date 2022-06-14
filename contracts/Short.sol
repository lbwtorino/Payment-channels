pragma solidity >=0.4.21 <0.6.0;
import {Bits} from "./imported/Bits.sol";
import "./imported/strings.sol";
import "./imported/verify.sol";
pragma experimental "ABIEncoderV2";
contract Short {

    verify.Data data;
    address public owner;
    string name = "Channle";
    mapping(address=>uint) balances;
    address[2] addr;
    using verify for verify.Data;
    uint end = 0;
    uint8 flag = 0;
    uint inner;
    uint latestRound;



    function Short() public {
        owner = msg.sender;
    }

    //tower public key, tower address, 
    function setUp() payable{
        assert(flag == 0);
        balances[msg.sender] += msg.value;
        addr[0] = msg.sender;
        flag = 1;
    }

    function deposit() payable {
        assert(flag == 1);
        balances[msg.sender] += msg.value;
        addr[1] = msg.sender;
    }

    uint currentBlk;
    uint test1;
    uint test2;
    address test3;
    function getInfor() public returns (uint, uint, uint, uint,address){
        return (block.number, currentBlk, test2, test1,test3);
    }


    function terminate(uint A, uint B, uint round, uint counter, bytes32 blkhash, byte[] _v, bytes32[] _r, bytes32[] _s) public {
        assert(flag == 1);
        currentBlk = block.number;
        assert(addr[0] == data.verifyshort(A, B, round, counter, blkhash, _v[0],  _r[0], _s[0]));
        assert(addr[1] == data.verifyshort(A, B, round, counter, blkhash, _v[1],  _r[1], _s[1]));
        flag = 3;
        latestRound = round;
        end = now + 3600 * 48;
        for (uint i=0; i<4; i++){
            if (blkhash == blockhash(currentBlk+i-4)){
                addr[0].transfer(A);
                addr[1].transfer(B);
                balances[addr[0]] = 0; 
                balances[addr[1]] = 0; 
                flag = 0;
                test1 = 820;
                test2 = i;
                test3 = addr[0];
                break;
            }
        }
    }

    function dispute(uint A, uint B, uint round, uint counter, bytes32 blkhash, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 3);
        assert(now <= end);
        // assert(addr[0] == data.verifyshort(A, B, round, counter, blkhash, _v[0],  _r[0], _s[0]));
        // assert(addr[1] == data.verifyshort(A, B, round, counter, blkhash, _v[1],  _r[1], _s[1]));
        assert(round >= latestRound);
        latestRound = round;
        for (uint i=0; i<4; i++){
            if (blkhash == blockhash(currentBlk+i-4)){
                addr[0].transfer(A);
                addr[1].transfer(B);
                balances[addr[0]] = 0; 
                balances[addr[1]] = 0; 
                flag = 0;
                test1 = 820;
                test2 = i;
                test3 = addr[0];
                break;
            }
        }
    }

    function payout(uint A, uint B) public payable {  
        assert(now > end);
        assert(msg.sender == addr[0] || msg.sender == addr[1]);
        addr[0].transfer(A);
        addr[1].transfer(B);
        balances[addr[0]] = 0; 
        balances[addr[1]] = 0; 
        flag = 0;
    }
}
