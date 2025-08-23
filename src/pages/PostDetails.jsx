import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostsAPI } from "../lib/api.js";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await PostsAPI.get(id);
        if (mounted) {
          setPost(data);
        }
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load post");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p>Loading post…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          className="w-full object-cover mb-4 rounded"
        />
      )}
      <h1 className="text-2xl font-bold mb-2 text-center">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        <p>by {post.author}</p>
      </p>
      <p>{post.content}</p>
    </div>
  );
}
