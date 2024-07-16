import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectShortlistItems } from '../features/shortlist/shortlistSelectors';
import { RootState } from '../app/store';
import { Box, Button, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import { RecipeCard } from '../components/RecipeCard';
import AppNavbar from '../components/AppBar';
import { getProducts } from '../services/apiService';
import { Recipe } from '../types/Recipe';
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import { Loader } from '../common/loader';

let limit = 10;

const HomePage: React.FC = (props: any) => {

  const [productItems, setProductItems] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortFilter, setSortFilter] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);

  const shortlistItems = useSelector((state: RootState) => selectShortlistItems(state));

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const containerRef = useRef<HTMLDivElement>(null);

  // Event handling for infinite scrolling using useRef
  useEffect(() => {
    if(searchTerm.trim() == '') {
      const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching && hasMore) {
          setOffset(prevOffset => prevOffset + limit);
        }
      };
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
    }
  }, [isFetching, hasMore, searchTerm]);

  useEffect(() => {
    // Reset offset and productItems when search term changes
    setOffset(0);
    setProductItems([]);
    setHasMore(true)
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true);
      setLoading(true);
      if (!searchTerm) {
        // If search term is empty, fetch all products
        const params = { offset, limit: limit, price_min: minPrice,
          price_max: maxPrice };
        try {
          const products = await getProducts(params);
          if (products.length === 0) {
            // If no more products are returned, set hasMore to false
            setHasMore(false);
            setLoading(false)
          } else {
            setIsFetching(false);
            setProductItems(prevItems => [...prevItems, ...products]);
            setLoading(false)
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        // If search term is not empty, fetch products based on the search term
        const params = { title: searchTerm, offset, limit: limit };
        try {
          const products = await getProducts(params);
          setProductItems(products); // Replace existing products with new search results
          setLoading(false);
          setIsFetching(false);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    if (hasMore && !isFetching) {
      fetchProducts();
    }
  }, [searchTerm, offset, minPrice, maxPrice]);

  // Function to handle infinite scrolling 
  // const handleScroll = () => {
  //   if (searchTerm === '' && hasMore) {
  //     const container = containerRef.current;
  //     if (container) {
  //       const { scrollTop, clientHeight, scrollHeight } = container;
  //       if (scrollTop + clientHeight >= scrollHeight - 20) {
  //         setOffset(prevOffset => prevOffset + 10);
  //       }
  //     }
  //   }
  // };

  const handleReset = () => {
    setSearchTerm('');
    setSortFilter('');
    setMinPrice(0);
    setMaxPrice(500);
    setOffset(0);
    limit = 10;
    setHasMore(true);
  };

  const handlePriceChange = (event: any, newValue: number | number[]) => {
    const [newMinPrice, newMaxPrice] = newValue as [number, number];
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setOffset(0);
    setProductItems([]);
    setHasMore(true);
  };

  console.log(offset, 'offsetChange')

  const sortProducts = (products: Recipe[]) => {
    let sortedProducts = [...products];

    if (sortFilter === 'lowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'highToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortFilter === 'latest') {
      sortedProducts.sort((a, b) => new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime());
    }

    return sortedProducts;
  };

  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }

  return (
    <div style={{ height: '90%' }}>
      <AppNavbar />
      <Container ref={containerRef} style={{ margin: 0, maxWidth: 'none',paddingLeft: 0, height: 'calc(100% - 40px)', overflow: 'auto', display: 'flex' }}>
        {loading && <Loader />}
        <Grid container style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={3} md={2.3} style={{ position: 'sticky', top: '20px', height: '100vh', paddingRight: '20px', paddingLeft: '15px' }}>
            <Box p={2} style={{ border: '1px solid #ddd', borderRadius: '8px', height: '100vh', padding: '20px' }}>
              <Typography variant="h6">Filters</Typography>
              <Typography variant="subtitle1">Price Range</Typography>
              <Slider
                value={[minPrice, maxPrice]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={500}
                step={10}
              />
              <Typography variant="body2">Range: ${minPrice} - ${maxPrice}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9} md={9.7}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
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
              <Grid item xs={3} sm={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortFilter}
                    onChange={(e) => setSortFilter(e.target.value as string)}
                    label="Filters"
                  >
                    <MenuItem value="lowToHigh">Low to High</MenuItem>
                    <MenuItem value="highToLow">High to Low</MenuItem>
                    <MenuItem value="latest">Latest</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3} sm={3} style={{ display: 'flex', justifyContent: 'end', position: 'relative' }}>
                <Button style={{ position: 'absolute', bottom: 0 }} variant="contained" onClick={() => handleReset()}>Reset</Button>
              </Grid>
              {!loading && productItems.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6">No Data found.</Typography>
                </Grid>
              ) : (
                sortProducts(productItems).map(recipe => (
                  <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                    <RecipeCard
                      recipe={recipe}
                      isShortlisted={shortlistItems.some(item => item.id === recipe.id)}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
