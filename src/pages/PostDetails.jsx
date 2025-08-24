import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostsAPI } from '../lib/api.js';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Grundzustände
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Löschen
  const [deleting, setDeleting] = useState(false);

  // Bearbeitungsmodus
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    cover: '',
    author: '',
  });
  const [saving, setSaving] = useState(false);

  // ---- Beitrag laden ----
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const data = await PostsAPI.get(id);
        if (mounted) setPost(data || null);
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

  // ---- Validierung des Bearbeitungs-Formulars ----
  const titleOk = useMemo(() => form.title.trim().length > 0, [form.title]);
  const contentOk = useMemo(() => form.content.trim().length > 0, [form.content]);
  const coverOk = useMemo(() => /^https?:\/\//i.test(form.cover.trim()), [form.cover]);
  const isValid = titleOk && contentOk && coverOk;

  // ---- Ereignis-Handler ----
  function startEdit() {
    if (!post) return;
    setForm({
      title: post.title || '',
      content: post.content || '',
      cover: post.cover || '',
      author: post.author || '',
    });
    setEditing(true);
    setError('');
  }

  function cancelEdit() {
    setEditing(false);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!isValid) {
      setError('Fülle Title, Content und eine gültige Cover-URL (http/https).');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        cover: form.cover.trim(),
        author: form.author.trim() || null,
      };
      const updated = await PostsAPI.update(id, payload);
      // Die API gibt das Post-Objekt zurück — Zustand aktualisieren
      setPost(updated);
      setEditing(false);
    } catch (e) {
      setError(e.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await PostsAPI.remove(id); // 204 ohne Body — bereits in api.js behandelt
      navigate('/');
    } catch (e) {
      setError(e.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  // ---- Status-Rendering ----
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!post) return <p>Not found</p>;

  // ---- Haupt-Render ----
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Cover (nur im Ansichtsmodus) */}
      {post.cover && !editing && (
        <img
          src={post.cover}
          alt={post.title}
          className="w-full max-h-[420px] object-cover rounded-lg border mb-4"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {/* Überschrift */}
      <div className="mb-3">
        <h1 className="text-2xl font-bold">{post.title}</h1>
      </div>

      {/* Metadaten */}
      <div className="text-sm text-gray-500 mb-4 flex items-center gap-3">
        {post.date && <span>{new Date(post.date).toLocaleDateString()}</span>}
        {post.author && <span>by {post.author}</span>}
      </div>

      {/* Ansicht / Bearbeitung */}
      {!editing ? (
        <>
          <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {/* Aktionen unten rechts: Edit / Delete */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={startEdit}
              className="px-3 py-1 border rounded hover:bg-gray-50 cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 border rounded text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              {deleting ? 'Deleting…' : 'Delete story'}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className="rounded-xl border bg-white p-5 shadow-sm space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
              Cover URL <span className="text-red-500">*</span>
            </label>
            <input
              id="cover"
              name="cover"
              type="url"
              placeholder="https://..."
              value={form.cover}
              onChange={(e) => setForm({ ...form, cover: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {coverOk && (
              <img
                src={form.cover}
                alt="cover preview"
                className="mt-3 w-full max-h-64 rounded-lg object-cover border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!isValid || saving}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}