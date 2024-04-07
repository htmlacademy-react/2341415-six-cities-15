import { ApiRoute, DEFAULT_COMMENTS_COUNT } from '../const';
import { Offer, Comment, Review } from '../types';
import api from './api';

const commentsApi = {

  async getList(id: Offer['id'], limit = DEFAULT_COMMENTS_COUNT): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>(`${ApiRoute.Comments}/${id}`);
    return data.slice(0, limit);
  },
  async sendReview({ comment, rating, id }: Review):Promise<Comment> {
    const { data } = await api.post<Comment>(`${ApiRoute.Comments}/${id}`, { comment, rating });
    return data;
  }
} as const;

type CommentsApi = typeof commentsApi;

export {
  commentsApi,
};

export type {
  CommentsApi,
};
