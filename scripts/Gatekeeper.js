const { network, deployments, ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const GatekeeperOne = await ethers.getContractFactory('GatekeeperOne')
    const gatekeeperOne = await GatekeeperOne.deploy()
    await gatekeeperOne.deployed()

    const gateKey = `0x100000000000${addr1.address.slice(-4)}`
    console.log(gateKey)

    const GatekeeperOneHack = await ethers.getContractFactory(
        'GatekeeperOneHack'
    )
    const gatekeeperOneHack = await GatekeeperOneHack.deploy(
        gateKey,
        gatekeeperOne.address
    )
    await gatekeeperOneHack.deployed()

    const hacker = await gatekeeperOne.connect(addr1)
    const hackerHack = await gatekeeperOneHack.connect(addr1)

    // ------------ let's hack -------------
    /* 
    tx.origin = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    uint16(tx.origin) = 0x79C8
    uint32(uint64(_gateKey) = 0x79C8 => _gateKey = 0xxxx xxxx xxxx 79C8
    
    uint32(uint64(_gateKey)) = xxxx xxxx 1111 79C8
    uint16(uint64(_gateKey)  = xxxx xxxx 1111 79C8

    uint32(uint64(_gateKey)) = 0xxx xxxx 1111 79C8
    uint64(_gateKey)         = 1xxx xxxx 1111 79C8
     */

    console.log(await hacker.entrant())
    // brut force
    mod = 8191
    gasToUse = 800000 //803144
    console.log(await hackerHack.s_gateKey())
    // await hackerHack.attack(803144 + (8191 - 8132))

    for (let i = 3000; i < mod; i++) {
        // console.log(`testing ${gasToUse + i}`)

        try {
            tx = await hackerHack.attack(gasToUse + i, {
                gasLimit: '1100000',
            })

            break
        } catch {}
    }
    console.log(await hacker.entrant())
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
