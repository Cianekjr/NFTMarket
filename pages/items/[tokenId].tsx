import type { GetServerSidePropsContext } from "next"
import Head from "next/head"
import { ethers } from "ethers"
import axios from "axios"
// eslint-disable-next-line camelcase
import { NFTMarket__factory } from "@typechain"
import { ITokenUri, InferNextProps } from "@types"

import { ItemProfile } from "@components/ItemProfile"

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const { tokenId } = query

  if (typeof tokenId !== "string") {
    return { notFound: true }
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider()
    const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, provider)
    const item = await marketContract.getItem(tokenId)

    if (item) {
      const { tokenId, price, owner, isListed } = item
      const tokenUri = await marketContract.tokenURI(Number(tokenId))
      const response = await axios.get<ITokenUri>(tokenUri)
      const { name, imageUrl, description } = response?.data

      return {
        props: {
          item: {
            tokenId: tokenId.toString(),
            price: ethers.utils.formatEther(price.toString()),
            owner,
            name,
            imageUrl,
            description,
            isListed,
          },
        },
      }
    }
  } catch (e) {
    console.error(e)
  }

  return { notFound: true }
}

const Item = (props: InferNextProps<typeof getServerSideProps>) => {
  const { item } = props

  return (
    <div>
      <Head>
        <title>Item</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main>
        <ItemProfile item={item} />
      </main>
    </div>
  )
}

export default Item