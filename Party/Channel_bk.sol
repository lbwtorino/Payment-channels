pragma solidity >=0.4.21 <0.6.0;
import "./Tower.sol";
import "./imported/verify.sol";
// import "./imported/strings.sol";
pragma experimental "ABIEncoderV2";
contract Channel {

    verify.Data data;
    using verify for verify.Data;
    // using strings for *;
    address public owner;
    Tower tower;
    mapping(address=>uint) balances;
    mapping(address=>address) identity;
    mapping(uint=>address) addr;
    uint addrCounter = 0;
    // 0-empty, 1-ok,  3-dispute
    uint8 flag = 0;
    uint latestA = 0;
    uint latestB = 0;
    uint latestRound = 0;
    uint ddlSettle = 0;
    uint settlePeriod = 60 * 60;
    uint payoutPeriod = 60 * 60 * 24 * 3;
    address towerIden;
    address watchtower;
    bool isClose = false;
    bool isRespond = false;
    bool isAdd = false;
    uint tFinal = 0;

    function Channel() public {
        owner = msg.sender;
    }
    //publickeyA, publickeyTower, towerInstance.address
    function setUp(address party, address _towerIden, address _tower) payable{
        assert(flag == 0);
        identity[msg.sender] = party; 
        balances[party] += msg.value;
        towerIden = _towerIden;
        watchtower = _tower;
        tower = Tower(_tower);
        addr[addrCounter++] = msg.sender;
        flag = 1;
    }

    function deposit(address party) payable {
        assert(flag == 1);
        identity[msg.sender] = party; 
        balances[party] += msg.value;
        addr[addrCounter++] = msg.sender;
    }

    uint test1;
    uint test2;
    uint test3;

    function getInfor() public returns (uint, uint, uint){
       return (test1,test2, test3);
    }

    event Closure(uint A, uint B, uint round, uint random, address cid);

    function terminate(uint A, uint B, uint round, uint random, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 1);
        // assert(identity[addr[1]] == data.verifyidentity(A, B, round, random, _v[1],  _r[1], _s[1]));
        assert(identity[addr[0]] == data.verifyidentity(A, B, round, random, _v[0],  _r[0], _s[0]));
        flag = 3;
        latestRound = round;
        latestA = A;
        latestB = B;
        ddlSettle = now + settlePeriod;
        tower.close(this, A, B, round);
        isRespond = false;
        emit Closure(A, B, round, random, this);
        test1 = 111;
    }


    function dispute(uint A, uint B, uint round, uint random, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 3);
        assert(now <= ddlSettle + payoutPeriod);
        // assert(round > latestRound);
        assert(identity[addr[0]] == data.verifyidentity(A, B, round, random, _v[1],  _r[1], _s[1]));
        assert(identity[addr[1]] == data.verifyidentity(A, B, round, random, _v[0],  _r[0], _s[0]));
        if (round >= latestRound){
            latestRound = round;
            latestA = A;
            latestB = B;
            ddlSettle = now + settlePeriod;
            isRespond = false;
            tower.close(this, A, B, round);
            emit Closure(A, B, round, random, this);
            test3 = 777;
        }
    }

    function payout(uint A, uint B, uint round, uint isPay) public payable{  
        assert(flag == 3);
        assert(balances[identity[addr[0]]]+balances[identity[addr[1]]] >= A+B);
        if (msg.sender == watchtower){
            isRespond = true;
            assert(round == latestRound);
            if (isPay == 1 && now < ddlSettle){
                addr[0].send(A);
                addr[1].send(B);
                flag = 0;
                latestRound = 0;
                test2 = 222;
            }else {
                tFinal = ddlSettle + payoutPeriod;
            }
        }else if (msg.sender == addr[0] || msg.sender == addr[1]){
            if (isRespond == false && isAdd == false){
                tFinal = ddlSettle + payoutPeriod;
                isAdd = true;
            }
            assert(now > tFinal);
            assert(round == latestRound);
            addr[0].send(A);
            addr[1].send(B);
            flag = 0;
            latestRound = 0;
        }else {
            revert();
        }   
    }

    function challenge(bytes32 Hvalue, uint round, byte _v, bytes32 _r, bytes32 _s) {
        // assert(towerIden == data.verifytower(Hvalue, round, _v,  _r, _s));
        // assert(round > latestRound);
        if ((flag == 0 && round >= latestRound) || isRespond == false && now > ddlSettle){
            tower.withdraw(msg.sender);
            test3 = 888;
        }
        
    }
}
