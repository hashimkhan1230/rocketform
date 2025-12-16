import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      const postSnap = await getDocs(postQuery);
      setPosts(postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const articleQuery = query(
        collection(db, "articles"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      const articleSnap = await getDocs(articleQuery);
      setArticles(articleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  return (
    <div className="home-wrapper">

      {/* HERO */}
      <section className="hero-landing">
        <h1>
          WELCOME TO <span>RocketForm</span>
        </h1>
        <p>Explore posts, articles and vlogs by creators</p>

      
      </section>

      {/* POSTS */}
      <section className="latest">
        <h2>Latest Posts</h2>

        {posts.length === 0 ? (
          <p className="empty">No posts yet</p>
        ) : (
          <div className="card-grid">
            {posts.map(post => (
              <Link
                to={`/post/${post.id}`}
                className="card-link"
                key={post.id}
              >
                <div className="home-card">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="card-image"
                    />
                  )}

                  <div className="home-card-content">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <small>By {post.author}</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ARTICLES */}
      <section className="latest">
        <h2>Latest Articles</h2>

        {articles.length === 0 ? (
          <p className="empty">No articles yet</p>
        ) : (
          <div className="card-grid">
            {articles.map(article => (
              <Link
                to={`/article/${article.id}`}
                className="card-link"
                key={article.id}
              >
                <div className="home-card">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="card-image"
                    />
                  )}

                  <div className="home-card-content">
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                    <small>By {article.author}</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
