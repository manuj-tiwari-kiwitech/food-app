import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types/Recipe';
import { RootState } from '../../app/store';

interface CartItem {
  recipe: Recipe;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Recipe>) => {
      const existingItem = state.items.find(item => item.recipe.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ recipe: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.recipe.id === action.payload);
      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity--;
        } else {
          state.items.splice(index, 1);
        }
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
