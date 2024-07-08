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
import { Loader } from '../common/loader';

const HomePage: React.FC = (props: any) => {

  const [productItems, setProductItems] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const shortlistItems = useSelector((state: RootState) => selectShortlistItems(state));

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const containerRef = useRef<HTMLDivElement>(null);

  // Event handling for infinite scrolling using useRef
  useEffect(() => {
    if(searchTerm.trim() == '') {
      const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
    }
  }, [searchTerm]);

  useEffect(() => {
    // Reset offset and productItems when search term changes
    setOffset(0);
    setProductItems([]);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (!searchTerm) {
        // If search term is empty, fetch all products
        const params = { offset, limit: 10 };
        try {
          const products = await getProducts(params);
          if (products.length === 0) {
            // If no more products are returned, set hasMore to false
            setHasMore(false);
            setLoading(false)
          } else {
            setProductItems(prevItems => [...prevItems, ...products]);
            setLoading(false)
          }
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
          setLoading(false)
          console.log('Fetched products:', products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

      if(hasMore) {
        fetchProducts();
      }
  }, [searchTerm, offset]);

  console.log(searchTerm, 'searchterm')

  // Function to handle infinite scrolling 
  const handleScroll = () => {
    if(searchTerm === '' && hasMore) {
      console.log('inSearch')
      const container = containerRef.current;
    if (container) { 
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 20) { 
        setOffset(prevOffset => prevOffset + 10);
      }
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
      {loading && <Loader />}
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
