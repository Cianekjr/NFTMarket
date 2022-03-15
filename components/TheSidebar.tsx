import { Drawer, Toolbar, useMediaQuery, Theme, Box } from "@mui/material"
import PerfectScrollbar from "react-perfect-scrollbar"
import { TheSidebarNavigation } from "@components/TheSidebarNavigation"

interface Props {
  isOpened: boolean
  drawerWidth: number
}

export const TheSidebar = (props: Props) => {
  const { isOpened, drawerWidth } = props

  const isLowerThanMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  return (
    <Drawer
      variant={isLowerThanMd ? "temporary" : "persistent"}
      open={isOpened}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
      }}
      PaperProps={{
        sx: {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          overflowY: "hidden",
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Toolbar />
      <Box
        sx={{
          overflowY: "auto",
          pl: 2,
        }}
      >
        <PerfectScrollbar options={{ handlers: ["drag-thumb", "keyboard", "wheel", "touch"] }}>
          <Box
            sx={{
              pr: 2,
            }}
          >
            <TheSidebarNavigation />
          </Box>
        </PerfectScrollbar>
      </Box>
    </Drawer>
  )
}
