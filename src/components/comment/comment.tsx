import { MAX_RATING } from '../../const';
import { Comment } from '../../types';
import { format } from 'date-fns';
import { formatCommentDate, getRatingPercentage } from '../../utils';

type Props = {
  comment: Comment;
};

function CommentItem(props: Props): JSX.Element {
  const { comment } = props;
  const { user, date, rating } = comment;
  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={user.avatarUrl} width="54" height="54" alt="Reviews avatar" />
        </div>
        <span className="reviews__user-name">
          {user.name}
        </span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style= {{width: `${getRatingPercentage(rating, MAX_RATING)}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">
          {comment.comment}
        </p>
        <time className="reviews__time" dateTime={format(date, 'yyyy-MM-dd')}>{formatCommentDate(date)}</time>
      </div>
    </li>
  );
}

export default CommentItem;
