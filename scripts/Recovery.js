const { network, deployments, ethers, getNamedAccounts } = require('hardhat')
const { TASK_COMPILE_TRANSFORM_IMPORT_NAME } = require('hardhat/builtin-tasks/task-names')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const Recovery = await ethers.getContractFactory('Recovery')
    const recovery = await Recovery.deploy()
    await recovery.deployed()
    await recovery.generateToken('ouiToken', 1000000)

    const hacker = await recovery.connect(addr1)

    // ------------ let's hack -------------
    console.log(recovery.address)

    const recomputedContractAddress = ethers.utils.getContractAddress({
        from: recovery.address,
        nonce: ethers.BigNumber.from(`2`),
    })

    console.log(recomputedContractAddress)
    console.log(await ethers.provider.getBalance(addr1.address))

    const SimpleToken = await ethers.getContractFactory('SimpleToken')

    const hackerHack = await SimpleToken.connect(addr1)

    // await hackerHack.destroy(addr1.address)
    console.log(await ethers.provider.getBalance(addr1.address))
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
