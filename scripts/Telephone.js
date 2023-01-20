const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Deployer : ", owner.address);

  const Telephone = await ethers.getContractFactory("Telephone");
  const TelephoneHack = await ethers.getContractFactory("TelephoneHack");

  const telephone = await Telephone.deploy();
  const telephoneHack = await TelephoneHack.deploy(telephone.address);

  await telephone.deployed();
  await telephoneHack.deployed();

  const hacker = await telephoneHack.connect(addr1);

  // ------------ let's hack -------------

  await hacker.Attack();

  console.log(await telephone.owner());
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
