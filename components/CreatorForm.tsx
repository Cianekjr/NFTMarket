import Image from "next/image"
import Web3Modal from "web3modal"
import { create as ipfsHttpClient } from "ipfs-http-client"
import { useRouter } from "next/router"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button, TextField, Grid, Paper } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"

import { CreatorFileInput } from "@components/CreatorFileInput"

// eslint-disable-next-line camelcase
import { NFTMarket__factory } from "@typechain"
import { ethers } from "ethers"

const ipfsClient = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" })

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  fileUrl: z.string().min(1),
})

type ICreatorForm = z.infer<typeof schema>

export const CreatorForm = () => {
  const { push } = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ICreatorForm>({
    defaultValues: {
      name: "",
      description: "",
      fileUrl: "",
    },
    mode: "onTouched",
    resolver: zodResolver(schema),
  })

  const fileUrl = watch("fileUrl")

  const onSubmit: SubmitHandler<ICreatorForm> = async (data) => {
    console.log("SUBMIT")
    try {
      const added = await ipfsClient.add(JSON.stringify(data))
      const url = `https://ipfs.infura.io/ipfs/${added.path}`

      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = NFTMarket__factory.connect(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string, signer)

      await marketContract.createToken(url)

      push("/marketplace")
    } catch (e) {
      console.error(e)
    }
  }

  const handleImageChange = async (file: File) => {
    try {
      const added = await ipfsClient.add(file)
      const fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`

      setValue("fileUrl", fileUrl)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Grid container spacing={2} component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={6}>
        <TextField
          required
          id="input-name"
          label="Name"
          variant="outlined"
          margin="dense"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          required
          id="input-description"
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          margin="dense"
          fullWidth
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <Button variant="contained" endIcon={<SendIcon />} aria-label="create nft" type="submit">
          Mint Token
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ p: 2, height: "300px", position: "relative" }}>
          {fileUrl ? (
            <Image src={fileUrl} layout="fill" alt="uploaded image" objectFit="contain" />
          ) : (
            <CreatorFileInput handleImageChange={handleImageChange} isError={!!errors.fileUrl} />
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}
