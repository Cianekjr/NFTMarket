import { useState, useEffect } from "react"
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import axios from "axios"
// eslint-disable-next-line camelcase
import { NFTMarket__factory } from "@typechain"
import { IMarketItem, ITokenUri } from "@types"

import { Box, Typography } from "@mui/material"
import { ItemCard } from "@components/ItemCard"

export const ProfileGrid = () => {
  const [ownedItems, setOwnedItems] = useState<IMarketItem[]>([])

  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    try {
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, provider)

      const allMyOwnedItemsRaw = await marketContract.fetchOwnedItems(connection.selectedAddress)

      const allMyOwnedItems = await Promise.all(
        allMyOwnedItemsRaw.map(async ({ tokenId, price, owner, isListed }) => {
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
      setOwnedItems(allMyOwnedItems)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Box>
      <Typography variant="h4">My items</Typography>
      <Box
        display="grid"
        gap={2}
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: "1fr",
          [theme.breakpoints.up("sm")]: {
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          },
        })}
      >
        {ownedItems.map((item) => (
          <Box key={item.tokenId}>
            <ItemCard item={item} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
