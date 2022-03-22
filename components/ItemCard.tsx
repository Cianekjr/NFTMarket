import Link from "next/link"
import { Button, Card, CardHeader, CardMedia, CardContent, CardActions, Typography } from "@mui/material"
import { ShoppingBasket as ShoppingBasketIcon } from "@mui/icons-material"
import { IMarketItem } from "@types"

interface IItemCard {
  item: IMarketItem
}

export const ItemCard = (props: IItemCard) => {
  const { item } = props

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader title={item.name} />
      <CardMedia component="img" height="194" image={item.imageUrl} alt={item.name} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`items/${item.tokenId}`} passHref>
          <Button component="a" aria-label="buy" size="large" variant="contained" endIcon={<ShoppingBasketIcon />} sx={{ width: "100%" }}>
            Open
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}
