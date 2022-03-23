import { IMarketItem } from "@types"

import { Box } from "@mui/material"
import { ItemCard } from "@components/ItemCard"

interface IProps {
  items: IMarketItem[]
}

export const MarketplaceGrid = (props: IProps) => {
  const { items } = props

  return (
    <Box
      display="grid"
      gap={2}
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: "1fr",
        [theme.breakpoints.up("sm")]: {
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        },
      })}
    >
      {items.map((item) => (
        <ItemCard item={item} key={item.tokenId} />
      ))}
    </Box>
  )
}
