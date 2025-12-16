import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import "./EditContent.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) return navigate("/");

      const data = snap.data();

      if (auth.currentUser.uid !== data.ownerId) {
        alert("Unauthorized");
        return navigate("/");
      }

      setTitle(data.title);
      setContent(data.content);
      setImageUrl(data.imageUrl || "");
    };

    fetchPost();
  }, [id, navigate]);

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

      await updateDoc(doc(db, "posts", id), {
        title: title.trim(),
        content: content.trim(),
        imageUrl: finalImage,
      });

      alert("Post updated ✨");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-wrapper">          {/* ✅ FIX */}
      <div className="edit-card">           {/* ✅ FIX */}
        <h2>Edit Post</h2>
        <p className="edit-subtitle">Update your post content</p>

        <form onSubmit={handleUpdate}>
          <input
            type="text"                      /* ✅ important */
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            required
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post content"
            required
          />

          {imageUrl && <img src={imageUrl} alt="preview" />}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="edit-btn-primary"     /* ✅ FIX */
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
