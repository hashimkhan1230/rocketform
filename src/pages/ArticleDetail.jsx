import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import "./Detail.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH ARTICLE
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const ref = doc(db, "articles", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          navigate("/");
          return;
        }

        setArticle({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!article) return null;

  /* ================= ACTIONS ================= */

  // ❤️ LIKE (any logged-in user)
  const handleLike = async () => {
    if (!auth.currentUser) {
      alert("Login required");
      return;
    }

    if (article.likedBy?.includes(auth.currentUser.uid)) return;

    try {
      await updateDoc(doc(db, "articles", id), {
        likes: (article.likes || 0) + 1,
        likedBy: arrayUnion(auth.currentUser.uid),
      });

      setArticle({
        ...article,
        likes: (article.likes || 0) + 1,
        likedBy: [...(article.likedBy || []), auth.currentUser.uid],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 DELETE (ONLY OWNER)
  const handleDelete = async () => {
    if (!auth.currentUser) return;

    if (auth.currentUser.uid !== article.ownerId) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "articles", id));
      alert("Article deleted successfully 🗑");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  return (
    <div className="detail-wrapper">

      {/* 🔙 BACK */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* IMAGE */}
      {article.imageUrl && (
        <img src={article.imageUrl} alt="" className="detail-image" />
      )}

      {/* META */}
      <div className="article-meta">
        <span className="category">{article.category}</span>
        <span>{article.readTime} min read</span>
      </div>

      {/* TITLE */}
      <h1 className="detail-title">{article.title}</h1>

      <p className="detail-author">By {article.author}</p>

      {/* CONTENT */}
      <p className="detail-content">{article.content}</p>

      {/* TAGS */}
      {article.tags?.length > 0 && (
        <div className="tags">
          {article.tags.map((tag, i) => (
            <span key={i}>#{tag}</span>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="actions">
        <button onClick={handleLike}>
          ❤️ Like {article.likes || 0}
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied 🔗");
          }}
        >
          🔗 Share
        </button>

        {/* 🔐 OWNER ONLY */}
        {auth.currentUser &&
          auth.currentUser.uid === article.ownerId && (
            <>
              <button onClick={() => navigate(`/edit-article/${id}`)}>
                ✏️ Edit
              </button>

              <button className="danger" onClick={handleDelete}>
                🗑 Delete
              </button>
            </>
          )}
      </div>
    </div>
  );
}
