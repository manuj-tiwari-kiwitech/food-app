// app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import shortlistReducer from '../features/shortlist/shortlistSlice';
import recipeReducer from '../features/recipes/recipeSlice';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    shortlist: shortlistReducer,
    recipes: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
