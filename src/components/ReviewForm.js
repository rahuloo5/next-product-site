import { useState } from 'react';
import StarRatingInput from './StarReviewInput';

export default function ReviewForm({ productId, userId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, rating, comment }),
    });

    if (res.ok) {
      setComment('');
      setRating(5);
      onReviewSubmitted();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      <label>Rating:</label>
      <StarRatingInput rating={rating} setRating={setRating} />
      <br />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <label style={{ marginRight: '16px' }}>Comment:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <br />
      <div
        style={{
          padding: '16px',
        }}
      >
        <button type='submit' disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
