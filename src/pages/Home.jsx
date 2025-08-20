import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { PostsAPI } from '../lib/api.js';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await PostsAPI.list();
        if (mounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load posts');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading posts…</p>;
  if (error) return <p className='text-red-600'>Error: {error}</p>;
  if (!posts.length)
    return (
      <div>
        <p>No posts yet. Create your first one!</p>
        <Link to="/create" className="inline-block mt-3 px-3 py-1 border rounded">Create Post</Link>
      </div>
    );

  return (
    <div>
      <h1 className='text-xl font-semibold mb-4'>Posts</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
