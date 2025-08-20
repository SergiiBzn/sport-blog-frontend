import { Link } from 'react-router-dom';

function snippet(text, max = 140) {
  if (!text) return '';
  const s = String(text).trim();
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

export default function PostCard({ post }) {
  const { id, title, content, cover, date } = post || {};
  const prettyDate = formatDate(date);

  return (
    <Link
      to={`/posts/${id}`}
      aria-label={`Open post ${title}`}
      className='block border rounded overflow-hidden hover:shadow transition'
    >
      {cover ? (
        <img
          src={cover}
          alt={title}
          className='w-full h-48 object-cover bg-gray-100'
          loading='lazy'
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}

      <div className='p-3'>
        <h3 className='font-semibold mb-1'>{title}</h3>
        {prettyDate && (
          <p className='text-xs text-gray-500 mb-1'>{prettyDate}</p>
        )}
        <p className='text-sm text-gray-600'>{snippet(content)}</p>
      </div>
    </Link>
  );
}
