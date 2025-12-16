import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const postSnap = await getDocs(
          query(collection(db, "posts"), where("ownerId", "==", user.uid))
        );

        const articleSnap = await getDocs(
          query(collection(db, "articles"), where("ownerId", "==", user.uid))
        );

        setPosts(postSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setArticles(articleSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // 🗑 DELETE ARTICLE
  const deleteArticle = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    await deleteDoc(doc(db, "articles", id));
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // 🗑 DELETE POST
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  if (!user || loading) {
    return <p style={{ textAlign: "center", marginTop: "80px" }}>Loading profile...</p>;
  }

  return (
    <div className="profile-page">

      {/* ===== HEADER ===== */}
      <div className="profile-header">
        <div className="avatar-lg">
          {user.displayName?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="profile-info">
          <h2>{user.displayName || "Anonymous User"}</h2>
          <p>{user.email}</p>

          <div className="profile-stats">
            <div>
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>
            <div>
              <strong>{articles.length}</strong>
              <span>Articles</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== POSTS ===== */}
      <section className="profile-section">
        <h3>Your Posts</h3>

        {posts.length === 0 ? (
          <p className="empty">
            No posts yet. <Link to="/add-post">Create one →</Link>
          </p>
        ) : (
          <div className="profile-grid">
            {posts.map(post => (
              <div className="profile-card" key={post.id}>
                <Link to={`/post/${post.id}`}>
                  {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
                  <h4>{post.title}</h4>
                </Link>

                <div className="card-actions">
                  <Link to={`/edit-post/${post.id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== ARTICLES (SAME AS POSTS) ===== */}
      <section className="profile-section">
        <h3>Your Articles</h3>

        {articles.length === 0 ? (
          <p className="empty">
            No articles yet. <Link to="/add-article">Create one →</Link>
          </p>
        ) : (
          <div className="profile-grid">
            {articles.map(article => (
              <div className="profile-card" key={article.id}>
                <Link to={`/article/${article.id}`}>
                  {article.imageUrl && (
                    <img src={article.imageUrl} alt={article.title} />
                  )}
                  <h4>{article.title}</h4>
                </Link>

                <div className="card-actions">
                  <Link
                    to={`/edit-article/${article.id}`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => deleteArticle(article.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
