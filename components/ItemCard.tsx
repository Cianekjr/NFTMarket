import Link from "next/link"
import { Button, Card, CardHeader, CardMedia, CardContent, CardActions, Typography, Chip, Box, Skeleton } from "@mui/material"
import { IMarketItem } from "@types"
import { When } from "react-if"

interface IItemCard {
  item: IMarketItem
}

export const ItemCard = (props: IItemCard) => {
  const { item } = props

  return (
    <Card sx={{ width: "100%", display: "grid", gridTemplateRows: "min-content min-content auto min-content" }}>
      <CardHeader title={item.name} />
      <CardMedia component="img" height="194" image={item.imageUrl} alt={item.name} />
      <CardContent>
        <When condition={item.isListed}>
          <Box sx={{ pb: 1, pl: 1, float: "right" }}>
            <Chip label="Listed" variant="outlined" color="secondary" size="small" />
          </Box>
        </When>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/items/${item.tokenId}`} passHref>
          <Button component="a" aria-label="buy" size="large" variant="contained" sx={{ width: "100%" }}>
            Open
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}

export const ItemCardSkeleton = () => (
  <Card sx={{ width: "100%" }}>
    <CardHeader title={<Skeleton variant="text" />} />
    <Skeleton variant="rectangular" width="100%" height={194} />
    <CardContent>
      <Skeleton variant="text" height={100} />
    </CardContent>
    <CardActions>
      <Skeleton variant="rectangular" width="100%" height={42} />
    </CardActions>
  </Card>
)
