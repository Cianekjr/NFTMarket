import type { AppProps } from "next/app"
import { useState } from "react"
import Head from "next/head"

import { Box, Toolbar, CssBaseline } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

import { TheHeader } from "@components/TheHeader"
import { TheSidebar } from "@components/TheSidebar"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const theme = createTheme({
  direction: "ltr",
  components: {
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const [isOpened, setIsOpened] = useState(true)

  const toggleDrawer = () => {
    setIsOpened((isOpened) => !isOpened)
  }

  const drawerWidth = 240

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>NFT Market</title>
        <meta name="description" content="NFT Marketplace is a place for trading ethereum nfts" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      </Head>

      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <TheHeader toggleDrawer={toggleDrawer} />
        <TheSidebar isOpened={isOpened} drawerWidth={drawerWidth} />

        <Box
          component="main"
          sx={{
            marginLeft: {
              md: isOpened ? 0 : `-${drawerWidth}px`,
            },
            flexGrow: 1,
            p: 3,
          }}
        >
          <Toolbar />
          <Box
            sx={{
              bgcolor: "primary.light",
              borderRadius: 5,
              p: 3,
            }}
          >
            <Component {...pageProps} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default MyApp
