import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-wrapper">
      <div className="contact-card">
        <h2>Contact RocketForm</h2>
        <p>We’d love to hear from you</p>

        {/* Formspree Form */}
        <form
          action="https://formspree.io/f/mgvgjend"
          method="POST"
        >
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
          />

          <textarea
            name="message"
            placeholder="Your message"
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
