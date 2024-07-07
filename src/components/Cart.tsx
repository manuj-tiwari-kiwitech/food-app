import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addToCart, clearCart, removeFromCart, removeItemFromCart } from '../features/cart/cartSlice';
import { Grid, Typography, IconButton, Card, CardContent, CardMedia, Button, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AppNavbar from './AppBar';
import DeleteIcon from '@mui/icons-material/Delete';
import { Navigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.recipe.price, 0);
  };

  const subtotal = calculateSubtotal();
  const taxes = 0.1 * subtotal; // random 10% tax
  const deliveryCharge = 5; // delivery charge

  const total = subtotal + taxes + deliveryCharge;

  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }

  return (
    <div style={{ height: '90%' }}>
      <AppNavbar />
      <Container style={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
        <Grid sx={{ mt: 3 }} container spacing={3}>
          {/* Left Section: List of Meals */}
          <Grid item xs={12} md={8}>
            <Grid mb={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>Cart</Typography>
            <Button onClick={handleClearCart} variant="outlined" style={{ marginBottom: '20px' }}>Clear Cart</Button>
            </Grid>
            {cartItems.length === 0 ? (
              <Typography variant="body1">Your cart is empty.</Typography>
            ) : (
              cartItems.map(item => (
                <Card key={item.recipe.id} style={{ display: 'flex', position: 'relative', marginBottom: '30px' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.recipe.images[0]}
                    alt={item.recipe.title}
                    style={{ width: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                    <CardContent>
                      <Typography variant="h6">{item.recipe.title}</Typography>
                      <Typography variant="body1">Price: ${item.recipe.price?.toFixed(2)}</Typography>
                      <Typography variant="body1">Quantity: {item.quantity}</Typography>
                    </CardContent>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={() => handleRemove(item.recipe.id)}>
                        <RemoveIcon />
                      </IconButton>
                      <IconButton onClick={() => dispatch(addToCart(item.recipe))}>
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => dispatch(removeItemFromCart(item.recipe.id))}
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </Grid>

          {/* Right Section: Checkout and Total Calculation */}
          <Grid item xs={12} md={4}>
            <Card style={{ padding: '20px', height: '100%' }}>
              <Typography variant="h5" style={{ marginBottom: '20px' }}>Checkout</Typography>
              <Typography variant="body1">Subtotal: ${subtotal.toFixed(2)}</Typography>
              <Typography variant="body1">Taxes (10%): ${taxes.toFixed(2)}</Typography>
              <Typography variant="body1">Delivery Charge: ${deliveryCharge.toFixed(2)}</Typography>
              <Typography variant="h6" style={{ marginTop: '20px' }}>Total: ${total.toFixed(2)}</Typography>
              <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>Proceed to Checkout</Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default CartPage;
