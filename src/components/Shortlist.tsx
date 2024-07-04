import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectShortlistItems, removeItem } from '../features/shortlist/shortlistSlice';
import { Typography, Grid, IconButton, Container, AppBar, Toolbar, Badge } from '@mui/material';
import { Recipe } from '../types/Recipe';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { RecipeCard } from './RecipeCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import AppNavbar from './AppBar';

const Shortlist: React.FC = () => {
  const shortlistItems = useSelector(selectShortlistItems);
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  return (
    <div style={{ height: '100%' }}>
      <AppNavbar />
      <Container style={{ height: 'calc(100% - 70px)', overflow: 'auto' }}>
      <Typography sx={{ py: 2, pb: 3 }} variant="h4">Shortlisted Recipes</Typography>
      <Grid container spacing={2}>
        {shortlistItems.map((item: Recipe) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <RecipeCard recipe={item} isShortlisted={true} />
            <IconButton onClick={() => handleRemove(item.id)}>
              {/* <DeleteIcon /> */}
            </IconButton>
          </Grid>
        ))}
      </Grid>
      </Container>
    </div>
  );
};

export default Shortlist;
