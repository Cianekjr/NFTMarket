import hre from "hardhat"

const { ethers } = hre

async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket")
  const market = await NFTMarket.deploy()
  await market.deployed()

  const MIN_PRICE = 1
  const MAX_PRICE = 10

  {
    const signer0 = ethers.provider.getSigner(0)
    const signer0Market = market.connect(signer0)

    await signer0Market.createToken("https://bafybeihaicpfbtzt5gy4comsvxnjetjiwkje54fl3kxejecpaogxoutkt4.ipfs.infura-ipfs.io/")
    await signer0Market.createToken("https://bafybeidob7eeeek3m2qvod32rtqautgbqnsp23jrdvdwse6d6nxv2dxfwu.ipfs.infura-ipfs.io/")
    await signer0Market.createToken("https://bafybeiagjo7rjslj37hgozb2n5kgv2pdhfvace46hkgs4h3ifpmy2xgfsi.ipfs.infura-ipfs.io/")
    await signer0Market.createToken("https://bafybeiap2zq3dar37elcowbuh7lshxpc6zxzsbnbifjajpb34qk6pplbmi.ipfs.infura-ipfs.io/")
    await signer0Market.createToken("https://bafybeigdqw33623v3tleesfjexero7iwpsuosbe3kt6eth7schujezjd24.ipfs.infura-ipfs.io/")
    await signer0Market.createToken("https://bafybeihaicpfbtzt5gy4comsvxnjetjiwkje54fl3kxejecpaogxoutkt4.ipfs.infura-ipfs.io/")

    const allItems = await signer0Market.fetchMarketAllItems()

    allItems.forEach(async (item, index) => {
      if (index % 2 === 0 && !item.isListed) {
        const randomNumber = Math.floor(Math.random() * (MAX_PRICE - MIN_PRICE + 1)) + MIN_PRICE
        await signer0Market.createSalesOffer(item.tokenId, ethers.utils.parseEther(String(randomNumber)))
      }
    })
  }

  {
    const signer1 = ethers.provider.getSigner(1)
    const signer1Market = market.connect(signer1)

    await signer1Market.createToken("https://bafybeihvt3qsivftsdvez77gd5lqv7y7i7iet44pjobyhvmqqjllacukwy.ipfs.infura-ipfs.io/")
    await signer1Market.createToken("https://bafybeibkhl5u4dfqlcwauah7mubeyh6tqsxr7zohafojlgvvtu4wcjel5q.ipfs.infura-ipfs.io/")
    await signer1Market.createToken("https://bafybeif4kpdfxelinnw7h3eefilkyeso6lws4a56hatkn7qvjyjikc7rf4.ipfs.infura-ipfs.io/")
    await signer1Market.createToken("https://bafybeih3fpqvuls6xqehxcq7z5t72pgydvitfse3ubf7xpafq5gkl5q2ge.ipfs.infura-ipfs.io/")
    await signer1Market.createToken("https://bafybeifvwh5ncmzzrxasznlipbncktd3yrsyecjssininpj3vyedw5vpvi.ipfs.infura-ipfs.io/")

    const allItems = await signer1Market.fetchMarketAllItems()

    allItems.forEach(async (item, index) => {
      if (index % 2 === 0 && !item.isListed) {
        const randomNumber = Math.floor(Math.random() * (MAX_PRICE - MIN_PRICE + 1)) + MIN_PRICE
        await signer1Market.createSalesOffer(item.tokenId, ethers.utils.parseEther(String(randomNumber)))
      }
    })
  }

  console.log("NFTMarket deployed to:", market.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
