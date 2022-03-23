import { useEffect, useState } from "react"
import Image from "next/image"
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { If, Then, Else, When } from "react-if"
// eslint-disable-next-line camelcase
import { NFTMarket__factory } from "@typechain"
import { IMarketItem } from "@types"

import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Grid, Box, Typography, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { ShoppingBag as ShoppingBagIcon, Sell as SellIcon, CurrencyExchange as CurrencyExchangeIcon, Cancel as CancelIcon } from "@mui/icons-material"
import { Ether as EtherIcon } from "@components/Icons"

const schema = z.object({
  price: z.string().min(1),
})

type ISaleForm = z.infer<typeof schema>

interface IItemProfileProps {
  item: IMarketItem
}

export const ItemProfile = (props: IItemProfileProps) => {
  const { item } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ISaleForm>({
    defaultValues: {
      price: item.isListed ? item.price : "0",
    },
    mode: "onTouched",
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const isItemOwner = item.owner.toLowerCase() === window.ethereum?.selectedAddress
    setIsOwner(isItemOwner)
  }, [item.owner])

  const handlePurchase = async () => {
    try {
      setIsLoading(true)
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, signer)

      await marketContract.createPurchaseOffer(item.tokenId, { value: ethers.utils.parseEther(item.price) })
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePutOnSales: SubmitHandler<ISaleForm> = async ({ price }) => {
    try {
      setIsLoading(true)
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, signer)

      await marketContract.createSalesOffer(item.tokenId, ethers.utils.parseEther(price))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const changeSalesPrice: SubmitHandler<ISaleForm> = async ({ price }) => {
    try {
      setIsLoading(true)
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, signer)

      await marketContract.changeSalesOfferPrice(item.tokenId, ethers.utils.parseEther(price))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelListing = async () => {
    try {
      setIsLoading(true)
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, signer)

      await marketContract.cancelSalesOffer(item.tokenId)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
      <Grid item xs={1}>
        <Grid container spacing={2} columns={{ xs: 1 }}>
          <Grid item xs={1}>
            <Box sx={{ minHeight: "300px", position: "relative", borderRadius: 4, overflow: "hidden" }}>
              <Image src={item.imageUrl} layout="fill" alt="uploaded image" objectFit="cover" />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <Grid container spacing={2} columns={{ xs: 1 }}>
          <Grid item xs={1}>
            <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.4)", p: 2, borderRadius: 4 }}>
              <Typography variant="h4">
                {item.name} #{item.tokenId}
              </Typography>
              <Typography variant="body1">{item.description}</Typography>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.4)", p: 2, borderRadius: 4 }}>
              <If condition={item.isListed}>
                <Then>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Current price
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EtherIcon fontSize="large" />
                    <Typography variant="h5">{item.price}</Typography>
                  </Box>
                </Then>
                <Else>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Item not listed
                  </Typography>
                </Else>
              </If>

              <If condition={isOwner}>
                <Then>
                  <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(item.isListed ? changeSalesPrice : handlePutOnSales)}
                    sx={{ mb: 1 }}
                  >
                    <TextField
                      required
                      id="input-price"
                      label="Price"
                      variant="outlined"
                      margin="dense"
                      type="number"
                      size="small"
                      inputProps={{ step: 0.1, min: 0 }}
                      {...register("price")}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      fullWidth
                      sx={{}}
                    />
                    <LoadingButton
                      loading={isLoading}
                      loadingPosition="start"
                      startIcon={item.isListed ? <CurrencyExchangeIcon /> : <SellIcon />}
                      variant="contained"
                      color="secondary"
                      size="large"
                      type="submit"
                      fullWidth
                      aria-label={item.isListed ? "change price" : "List now"}
                    >
                      {item.isListed ? "Change price" : "List now"}
                    </LoadingButton>
                  </Box>
                  <When condition={item.isListed}>
                    <LoadingButton
                      loading={isLoading}
                      loadingPosition="start"
                      startIcon={<CancelIcon />}
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      onClick={cancelListing}
                      aria-label="cancel listing"
                    >
                      Cancel listing
                    </LoadingButton>
                  </When>
                </Then>
                <Else>
                  <When condition={item.isListed}>
                    <LoadingButton
                      loading={isLoading}
                      loadingPosition="start"
                      startIcon={<ShoppingBagIcon />}
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      onClick={handlePurchase}
                      aria-label="buy item"
                    >
                      Buy
                    </LoadingButton>
                  </When>
                </Else>
              </If>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
