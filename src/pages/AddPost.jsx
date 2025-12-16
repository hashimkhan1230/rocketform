import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import "./CreateContent.css";

export default function AddPost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Cloudinary image upload
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

      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        content: content.trim(),
        imageUrl,
        author: auth.currentUser.displayName || "Anonymous",

        ownerId: auth.currentUser.uid, // 🔒🔥 THIS IS THE KEY FIX

        likes: 0,
        likedBy: [],

        createdAt: serverTimestamp(),
      });

      alert("Post published successfully 🚀");
      navigate("/");
    } catch (error) {
      console.error("Add post error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-card pro">
        <h2>Add a New Post</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Title</label>
            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Post Content</label>
            <textarea
              placeholder="Write your post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
