import { Button, Card, CardHeader, CardMedia, CardContent, CardActions, Typography } from "@mui/material"
import { ShoppingBasket as ShoppingBasketIcon } from "@mui/icons-material"

interface IItemCard {
  name: string
  imageUrl: string
  description: string
}

export const ItemCard = (props: IItemCard) => {
  const { name, imageUrl, description } = props

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader title={name} />
      <CardMedia component="img" height="194" image={imageUrl} alt={name} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button aria-label="buy" size="large" variant="contained" endIcon={<ShoppingBasketIcon />} sx={{ width: "100%" }}>
          Buy
        </Button>
      </CardActions>
    </Card>
  )
}
