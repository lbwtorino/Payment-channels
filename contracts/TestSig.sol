pragma solidity ^0.4.3;

contract TestSig {
  address public owner;
  uint public last_completed_migration;

  function TestSig() public {
        owner = msg.sender;
    }

  address result;
  bytes32 h;
  function test(uint256 balA,  byte _v, bytes32 _r, bytes32 _s) public {
    

        // uint8 V = uint8(sigs[0]+27);
        // bytes32 R = bytes32(sigs[1]);
        // bytes32 S = bytes32(sigs[2]);
        // bytes32 _h = keccak256('\x19Ethereum Signed Message:\n32', keccak256(_image, _coins, address(this)));
        
        h = keccak256('\x19Ethereum Signed Message:\n32', keccak256(balA));
        // h = keccak256("10");

        result = verifySignature(h, uint8(_v), _r, _s);
    }

    function verifySignature(bytes32 h, uint8 v, bytes32 r, bytes32 s) returns (address){
        address _signer = ecrecover(h,v,r,s);
        return _signer;
    }

    function getInfor() public returns (address, bytes32){
       return (result, h);
    }


  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

}
