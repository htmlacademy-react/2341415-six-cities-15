import CommentItem from './comment';
import { Comment } from '../../types';

type Props = {
  comments: Comment[];
};

function CommentList({ comments }: Props): JSX.Element {
  return (
    <ul className="reviews__list">{comments.map((comment) => <CommentItem key={comment.id} comment={comment}/>)}</ul>
  );
}

export default CommentList;
