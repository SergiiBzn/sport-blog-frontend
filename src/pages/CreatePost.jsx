import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostsAPI } from '../lib/api.js';

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
    cover: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const coverOk = /^https?:\/\//i.test(form.cover.trim());
  const titleOk = form.title.trim().length > 0;
  const contentOk = form.content.trim().length > 0;
  const isValid = coverOk && titleOk && contentOk;

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    if (!isValid) {
      setError('title, content, cover URL musst korrekt sein');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        cover: form.cover.trim(),
        author: form.author.trim() || null,
      };
      await PostsAPI.create(payload);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Fehler!');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Create Post</h1>
      <p role='alert'>{error}</p>
      <form
        onSubmit={handleSubmit}
        className='rounded-xl border bg-white p-5 shadow-sm space-y-5'
      >
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Title <span className='text-red-500'>*</span>
          </label>
          <input
            id='title'
            name='title'
            type='text'
            value={form.title}
            onChange={handleChange}
            required
            className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          />
        </div>

        <div>
          <label
            htmlFor='author'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Author
          </label>
          <input
            id='author'
            name='author'
            type='text'
            value={form.author}
            onChange={handleChange}
            placeholder='Optional'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          />
        </div>

        <div>
          <label
            htmlFor='cover'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Cover URL <span className='text-red-500'>*</span>
          </label>
          <input
            id='cover'
            name='cover'
            type='url'
            placeholder='https://...'
            value={form.cover}
            onChange={handleChange}
            required
            className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          />
          {coverOk && (
            <img
              src={form.cover}
              alt='cover preview'
              className='mt-3 w-full max-h-64 rounded-lg object-cover border'
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        <div>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Content <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='content'
            name='content'
            rows={8}
            value={form.content}
            onChange={handleChange}
            required
            className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          />
        </div>
        {coverOk && (
          <img
            src={form.cover}
            alt='cover'
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        {error && (
          <div
            role='alert'
            className='mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700'
          >
            {error}
          </div>
        )}
        <div className='flex gap-3 pt-2'>
          <button
            type='submit'
            disabled={!isValid || submitting}
            className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2
               text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {submitting ? 'Creating…' : 'Create'}
          </button>

          <button
            type='button'
            onClick={() => navigate('/')}
            className='inline-flex items-center justify-center rounded-lg border px-4 py-2
               text-gray-700 transition hover:bg-gray-50'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
