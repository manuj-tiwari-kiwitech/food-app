// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { recipes } from '../constants/recipes';
import { selectShortlistItems } from '../features/shortlist/shortlistSelectors';
import { RootState } from '../app/store';
import { AppBar, Toolbar, IconButton, Typography, Badge, Container, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { RecipeCard } from '../components/RecipeCard';
import { fetchRecipes } from '../services/apiService';
import { addRecipe } from '../features/recipes/recipeSlice';
import useApi from '../hooks/useApi';
import AppNavbar from '../components/AppBar';

const HomePage: React.FC = (props:any) => {
  // const [loading, setLoading] = useState(true);
  const shortlistItems = useSelector((state: RootState) => selectShortlistItems(state));
  // const dispatch = useDispatch();

  // const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random';
  // const headers = {
  //   'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
  //   'x-rapidapi-key': 'eb84c6e3f8msh260b89e1f001d7ep1b7310jsn487bcd709b53',
  // };

  // const { data, loading, error } = useApi<any>(url, {
  //   headers: headers,
  //   params: {
  //     tags: 'vegetarian,dessert',
  //     number: 1,
  //   },
  // });

  // console.log(data, 'apiData')

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div style={{ height: '100%' }}>
      <AppNavbar />
      <Container style={{ height: 'calc(100% - 70px)', overflow: 'auto' }}>
        <Grid container spacing={4} style={{ marginTop: '20px' }}>
          {recipes.map(recipe => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <RecipeCard
                recipe={recipe}
                isShortlisted={shortlistItems.some(item => item.id === recipe.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
