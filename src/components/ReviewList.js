import { useEffect, useState } from 'react';
import StarRatingDisplay from './StarRatingDisplay';
import io from 'socket.io-client';

export default function ReviewList({ productId, sortBy = 'newest' }) {
  const [reviews, setReviews] = useState([]);
  const [sortByRating, setSortByRating] = useState(sortBy);

  let socket;
  console.log(reviews, 'reviews');
  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch(`/api/reviews?productId=${productId}&sortBy=${sortByRating}`);
      console.log(res, 'Res');
      const data = await res.json();
      setReviews(data);
    }

    fetchReviews();

    if (!socket) {
      socket = io();
    }

    socket.on('new-review', (review) => {
      if (review.productId === productId) {
        setReviews((prev) => [review, ...prev]);
      }
    });

    return () => {
      if (socket) socket.off('new-review');
    };
  }, [productId, sortBy, sortByRating]);

  async function voteHelpful(reviewId) {
    // const token = localStorage.getItem('token');
    const res = await fetch('/api/reviews/helpful', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewId }),
    });

    const result = await res.json();
    if (res.ok) {
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, helpfulVotes: result.helpfulVotes } : r)));
    } else {
      alert(result.message);
    }
  }

  console.log(reviews, 'reviewsreviews');
  return (
    <div>
      <h3>Reviews</h3>

      <label>Sort by: </label>
      <select value={sortByRating} onChange={(e) => setSortByRating(e.target.value)}>
        <option value='newest'>Newest</option>
        <option value='highest'>Highest Rated</option>
        <option value='lowest'>Lowest Rated</option>
      </select>

      {reviews?.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews?.length > 0 &&
        reviews?.map((review) => (
          <div key={review._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <StarRatingDisplay rating={review.rating} />
            <p>{review.comment}</p>
            <small>By User: {review.userId}</small>

            <br />
            <button onClick={() => voteHelpful(review._id)}>Helpful</button>
            <span> ({review.helpfulVotes || 0} found this helpful)</span>
          </div>
        ))
      )}
    </div>
  );
}
