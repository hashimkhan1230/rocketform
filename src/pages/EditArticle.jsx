import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import "./EditContent.css";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH ARTICLE
  useEffect(() => {
    const fetchArticle = async () => {
      const ref = doc(db, "articles", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) return navigate("/");

      const data = snap.data();

      // 🔐 OWNER CHECK
      if (auth.currentUser.uid !== data.ownerId) {
        alert("Unauthorized");
        return navigate("/");
      }

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category || "Technology");
      setTags((data.tags || []).join(", "));
      setReadTime(data.readTime || "");
      setImageUrl(data.imageUrl || "");
    };

    fetchArticle();
  }, [id, navigate]);

  // 🔥 UPLOAD IMAGE (OPTIONAL)
  const uploadImage = async () => {
    if (!image) return imageUrl;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "rocketform_unsigned");
    formData.append("cloud_name", "dujfq8bfo");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dujfq8bfo/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImage = await uploadImage();

      await updateDoc(doc(db, "articles", id), {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        readTime,
        imageUrl: finalImage,
      });

      alert("Article updated ✨");
      navigate(`/article/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-wrapper">
      <div className="edit-card">
        <h2>Edit Article</h2>
        <p className="edit-subtitle">
          Update your article details
        </p>

        <form onSubmit={handleUpdate}>
          {/* TITLE */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            required
          />

          {/* CONTENT */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Article content"
            required
          />

          {/* CATEGORY */}
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

          {/* TAGS */}
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (react, firebase)"
          />

          {/* READ TIME */}
          <input
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="Read time (minutes)"
          />

          {/* IMAGE PREVIEW */}
          {imageUrl && <img src={imageUrl} alt="preview" />}

          {/* FILE */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="edit-btn-primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
