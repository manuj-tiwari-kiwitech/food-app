import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, selectCartItems } from '../features/cart/cartSlice';
import { addItem, removeItem } from '../features/shortlist/shortlistSlice';
import { Recipe } from '../types/Recipe';
import { Card, CardActions, CardContent, CardMedia, Typography, IconButton, Tooltip, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface RecipeCardProps {
  recipe: Recipe;
  isShortlisted: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isShortlisted }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const cartItem = cartItems.find(item => item.recipe.id === recipe.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart(recipe));
  };

  const handleRemoveFromCart = () => {
    if (quantity > 0) {
      dispatch(removeFromCart(recipe.id));
    }
  };

  const handleToggleShortlist = () => {
    if (isShortlisted) {
      dispatch(removeItem(recipe.id));
    } else {
      dispatch(addItem(recipe));
    }
  };

  const getUrl = (image: string) => {
    let newImg = image;

    try {
        if (image.includes('[')) {
            const parsedArray = JSON.parse(image);
            if (Array.isArray(parsedArray)) {
                newImg = parsedArray[0];
            }
        }
    } catch (error) {
        console.error('Error parsing image URL:', error);
    }

    return newImg;
}

  return (
    <Card>
      <CardMedia
        component="img"
        height="400"
        image={getUrl(recipe.images[0])}
        alt={recipe.title}
      />
      <CardContent>
        <Typography style={{ height: '65px' }} gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Tooltip title={recipe.description} arrow>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {recipe.description}
          </Typography>
        </Tooltip>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleAddToCart}>
          <AddIcon />
        </IconButton>
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            minWidth: '2rem',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '0.5rem',
          }}
        >
          {quantity}
        </Box>
        <IconButton onClick={handleRemoveFromCart} disabled={quantity === 0}>
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={handleToggleShortlist}>
          <FavoriteIcon color={isShortlisted ? 'error' : 'inherit'} />
        </IconButton>
      </CardActions>
    </Card>
  );
};
