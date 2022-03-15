import hre from "hardhat"

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket")
  const nftMarket = await NFTMarket.deploy()
  await nftMarket.deployed()

  console.log("NFTMarket deployed to:", nftMarket.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
