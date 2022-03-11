import hre from 'hardhat'

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket")
  const nftMarket = await NFTMarket.deploy()
  await nftMarket.deployed()

  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.deploy(nftMarket.address)
  await nft.deployed()

  console.log("NFTMarket deployed to:", nftMarket.address);
  console.log("NFT deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
