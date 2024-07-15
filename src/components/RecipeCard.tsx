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

  // Function to remove items from cart
  const handleRemoveFromCart = () => {
    if (quantity > 0) {
      dispatch(removeFromCart(recipe.id));
    }
  };

  // Function to shortlist unshortlist items from cart 
  const handleToggleShortlist = () => {
    if (isShortlisted) {
      dispatch(removeItem(recipe.id));
    } else {
      dispatch(addItem(recipe));
    }
  };

  //  Function to handle image URL from API data 

  const getUrl = (image: string) => {
    let newImg = image;
  
    try {
      // Check if the image string contains '[' which indicates an array
      if (image.includes('[')) {
        // Remove any leading or trailing quotes and brackets
        const cleanedImage = image.replace(/(^[\[\"]+|[\]\"]+$)/g, '');
        const parsedArray = JSON.parse(`[${cleanedImage}]`);
        if (Array.isArray(parsedArray)) {
          newImg = parsedArray[0];
        }
      } else if (image.includes('\"')) {
        // If the image string contains only quotes, remove them
        newImg = image.replace(/\"/g, '');
      }
    } catch (error) {
      console.error('Error parsing image URL:', error);
    }
    console.log(newImg, 'newImgnewImg')
  
    return newImg;
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="400"
        image={getUrl(recipe.images[1])}
        alt={recipe.title}
      />
      <CardContent>
      <Tooltip title={recipe.title} arrow>
        <Typography style={{ height: '65px', lineClamp: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        </Tooltip>
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
        <Typography variant="h6" color="text.primary" style={{ marginTop: '10px' }}>
          ${recipe.price.toFixed(2)}
        </Typography>
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
