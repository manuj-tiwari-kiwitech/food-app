import { RootState } from '../../app/store';
import { selectRecipes } from './recipeSlice';

export const selectAllRecipes = (state: RootState) => selectRecipes(state);