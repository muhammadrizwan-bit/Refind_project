
import { Link } from "react-router-dom";
import "./hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-label">
          YOUR LOST ITEM, FOUND AGAIN
        </span>

        <h1>
          Lost Something?
          <br />
          <span>Let's Find It Together.</span>
        </h1>

        <p>
          ReFind helps people reconnect with their lost
          belongings. Report lost items, share found items,
          and help someone find what they are looking for.
        </p>

        <div className="hero-actions">

          <Link to="/report?type=lost" className="hero-lost-btn">
            Report Lost Item
          </Link>

          <Link to="/report?type=found" className="hero-found-btn">
            Report Found Item
          </Link>

        </div>

      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700"
          alt="Lost belongings backpack"
        />
      </div>

    </section>
  );
}

export default Hero;
