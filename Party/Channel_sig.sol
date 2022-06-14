pragma solidity >=0.4.21 <0.6.0;
import "./Tower.sol";
import "./imported/verify.sol";
import "./imported/strings.sol";
pragma experimental "ABIEncoderV2";
contract Channel {

    // verify.Data data;
    // using verify for verify.Data;
    using strings for *;
    // using verify for *;
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
    address t1;
    address t2;
    bytes32 t3;
    bytes32 t4;
    bytes32 t5;
    bytes t6;

    function getInfor() public returns (uint, uint, address,address, bytes32, bytes32,bytes32,string, bytes){
       return (test1,test2,t1,t2, t3,t4, t5, whole, t6);
    }

    event Closure(uint A, uint B, uint round, uint random, address cid);

    function terminate(uint A, uint B, uint round, uint random, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 1);
        // assert(identity[addr[1]] == data.verifyidentity(A, B, round, random, _v[1],  _r[1], _s[1]));
        assert(identity[addr[0]] == verifyidentity(A, B, round, random, _v[0],  _r[0], _s[0]));
        // this recreates the message that was signed on the client
        bytes32 ttt = keccak256(abi.encodePacked(A, B, random));
        bytes32 message = prefixed(keccak256(abi.encodePacked(ttt, round)));
        t1 = identity[addr[0]];
        t2 = ecrecover(message, uint8(_v[0]),  _r[0], _s[0]);
        t4 = ttt;
        t5 = keccak256(second_);
        t6 = abi.encodePacked(A, B, random);
        // require(recoverSigner(message, signature) == owner);
        flag = 3;
        latestRound = round;
        latestA = A;
        latestB = B;
        ddlSettle = now + settlePeriod;
        tower.close(this, A, B, round);
        isRespond = false;
        emit Closure(A, B, round, random, this);
        test1 = 112;
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function dispute(uint A, uint B, uint round, uint random, byte[] _v, bytes32[] _r, bytes32[] _s) {
        assert(flag == 3);
        assert(now <= ddlSettle + payoutPeriod);
        // assert(round > latestRound);
        // assert(identity[addr[1]] == data.verifyidentity(A, B, round, random, _v[1],  _r[1], _s[1]));
        // assert(identity[addr[0]] == data.verifyidentity(A, B, round, random, _v[0],  _r[0], _s[0]));
        if (round > latestRound){
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

    // struct Data {
    //     string  len_message;
    //     string  whole;
    //     string  first_;
    //     string  second_;
    //     string  third_;
    // }

    // function uint2str(uint i) private returns (string memory){
    //     if (i == 0) return "0";
    //     uint j = i;
    //     uint length;
    //     while (j != 0){
    //         length++;
    //         j /= 10;
    //     }
    //     bytes memory bstr = new bytes(length);
    //     uint k = length - 1;
    //     while (i != 0){
    //         bstr[k--] = byte(48 + i % 10);
    //         i /= 10;
    //     }
    //     return string(bstr);
    // }

    // function bytes32string(bytes32 b32) private returns (string out) {
    //     bytes memory s = new bytes(64);
    //     for (var i = 0; i < 32; i++) {
    //         byte b = byte(b32[i]);
    //         byte hi = byte(uint8(b) / 16);
    //         byte lo = byte(uint8(b) - 16 * uint8(hi));
    //         s[i*2] = char(hi);
    //         s[i*2+1] = char(lo);            
    //     }
    //     out = string(s);
    // }

    // function char(byte b) private returns (byte c) {
    //     if (b < 10) 
    //         return byte(uint8(b) + 0x30);
    //     else 
    //         return byte(uint8(b) + 0x57);
    // }

    string  len_message;
    string  whole;
    string  first_;
    string  second_;
    string  third_;

    function verifyidentity(uint A, uint B, uint round, uint random, byte _v, bytes32 _r, bytes32 _s) public returns (address) {
        first_ = verify.uint2str(A).toSlice().concat(verify.uint2str(B).toSlice());
        second_ = first_.toSlice().concat(verify.uint2str(random).toSlice());
        third_ = verify.bytes32string(keccak256(second_)).toSlice().concat(verify.uint2str(round).toSlice());
        len_message = verify.uint2str(third_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(len_message.toSlice());
        whole = pref1.toSlice().concat(third_.toSlice());  
        t3 = keccak256(whole);  
        return ecrecover(keccak256(whole), uint8(_v), _r, _s);
    }
}
