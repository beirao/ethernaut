/*
602a    // v: push1 0x2a (value is 0x2a)
6000    // p: push1 0x00 (memory slot is 0x00)
52      // mstore
6020    // s: push1 0x20 (value is 32 bytes in size)
6000    // p: push1 0x00 (value was stored in slot 0x00)
f3      // return
 */
import './MagicNum.sol';

contract MagicNumHack {
    MagicNum public magicNum;

    constructor(address _addr) {
        magicNum = MagicNum(_addr);
    }

    function attack() public {
        bytes memory bytecode = hex'600a600c600039600a6000f3602a60005260206000f3';
        bytes32 salt = 0;
        address solver;

        assembly {
            solver := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        magicNum.setSolver(solver);
    }
}
