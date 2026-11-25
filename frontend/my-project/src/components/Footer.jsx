
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">
          <h2>Re<span>Find</span></h2>

          <p>
            ReFind is a lost and found portal that helps
            people reconnect with their missing belongings.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/browse">Browse Items</Link>
          <Link to="/report?type=lost">Report Lost</Link>
          <Link to="/report?type=found">Report Found</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: support@refind.com</p>
          <p>Website: ReFind Portal</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 ReFind. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
