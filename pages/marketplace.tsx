import Head from "next/head"
import { ethers } from "ethers"
import axios from "axios"
// eslint-disable-next-line camelcase
import { NFTMarket__factory } from "@typechain"
import { ITokenUri, InferNextProps } from "@types"

import { MarketplaceGrid } from "@components/MarketplaceGrid"

export const getServerSideProps = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider()
    const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, provider)
    const itemsRaw = await marketContract.fetchMarketListedItems()

    const items = await Promise.all(
      itemsRaw.map(async ({ tokenId, price, owner, isListed }) => {
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

    return {
      props: {
        items,
      },
    }
  } catch (e) {
    console.error(e)
  }

  return { notFound: true }
}

const Marketplace = (props: InferNextProps<typeof getServerSideProps>) => {
  const { items } = props

  return (
    <div>
      <Head>
        <title>Marketplace</title>
        <meta name="description" content="Marketplace" />
      </Head>

      <main>
        <MarketplaceGrid items={items} />
      </main>
    </div>
  )
}

export default Marketplace
