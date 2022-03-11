import { expect } from "chai"
import { ethers } from "hardhat"

describe("NFT Market", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    const listingPrice = (await market.getMarketListingPrice()).toString()

    const auctionPrice = ethers.utils.parseUnits("100", "ether")

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await market.createSalesOffer(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createSalesOffer(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const buyerAddress = (await ethers.getSigners())[1]

    await market.connect(buyerAddress).createPurchaseOffer(nftContractAddress, 1, { value: auctionPrice })

    const items = await market.fetchMarketAllItems()

    const readableItems = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        const item = {
          tokenId: i.tokenId.toString(),
          price: i.price.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      })
    )

    console.log(readableItems)
  })
})
