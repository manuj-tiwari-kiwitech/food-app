// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './components/Cart';
import Shortlist from './components/Shortlist';
import { Container } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './app/store';

const App: React.FC = () => {

  return (
    <Provider store={store}>
        <Container sx={{ height: '100%', maxWidth: 'unset !important', padding: '0 !important' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shortlist" element={<Shortlist />} />
          </Routes>
          <Routes>
        </Routes>
        </Container>
      </Provider>
  );
};

export default App;
