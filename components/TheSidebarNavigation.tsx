import Link from "next/link"
import { Fragment } from "react"
import EditIcon from "@mui/icons-material/Edit"
import HomeIcon from "@mui/icons-material/Home"
import StorefrontIcon from "@mui/icons-material/Storefront"
import { List, Divider, Typography, ListItemButton, ListItemIcon, ListItem, ListItemText, SvgIcon } from "@mui/material"

const navigationItems = [
  {
    title: "NFTMarket",
    children: [
      {
        title: "Home",
        href: "/",
        icon: HomeIcon,
      },
      {
        title: "Marketplace",
        href: "/marketplace",
        icon: StorefrontIcon,
      },
      {
        title: "Creator",
        href: "/creator",
        icon: EditIcon,
      },
    ],
  },
]

export const TheSidebarNavigation = () => {
  return (
    <List>
      {navigationItems.map((item, index) => (
        <Fragment key={index}>
          <Typography
            sx={(theme) => ({
              typography: theme.typography.h5,
              pt: 2,
              pb: 1,
            })}
          >
            {item.title}
          </Typography>
          {item.children.map((child, index) => (
            <ListItem
              key={index}
              disableGutters
              sx={{
                py: 0.3,
              }}
            >
              <Link href={child.href} passHref>
                <ListItemButton
                  sx={{
                    px: 2,
                  }}
                  component="a"
                  className="group"
                >
                  <ListItemIcon>
                    <SvgIcon
                      component={child.icon}
                      sx={(theme) => ({
                        color: theme.palette.grey[700],
                      })}
                    />
                  </ListItemIcon>
                  <ListItemText
                    sx={(theme) => ({
                      typography: theme.typography.body1,
                      color: theme.palette.grey[700],
                      ".group:hover &": {
                        color: theme.palette.secondary.dark,
                      },
                    })}
                  >
                    {child.title}
                  </ListItemText>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <Divider
            sx={{
              mt: 1,
            }}
          />
        </Fragment>
      ))}
    </List>
  )
}
