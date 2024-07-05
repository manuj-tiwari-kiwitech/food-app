import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectShortlistItems, removeItem as removeFromShortlist } from '../features/shortlist/shortlistSlice';
import { RootState } from '../app/store';
import { Grid, IconButton, Typography, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RecipeCard } from '../components/RecipeCard';

const ShortlistPage: React.FC = () => {
  const shortlistItems = useSelector(selectShortlistItems);
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeFromShortlist(id));
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Shortlist</Typography>
      <Grid container spacing={2}>
        {shortlistItems.length > 0 ? (
          shortlistItems.map(item => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <RecipeCard recipe={item} isShortlisted={true} />
              <IconButton onClick={() => handleRemove(item.id)} style={{ marginTop: '10px' }}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">Your shortlist is empty.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ShortlistPage;
