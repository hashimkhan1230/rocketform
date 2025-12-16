import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h3>
            Rocket<span>Form</span>
          </h3>
          <p>
            A modern platform to share posts, articles, and ideas with the world.
          </p>

          {/* SOCIAL ICONS */}
          <div className="footer-social">
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/hashimkhan1230" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://wa.me/918859876802" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
       
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} RocketForm · Developed by{" "}
        <span className="dev-name">Hashim Pathan</span>
      </div>
    </footer>
  );
}
