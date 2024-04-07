import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { IS_LOADING, NOT_FOUND } from '../const';
import { Comment, Offer, OfferCard, Review } from '../types';
import { OfferApi } from '../services/offer-api';
import { isNotFoundError } from '../utils';
import { CommentsApi } from '../services/comments-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type OfferState = {
  error: string | null;
  selectedOfferCard: OfferCard | null | typeof IS_LOADING | typeof NOT_FOUND;
  neighbours: Offer[];
  comments: Comment[];
}

function isOfferCard(selectedOffer: OfferState['selectedOfferCard']): selectedOffer is OfferCard {
  return typeof selectedOffer === 'object' && selectedOffer !== null;
}

const initialState: OfferState = {
  error: null,
  selectedOfferCard: null,
  neighbours: [],
  comments: [],
};

const offerCardSlice = createSliceWithThunks({
  name: 'offerCard',
  initialState,
  selectors: {
    selectSelectedOfferCard: (state) => state.selectedOfferCard,
    selectNeighbours: (state) => state.neighbours,
    selectComments: (state) => state.comments,
    selectCurrentOfferCardId: (state) => {
      if (isOfferCard(state.selectedOfferCard)) {
        return state.selectedOfferCard.id;
      }

      throw new Error('offer haven`t been loaded yet');
    },
  },
  reducers: (create) => ({
    clearOfferDataAction: create.reducer((state) => {
      state.selectedOfferCard = null;
      state.neighbours = [];
      state.comments = [];
    }),

    fetchOfferCardDataAction: create.asyncThunk<{ selectedOfferCard: OfferCard; neighbours: Offer[]; comments: Comment[] }, string, { extra: { offerApi: OfferApi; commentsApi: CommentsApi }}>(
      async (id, { extra: { offerApi, commentsApi }}) => {
        const [selectedOfferCard, neighbours, comments] = await Promise.all([
          offerApi.getBy(id),
          offerApi.getNearby(id),
          commentsApi.getList(id),
        ]);

        return { selectedOfferCard, neighbours, comments };
      },
      {
        pending: (state) => {
          state.selectedOfferCard = IS_LOADING;
        },
        rejected: (state, action) => {
          if (isNotFoundError(action.error)) {
            state.selectedOfferCard = NOT_FOUND;
          }
        },
        fulfilled: (state, action) => {
          const { selectedOfferCard, neighbours, comments } = action.payload;
          state.selectedOfferCard = selectedOfferCard;
          state.neighbours = neighbours;
          state.comments = comments;
        },
      }
    ),
    fetchReviewAction: create.asyncThunk<Comment, Review, { extra: { commentsApi: CommentsApi }}>(
      (review, { extra: { commentsApi } }) => commentsApi.sendReview(review),
      {
        fulfilled: (state, action) => {
          state.comments = [...state.comments, action.payload];
        },
      }
    ),
  }),
});

export default offerCardSlice;
export const { fetchOfferCardDataAction, clearOfferDataAction, fetchReviewAction } = offerCardSlice.actions;
export const { selectSelectedOfferCard, selectNeighbours, selectComments, selectCurrentOfferCardId } = offerCardSlice.selectors;
