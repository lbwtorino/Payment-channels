# Payment-channels
Fail-safe watchtower and short-lived assertions for payment channels, AsiaCCS'2020

## Pre-installation

- [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation) framework, v4.1.15 (core: 4.1.15, stricyly), to enable Ethereum log and event mechanism.
- [Solidity](https://docs.soliditylang.org/en/v0.7.4/) compiler, v0.4.25 (solc-js, or below, which is stricyly), due to some changes in ECDSA signature scheme in Solidity's higher versions.
- [Ganache](https://www.trufflesuite.com/ganache)
- Others: python, nodeJS, make, etc,. (to update)

## Architecture

`/contracts/Channel.sol` is a mimic Payment channel smart contract solidity code,

`/contracts/Tower.sol` is a mimic Watchtower smart contract solidity code,

`/contracts/Short.sol` is a mimic smart contract for short-lived assertions demonstration,

`/migrations` contains deployment on testnet code,

`/Party` mimics two parties, Alice and Bob,

`/Tower` is a mimic watchtower node,

## Test

`/run` includes the test use cases, you may play around, and define your own test case by following the syntax of Truffle+Ganache.

For instance, to test the number of 1 channel's termination, by running `./run.sh channel1`. Similarly, testing the termination for 10 channels, running 
`./run.sh channel1`

To test the dispute, running `./run.sh dispute`.

## Contact

Bowen: bowen_liu@mymail.sutd.edu.sg 



