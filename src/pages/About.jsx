import "./About.css";

export default function About() {
  return (
    <div className="about-wrapper">
      <div className="about-box">
        <div className="about-header">
          <h2>About RocketForm</h2>
          <span className="about-badge">Content Platform</span>
        </div>

        <p className="about-intro">
          RocketForm is a modern platform built for creators who want to
          publish articles, blogs, and vlog-style posts with speed and clarity.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>🚀 Our Mission</h3>
            <p>
              To simplify content publishing and give creators a clean,
              distraction-free space to share ideas.
            </p>
          </div>

          <div className="about-card">
            <h3>⚡ What We Do</h3>
            <p>
              We provide tools to write, publish, and manage posts with a
              professional and minimal interface.
            </p>
          </div>

          <div className="about-card">
            <h3>💡 Why RocketForm</h3>
            <p>
              No noise, no clutter — just focus on your content and let your
              ideas speak.
            </p>
          </div>
        </div>

        <div className="about-footer">
          Built with ❤️ for creators
        </div>
      </div>
    </div>
  );
}
