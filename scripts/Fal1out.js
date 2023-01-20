const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Deployer : ", owner.address);

  const Fallback = await ethers.getContractFactory("Fallback");
  const fallback = await Fallback.deploy();

  await fallback.deployed();

  const hacker = fallback.connect(addr1);

  // ------------ let's hack -------------
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
