import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectShortlistItems } from '../features/shortlist/shortlistSelectors';
import { RootState } from '../app/store';
import { Container, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
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

  // Event handling for infinite scrolling using useRef
  useEffect(() => {
    const container = containerRef.current;
    if (container && (!searchTerm || searchTerm.trim() === '')) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    // Reset offset and productItems when search term changes
    setOffset(0);
    setProductItems([]);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchTerm.trim() === '') {
        // If search term is empty, fetch all products
        const params = { offset, limit: 10 };
        try {
          const products = await getProducts(params);
          setProductItems(prevItems => [...prevItems, ...products]);
          console.log('Fetched products:', products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        // If search term is not empty, fetch products based on the search term
        const params = { title: searchTerm, offset, limit: 10 };
        try {
          const products = await getProducts(params);
          setProductItems(products); // Replace existing products with new search results
          console.log('Fetched products:', products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    if(searchTerm.trim() !== '' || !searchTerm) {
      fetchProducts();
    }
  }, [searchTerm, offset]);

  console.log(searchTerm, 'searchterm')

  // Function to handle infinite scrolling 
  const handleScroll = () => {
    const container = containerRef.current;
    if (container && (searchTerm.trim() === '')) { // Only fetch more products if searchTerm is empty
      const { scrollTop, clientHeight, scrollHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 20) { 
        setOffset(prevOffset => prevOffset + 10);
      }
    }
  };

  console.log(productItems, 'producstr')

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
          {productItems.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6">No Data found.</Typography>
            </Grid>
          ) : (
            productItems.map(recipe => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                <RecipeCard
                  recipe={recipe}
                  isShortlisted={shortlistItems.some(item => item.id === recipe.id)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
