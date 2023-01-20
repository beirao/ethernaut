const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const GatekeeperTwo = await ethers.getContractFactory('GatekeeperTwo')
    const gatekeeperTwo = await GatekeeperTwo.deploy()
    await gatekeeperTwo.deployed()

    const hacker = await gatekeeperTwo.connect(addr1)

    console.log(await hacker.entrant())

    const GatekeeperTwoHack = await ethers.getContractFactory('GatekeeperTwoHack')
    const gatekeeperTwoHack = await GatekeeperTwoHack.connect(addr1).deploy(gatekeeperTwo.address)
    await gatekeeperTwoHack.deployed()

    const hackerHack = await gatekeeperTwoHack.connect(addr1)

    // ------------ let's hack -------------

    // a ^ b = c <=> a ^ c = b

    console.log(await hacker.entrant())
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
