import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import "./CreateContent.css";

export default function AddArticle() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Upload image to Cloudinary
  const uploadImage = async () => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "rocketform_unsigned");
    formData.append("cloud_name", "dujfq8bfo");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dujfq8bfo/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      await addDoc(collection(db, "articles"), {
        title: title.trim(),
        content: content.trim(),
        imageUrl,

        // 🔥 NEW ENHANCEMENTS
        category,
        tags: tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        readTime: readTime || "5",
        featured: false,

        // 🔐 OWNER INFO (IMPORTANT)
        ownerId: auth.currentUser.uid,
        author: auth.currentUser.displayName || "Anonymous",

        createdAt: serverTimestamp(),
      });

      alert("Article published successfully ✨");
      navigate("/profile");
    } catch (error) {
      console.error("Add article error:", error);
      alert("Error publishing article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-card pro">
        <h2>Add New Article</h2>
        <p className="subtitle">
          Write a detailed article and share your knowledge.
        </p>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="form-group">
            <label>Article Title</label>
            <input
              type="text"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* CONTENT */}
          <div className="form-group">
            <label>Article Content</label>
            <textarea
              placeholder="Write your article here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Technology</option>
              <option>Education</option>
              <option>Life</option>
              <option>Career</option>
              <option>Islamic</option>
            </select>
          </div>

          {/* TAGS */}
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              placeholder="react, firebase, career"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* READ TIME */}
          <div className="form-group">
            <label>Read Time (minutes)</label>
            <input
              type="number"
              placeholder="5"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
            />
          </div>

          {/* IMAGE */}
          <div className="form-group">
            <label>Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
