import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types/Recipe';
import { RootState } from '../../app/store';

interface ShortlistState {
  items: Recipe[];
}

const initialState: ShortlistState = {
  items: JSON.parse(localStorage.getItem('shortlist') || '[]'),
};

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Recipe>) => {
      state.items.push(action.payload);
      localStorage.setItem('shortlist', JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('shortlist', JSON.stringify(state.items));
    },
  },
});

export const { addItem, removeItem } = shortlistSlice.actions;

export const selectShortlistItems = (state: RootState) => state.shortlist.items;

export default shortlistSlice.reducer;
