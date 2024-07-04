import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types/Recipe';
import { RootState } from '../../app/store';

interface RecipesState {
  items: Recipe[];
}

const initialState: RecipesState = {
  items: [],
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe[]>) => {
      state.items = action.payload;
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(recipe => recipe.id !== action.payload);
    },
  },
});

export const { addRecipe, removeRecipe } = recipesSlice.actions;

export const selectRecipes = (state: RootState) => state.recipes.items;

export default recipesSlice.reducer;
