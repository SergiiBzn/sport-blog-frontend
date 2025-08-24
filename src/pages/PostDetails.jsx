import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PostsAPI } from '../lib/api.js';

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await PostsAPI.get(id);
        if (mounted) {
          setPost(data);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load post');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await PostsAPI.remove(id);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p>Loading post…</p>;
  if (error) return <p className='text-red-600'>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className='max-w-2xl mx-auto p-4'>
      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          className='w-full object-cover mb-4 rounded'
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <h1 className='text-2xl font-bold mb-2 text-center'>{post.title}</h1>
      <div className='text-sm text-gray-500 mb-4 flex items-center gap-3'>
        {post.date && <span>{new Date(post.date).toLocaleDateString()}</span>}
        {post.author && <span>by {post.author}</span>}
      </div>
      <p>{post.content}</p>
      <div className='flex justify-end mt-4'>
        <button
          type='button'
          onClick={handleDelete}
          disabled={deleting}
          className='px-3 py-1 border rounded text-red-600 hover:bg-red-50 disabled:opacity-50'
        >
          {deleting ? 'Deleting…' : 'Delete story'}
        </button>
      </div>
    </div>
  );
}
