import { useState, useEffect } from "react"
import { ethers } from "ethers"
import axios from "axios"
// eslint-disable-next-line camelcase
import { NFTMarket__factory } from "@typechain"
import { IMarketItem, ITokenUri } from "@types"

import { Box } from "@mui/material"
import { ItemCard } from "@components/ItemCard"

export const MarketplaceGrid = () => {
  const [items, setItems] = useState<IMarketItem[]>([])
  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider()

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, provider)

      const allMarketListedItemsRaw = await marketContract.fetchMarketListedItems()

      const allMarketListedItems = await Promise.all(
        allMarketListedItemsRaw.map(async ({ tokenId, price, owner, isListed }) => {
          const tokenUri = await marketContract.tokenURI(tokenId)

          const response = await axios.get<ITokenUri>(tokenUri)

          const { name, imageUrl, description } = response?.data

          return {
            tokenId: tokenId.toString(),
            price: ethers.utils.formatUnits(price.toString(), "ether"),
            owner,
            name,
            imageUrl,
            description,
            isListed,
          }
        })
      )
      setItems(allMarketListedItems)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={2}>
      {items.map((item) => (
        <Box key={item.tokenId}>
          <ItemCard item={item} />
        </Box>
      ))}
    </Box>
  )
}
