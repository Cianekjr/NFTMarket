import { expect } from "chai"
import hre from "hardhat"
import { NFTMarket } from "@typechain"

const { ethers } = hre

describe("NFT Market", function () {
  let market: NFTMarket

  beforeEach(async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    market = await Market.deploy()
    await market.deployed()
  })

  it("Should track minted token", async function () {
    await market.createToken("https://www.nft.com/1")
    await market.createToken("https://www.nft.com/2")

    const items = await market.fetchMarketAllItems()

    expect(items.length).to.equal(2)
  })

  it("Should mint token and assign the owner", async function () {
    const { value: tokenId } = await market.createToken("https://www.mytokenlocation.com")

    const item = await market.getItem(tokenId)

    const signerAddress = await ethers.provider.getSigner(0).getAddress()

    expect(item.owner).to.equal(signerAddress)
  })

  it("Should be able to put item up for sale", async function () {
    const { value: tokenId } = await market.createToken("https://www.nft.com/1")

    const itemPrev = await market.getItem(tokenId)
    expect(itemPrev.isListed).to.equal(false)

    const ITEM_PRICE = "1.0"

    await market.createSalesOffer(tokenId, ethers.utils.parseEther(ITEM_PRICE))

    const itemNext = await market.getItem(tokenId)
    expect(itemNext.isListed).to.equal(true)

    expect(ethers.utils.formatEther(itemNext.price)).to.equal(ITEM_PRICE)
  })

  it("Should be able to buy token", async function () {
    const signer1 = ethers.provider.getSigner(1)
    const signer1Market = market.connect(signer1)
    const { value: tokenId } = await signer1Market.createToken("https://www.nft.com/1")

    const ITEM_PRICE = "1.0"
    await signer1Market.createSalesOffer(tokenId, ethers.utils.parseEther(ITEM_PRICE))

    const signer2 = ethers.provider.getSigner(2)
    const signer2Address = await signer2.getAddress()
    const signer2Market = market.connect(signer2)

    await signer2Market.createPurchaseOffer(tokenId, { value: ethers.utils.parseEther(ITEM_PRICE) })

    const item = await market.getItem(tokenId)

    expect(item.isListed).to.equal(false)
    expect(item.owner).to.equal(signer2Address)
  })

  it("Should be able to change listed item price", async function () {
    const { value: tokenId } = await market.createToken("https://www.nft.com/1")

    const ITEM_PRICE = "1.0"
    await market.createSalesOffer(tokenId, ethers.utils.parseEther(ITEM_PRICE))

    const ITEM_PRICE_NEW = "2.0"
    await market.changeSalesOfferPrice(tokenId, ethers.utils.parseEther(ITEM_PRICE_NEW))

    const item = await market.getItem(tokenId)

    expect(ethers.utils.formatEther(item.price)).to.equal(ITEM_PRICE_NEW)
  })

  it("Should be able to cancel listed item", async function () {
    const signer1 = ethers.provider.getSigner(1)
    const signer1Address = await signer1.getAddress()

    const signer1Market = market.connect(signer1)
    const { value: tokenId } = await signer1Market.createToken("https://www.nft.com/1")

    const ITEM_PRICE = "1.0"
    await signer1Market.createSalesOffer(tokenId, ethers.utils.parseEther(ITEM_PRICE))

    await signer1Market.cancelSalesOffer(tokenId)

    const item = await signer1Market.getItem(tokenId)

    expect(item.isListed).to.equal(false)
    expect(item.owner).to.equal(signer1Address)
  })

  it("Should return all my items", async function () {
    const signer1 = ethers.provider.getSigner(1)
    const signer1Address = await signer1.getAddress()
    const signer1Market = market.connect(signer1)

    await signer1Market.createToken("https://www.nft.com/1")
    await signer1Market.createToken("https://www.nft.com/2")

    const signer2 = ethers.provider.getSigner(2)
    const signer2Address = await signer2.getAddress()
    const signer2Market = market.connect(signer2)

    await signer2Market.createToken("https://www.nft.com/3")

    const signer1MarketItems = await signer1Market.fetchOwnedItems(signer1Address)
    expect(signer1MarketItems.length).to.equal(2)

    const signer2MarketItems = await signer2Market.fetchOwnedItems(signer2Address)
    expect(signer2MarketItems.length).to.equal(1)
  })
})
