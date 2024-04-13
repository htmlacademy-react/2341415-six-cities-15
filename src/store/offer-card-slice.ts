import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { DEFAULT_COMMENTS_COUNT, ERROR, IS_LOADING, NOT_FOUND } from '../const';
import { Comment, Offer, OfferCard, Review } from '../types';
import { OfferApi } from '../services/offer-api';
import { isNotFoundError, showErrorMessage } from '../utils';
import { CommentsApi } from '../services/comments-api';
import { createSelector } from 'reselect';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type OfferState = {
  selectedOfferCard: OfferCard | null | typeof IS_LOADING | typeof NOT_FOUND | typeof ERROR;
  neighbours: Offer[];
  comments: Comment[];
  isCommentAddingInProgress: boolean;
  isCommentWasAdded: boolean;
}

function isOfferCard(selectedOffer: OfferState['selectedOfferCard']): selectedOffer is OfferCard {
  return typeof selectedOffer === 'object' && selectedOffer !== null;
}

const initialState: OfferState = {
  selectedOfferCard: null,
  neighbours: [],
  comments: [],
  isCommentAddingInProgress: false,
  isCommentWasAdded: false
};

export const offerCardSlice = createSliceWithThunks({
  name: 'offerCard',
  initialState,
  selectors: {
    selectSelectedOfferCard: (state) => state.selectedOfferCard,
    selectNeighbours: (state) => state.neighbours,
    selectCommentsCount: (state) => state.comments.length,
    selectComments: createSelector(
      [
        (state: OfferState) => state.comments,
      ],
      (comments) => [...comments].sort((comment1, comment2) => new Date(comment2.date).getTime() - new Date(comment1.date).getTime()).slice(0, DEFAULT_COMMENTS_COUNT)
    ),
    selectCommentWasAdded: (state) => state.isCommentWasAdded,
    selectIsCommentAddingInProgress: (state) => state.isCommentAddingInProgress,
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
    resetCommentWasAddedAction: create.reducer((state) => {
      state.isCommentWasAdded = false;
    }),
    fetchOfferCardDataAction: create.asyncThunk<{ selectedOfferCard: OfferCard; neighbours: Offer[]; comments: Comment[] }, string, { extra: { offerApi: OfferApi; commentsApi: CommentsApi }}>(
      async (id, { extra: { offerApi, commentsApi }, dispatch }) => {
        const [selectedOfferCard, neighbours, comments] = await Promise.all([
          offerApi.getBy(id).catch((err) => {
            showErrorMessage('offer card loading error', dispatch);
            throw err;
          }),
          offerApi.getNearby(id).catch(() => {
            showErrorMessage('nearest offers loading error', dispatch);
            return [];
          }),
          commentsApi.getList(id).catch(() => {
            showErrorMessage('comments loading error', dispatch);
            return [];
          }),
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
          state.selectedOfferCard = ERROR;
        },
        fulfilled: (state, action) => {
          const { selectedOfferCard, neighbours, comments } = action.payload;
          state.selectedOfferCard = selectedOfferCard;
          state.neighbours = neighbours;
          state.comments = comments;
        },
      }
    ),
    addCommentAction: create.asyncThunk<Comment, Review, { extra: { commentsApi: CommentsApi }}>(
      (review, { extra: { commentsApi }, dispatch }) => commentsApi.sendReview(review).catch((err) => {
        showErrorMessage('comment adding error', dispatch);
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.isCommentAddingInProgress = false;
          state.comments = [action.payload,...state.comments];
          state.isCommentWasAdded = true;
        },
        pending: (state) => {
          state.isCommentAddingInProgress = true;
        },
        rejected: (state) => {
          state.isCommentAddingInProgress = false;
        }
      }
    ),
  }),
});

export default offerCardSlice;
export const
  {
    fetchOfferCardDataAction,
    clearOfferDataAction,
    addCommentAction,
    resetCommentWasAddedAction
  } = offerCardSlice.actions;
export const
  {
    selectSelectedOfferCard,
    selectNeighbours,
    selectComments,
    selectCurrentOfferCardId,
    selectIsCommentAddingInProgress,
    selectCommentWasAdded,
    selectCommentsCount
  } = offerCardSlice.selectors;
