import hre from "hardhat"

const { ethers } = hre

async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket")
  const market = await NFTMarket.deploy()
  await market.deployed()

  const signer1 = ethers.provider.getSigner(1)
  const signer1Market = market.connect(signer1)

  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")
  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")
  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")
  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")
  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")
  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")
  await signer1Market.createToken("https://ipfs.infura.io/ipfs/QmbVtUHc78DKRZUg4e8vMnCRUvNw1Ds3zHmb4HbMUKBYuc")

  const allItems = await signer1Market.fetchMarketAllItems()

  const MIN_PRICE = 1
  const MAX_PRICE = 10

  allItems.forEach(async (item, index) => {
    if (index % 2 === 0 && !item.isListed) {
      const randomNumber = Math.floor(Math.random() * (MAX_PRICE - MIN_PRICE + 1)) + MIN_PRICE
      await signer1Market.createSalesOffer(item.tokenId, ethers.utils.parseEther(String(randomNumber)))
    }
  })

  console.log("NFTMarket deployed to:", market.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
