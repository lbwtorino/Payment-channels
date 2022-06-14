// pragma solidity >=0.4.21 <0.6.0;
pragma solidity ^0.4.3;
import "./Tower.sol";
import "./imported/verify.sol";
// import "./imported/strings.sol";
pragma experimental "ABIEncoderV2";
contract Channel {

    verify.Data data;
    using verify for verify.Data;
    address public owner;
    Tower tower;
    mapping(address=>uint) balances;
    address[2] addr;
    // 0-empty, 1-ok,  3-dispute
    uint8 flag = 0;
    uint latestA = 0;
    uint latestB = 0;
    uint latestRound = 0;
    uint ddl = 0;
    uint end = 0;
    address towerIden;
    bool isRespond = false;
    uint percentage = 0;

    function Channel() public {
        owner = msg.sender;
    }
    //tower public key, tower address, 
    function setUp(address _towerIden, address _tower) payable{
        assert(flag == 0);
        balances[msg.sender] += msg.value;
        towerIden = _towerIden;
        tower = Tower(_tower);
        addr[0] = msg.sender;
        flag = 1;
    }

    function deposit() payable {
        assert(flag == 1);
        balances[msg.sender] += msg.value;
        addr[1] = msg.sender;
    }

    uint test1;
    uint test2;
    uint test3;

    function getInfor() public returns (uint, uint, uint){
       return (test1,test2, test3);
    }

    event Closure(uint A, uint B, uint round, uint random, address cid);
    event Dispute(uint A, uint B, uint round, uint random, address cid);

    function terminate(uint A, uint B, uint round, uint random, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 1);
        assert(addr[1] == data.verifyidentity(A, B, round, random, _v[1],  _r[1], _s[1]));
        assert(addr[0] == data.verifyidentity(A, B, round, random, _v[0],  _r[0], _s[0]));
        flag = 3;
        latestRound = round;
        ddl = now + 3600;
        end = now + 3600 * 48;
        tower.close(this, A, B, round);
        isRespond = false;
        emit Closure(A, B, round, random, this);
        test1 = 111;
    }


    function dispute(uint A, uint B, uint round, uint random, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 3);
        assert(now <= end);
        // assert(round > latestRound);
        // assert(addr[1] == data.verifyidentity(A, B, round, random, _v[1],  _r[1], _s[1]));
        // assert(addr[0] == data.verifyidentity(A, B, round, random, _v[0],  _r[0], _s[0]));
        if (round >= latestRound){
            latestRound = round;
            tower.close(this, A, B, round);
            emit Closure(A, B, round, random, this);
            test3 = 777;
        }
    }

    function payout(uint A, uint B, uint round, uint isPay) public payable{  
        assert(flag == 3);
        if (tx.origin == towerIden){
            if (now > ddl && isRespond == false ) {
                percentage = (now - ddl) / 3600;
            }
            isRespond = true;
            if (isPay == 1){
                assert(round == latestRound);
                assert(balances[addr[0]]+balances[addr[1]] >= A+B);
                addr[0].transfer(A);
                addr[1].transfer(B);
                balances[addr[0]] = 0;
                balances[addr[1]] = 0;
                flag = 0;
                latestRound = round;
                test2 = 222;
            }else {
                end = now + 3600 * 48;
            }
        }else if (msg.sender == addr[0] || msg.sender == addr[1]){
            assert(now > end);
            assert(round == latestRound);
            addr[0].transfer(A);
            addr[1].transfer(B);
            balances[addr[0]] = 0;
            balances[addr[1]] = 0;
            flag = 0;
            latestRound = round;
        }else {
            revert();
        }   
    }

    function challenge(bytes32 Hvalue, uint round, byte _v, bytes32 _r, bytes32 _s) public {
        assert(towerIden == data.verifytower(Hvalue, round, _v,  _r, _s));
        // assert(now > end);
        // assert(round > latestRound);
        if ((flag == 0 && round >= latestRound) || isRespond == false){
            //watchtower lost
            percentage = 18;
        } 
        if (msg.sender == addr[0] || msg.sender == addr[1]) {
            tower.withdraw(this, msg.sender, percentage);
        }
        else if (msg.sender ==  towerIden) {
            tower.earn(this, percentage);
        }
        else {
            revert();
        }
    }
}
