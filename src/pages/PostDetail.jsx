import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import "./Detail.css";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const snap = await getDoc(doc(db, "posts", id));
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  // ❤️ LIKE
  const handleLike = async () => {
    if (!auth.currentUser) return alert("Login required");

    await updateDoc(doc(db, "posts", id), {
      likes: (post.likes || 0) + 1,
      likedBy: arrayUnion(auth.currentUser.uid),
    });

    setPost({ ...post, likes: (post.likes || 0) + 1 });
  };

  // 🗑 DELETE (OWNER ONLY)
  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  };

  return (
    <div className="detail-wrapper">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {post.imageUrl && (
        <img src={post.imageUrl} className="detail-image" />
      )}

      <h1>{post.title}</h1>
      <small>By {post.author}</small>
      <p>{post.content}</p>

      <div className="actions">
        <button onClick={handleLike}>
          ❤️ Like {post.likes || 0}
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied");
          }}
        >
          🔗 Share
        </button>

        {/* 🔒 OWNER ONLY */}
        {auth.currentUser?.uid === post.ownerId && (
          <>
            <button onClick={() => navigate(`/edit-post/${id}`)}>
              ✏️ Edit
            </button>
            <button className="danger" onClick={deletePost}>
              🗑 Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
