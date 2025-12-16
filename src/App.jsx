import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* PAGES */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AddPost from "./pages/AddPost";
import AddArticle from "./pages/AddArticle";
import EditPost from "./pages/EditPost";
import EditArticle from "./pages/EditArticle";
import About from "./pages/About";
import Contact from "./pages/Contact";

/* DETAIL PAGES (if you have them) */
import PostDetail from "./pages/PostDetail";
import ArticleDetail from "./pages/ArticleDetail";

export default function App() {
  return (
    <Router>
      {/* 🔝 GLOBAL NAVBAR */}
      <Navbar />

      {/* 🔀 ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />

        {/* CREATE */}
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/add-article" element={<AddArticle />} />

        {/* EDIT */}
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/edit-article/:id" element={<EditArticle />} />

        {/* DETAILS */}
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/article/:id" element={<ArticleDetail />} />

        {/* STATIC */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* 🔻 GLOBAL FOOTER */}
      <Footer />
    </Router>
  );
}
