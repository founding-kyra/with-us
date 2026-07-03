import "./Footer.css";
import Link from "next/link";

import ContactForm from "../ContactForm/ContactForm";

const Footer = () => {
  return (
    <>
      <ContactForm />

      <footer>
        <div className="container">
          <div className="footer-row">
            <div className="footer-col">
              <div className="footer-col-links">
                <Link href="/">Home</Link>
                <Link href="/wardrobe">Wardrobe</Link>
                <Link href="/genesis">Genesis</Link>
                <Link href="/touchpoint">Contact Us</Link>
                <Link href="/client-services">Client Services</Link>
                <Link href="/lookbook">Lookbook</Link>
              </div>
            </div>
            <div className="footer-col">
              <div className="footer-col-header">
                <p className="bodyCopy">Connect Feed</p>
              </div>
              <div className="footer-col-links">
                <a
                  href="https://www.instagram.com/with_us_world?igsh=MTFzN3h5b29yeHVmMg=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>

              </div>
            </div>

          </div>
          <div className="footer-row">
            <div className="footer-copyright">
              <img src="/logo/logo-with-us-text-dark.png" alt="WITHUS" className="footer-logo" />
              <p className="bodyCopy">&copy;2026 All modules reserved.</p>
              <p className="bodyCopy" id="copyright-text">
                Creative Direction by Kyra Aulani
              </p>
              <p className="bodyCopy" id="copyright-text">
                Built by Razal
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
