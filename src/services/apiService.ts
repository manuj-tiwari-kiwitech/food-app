import axios from 'axios';
import { Recipe } from '../types/Recipe';

const API_URL = 'https://api.escuelajs.co/api/v1/products';

export const getProducts = (params: any): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(API_URL, { params }).then(response => response.data);
};
