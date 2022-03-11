import type { AppProps } from "next/app"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import axios from "axios"
import { TheHeader } from "../components/TheHeader/TheHeader"

import { NFT__factory, NFTMarket__factory, NFT, NFTMarket } from "../typechain"

function MyApp({ Component, pageProps }: AppProps) {
  const [items, setItems] = useState<IMarketItem[]>([])
  useEffect(() => {
    loadNFTs()
  }, [])

  interface IMarketItem {
    tokenId: string
    price: string
    seller: string
    owner: string
    name: string
    image: string
    description: string
  }

  interface ITokenUri {
    name: string
    image: string
    description: string
  }

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider()

    // const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_ADDRESS || '', JSON.stringify(NFT__factory.abi), provider) as NFT
    // const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS || '', JSON.stringify(NFTMarket__factory.abi), provider) as NFTMarket

    // const allMarketItemsRaw = await marketContract.fetchMarketAllItems()

    // const allMarketItems = await Promise.all(
    //   allMarketItemsRaw.map(async ({ tokenId, price, seller, owner }) => {
    //     const tokenUri = await tokenContract.tokenURI(tokenId)
    //     const { name, image, description } = await axios.get<never, ITokenUri>(tokenUri)

    //     return {
    //       tokenId: tokenId.toString(),
    //       price: ethers.utils.formatUnits(price.toString(), 'ether'),
    //       seller,
    //       owner,
    //       name,
    //       image,
    //       description
    //     }
    //   })
    // )

    // setItems(allMarketItems)
  }

  return (
    <>
      <TheHeader />
      {items.map((item) => (
        <div key={item.tokenId}>{item.tokenId}</div>
      ))}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
