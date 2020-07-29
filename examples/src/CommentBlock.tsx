import * as React from 'react';
import { CommentInfo } from '../../lib';

interface Props {
  updateComment: (commentInfo: CommentInfo, text: string) => void;
  removeComment: (lineId: string) => void;
  comment: any;
  show: boolean;
}

const CommentBlock: React.FC<Props> = ({
  updateComment,
  removeComment,
  comment,
  show
}) => {
  const [isComment, setIsComment] = React.useState<boolean>(show);
  const [text, setText] = React.useState<string>(
    comment.body ? comment.body.text : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  if (!isComment) {
    return (
      <div className='p-2'>
        <div className='form-group mb-2'>
          <textarea
            onChange={handleChange}
            value={text}
            className='form-control'
          />
        </div>
        <button
          className='btn btn-primary mr-2'
          onClick={() => {
            if (!text) {
              return removeComment(comment.lineId);
            }
            updateComment(comment, text);
            setIsComment(true);
          }}
        >
          Submit
        </button>
        <button
          className='btn btn-secondary'
          onClick={() => {
            if (!text) {
              return removeComment(comment.lineId);
            }
            setIsComment(true);
          }}
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <div className='p-2'>
      <div className='mb-2 bg-light rounded p-2'>
        {comment.body.text &&
          comment.body.text
            .split('\n')
            .map((str: string, i: number) => <div key={i}>{str}</div>)}
      </div>
      <button
        onClick={() => setIsComment(false)}
        className='btn btn-primary mr-2'
      >
        Edit
      </button>
      <button
        onClick={() => removeComment(comment.lineId)}
        className='btn btn-secondary mr-2'
      >
        Delete
      </button>
    </div>
  );
};

export default CommentBlock;
