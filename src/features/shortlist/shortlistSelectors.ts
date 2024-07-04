import { RootState } from '../../app/store';

export const selectShortlistItems = (state: RootState) => state.shortlist.items;
