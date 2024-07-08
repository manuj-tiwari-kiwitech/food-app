import { Toolbar, AppBar, Typography, IconButton, Badge, Button } from '@mui/material';
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { selectShortlistItems } from '../features/shortlist/shortlistSlice';
import { logout } from '../features/auth/authSlice';

// AppNavar is Global Navigation bar that is shown on top of every page

const AppNavbar: React.FC = () => {
    const shortlistItems = useSelector(selectShortlistItems);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    return(
        <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Typography variant="h6">
            MegaKart
          </Typography>
          </div>
          <Link to="/cart">
            <IconButton >
              <ShoppingCartIcon />
            </IconButton>
          </Link>
          <Link to="/shortlist">
            <IconButton >
              <Badge badgeContent={shortlistItems.length} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Link>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    )
}

export default AppNavbar;