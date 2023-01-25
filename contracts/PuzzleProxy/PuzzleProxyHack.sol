// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PuzzleProxy.sol";

contract Hack {
    address public owner;

    function ownerChange() public {
        owner = msg.sender;
    }
}

contract PuzzleProxyHack is PuzzleProxy {
    Hack hack;
    constructor() {
        hack = new Hack();
    }

    function _implementation() internal view override returns (address){
        return hack.address;
    }
}