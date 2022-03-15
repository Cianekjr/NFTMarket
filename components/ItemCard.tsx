import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"

interface IItemCard {
  title: string
  imageUrl: string
  description: string
}

export const ItemCard = ({ title, imageUrl, description }: IItemCard) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader title={title} />
      <CardMedia component="img" height="194" image={imageUrl} alt={title} />
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
