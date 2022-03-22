import { useState, useEffect } from "react"
import Web3Modal from "web3modal"
import { ethers } from "ethers"

import { AppBar, Toolbar, IconButton, Button, Box, NoSsr } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Menu as MenuIcon, Person as PersonIcon, AccountBalanceWallet as AccountBalanceWalletIcon } from "@mui/icons-material"
import Link from "next/link"

interface Props {
  toggleDrawer: () => void
}

export const TheHeader = (props: Props) => {
  const { toggleDrawer } = props
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const loadUserWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const connectedAccounts = await provider.listAccounts()

      if (connectedAccounts.some((acc) => acc.toLowerCase() === window.ethereum.selectedAddress)) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()

        setWalletAddress(connection.selectedAddress)
      }
    }
  }

  useEffect(() => {
    loadUserWallet()
  }, [])

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()

      setWalletAddress(connection.selectedAddress)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <Box sx={{ marginLeft: "auto" }}>
          <NoSsr defer>
            {walletAddress ? (
              <Link href="/profile" passHref>
                <Button component="a" variant="contained" startIcon={<PersonIcon />} color="error" size="large">
                  Profile
                </Button>
              </Link>
            ) : (
              <LoadingButton
                loading={isLoading}
                loadingPosition="start"
                startIcon={<AccountBalanceWalletIcon />}
                variant="contained"
                color="error"
                size="large"
                onClick={handleConnect}
              >
                Connect
              </LoadingButton>
            )}
          </NoSsr>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
