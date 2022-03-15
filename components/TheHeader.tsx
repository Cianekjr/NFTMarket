import { AppBar, Toolbar, IconButton, Typography } from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"

interface Props {
  toggleDrawer: () => void
}

export const TheHeader = (props: Props) => {
  const { toggleDrawer } = props

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
        <Typography variant="h6" noWrap component="div">
          Mini variant drawer
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
