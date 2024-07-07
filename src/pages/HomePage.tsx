import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectShortlistItems } from '../features/shortlist/shortlistSelectors';
import { RootState } from '../app/store';
import { Container, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { RecipeCard } from '../components/RecipeCard';
import AppNavbar from '../components/AppBar';
import { getProducts } from '../services/apiService';
import { Recipe } from '../types/Recipe';
import SearchOutlined from '@mui/icons-material/SearchOutlined'

const HomePage: React.FC = (props: any) => {

  const [productItems, setProductItems] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);

  const shortlistItems = useSelector((state: RootState) => selectShortlistItems(state));

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const params = { title: searchTerm, offset: offset, limit: 10 }
    getProducts(params)
      .then(products => {
        setProductItems(prevItems => ([...prevItems, ...products]));
        console.log('Fetched products:', products);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [searchTerm, offset]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 20) { 
        setOffset(prevOffset => prevOffset + 10);
      }
    }
  };

  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }

  return (
    <div style={{ height: '90%' }}>
      <AppNavbar />
      <Container ref={containerRef}  style={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
        <Grid container spacing={4} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {productItems.map(recipe => (
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
