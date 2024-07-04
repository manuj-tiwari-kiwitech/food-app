import axios from 'axios';
import { Recipe } from '../types/Recipe';

const API_URL = 'www.themealdb.com/api/json/v1/1/random.php';

export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
