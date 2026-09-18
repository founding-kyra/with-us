"use client";
import "./touchpoint.css";
import Copy from "@/components/Copy/Copy";
import BrandIcon from "@/components/BrandIcon/BrandIcon";
import { FiMail, FiMessageSquare, FiArrowRight } from "react-icons/fi";

export default function Touchpoint() {
  return (
    <>
      <section className="contact-hero">
        <div className="contact-bg-wrapper">
          <img src="/contact/architectural-bg.jpg" alt="Minimal Architecture" className="contact-bg-img" />
          <div className="contact-bg-gradient"></div>
        </div>
        <div className="container">
          <div className="contact-hero-col contact-hero-copy">
            <div className="contact-header">
              <Copy animateOnScroll={false} delay={0.75}>
                <h3>
                  OUTBOUND<br />
                  ACCESS IS<br />
                  LIMITED,<br />
                  PROCEED<br />
                  WITH INTENT.
                </h3>
              </Copy>
            </div>
            
            <div className="contact-lower">
              <div className="contact-meta">
                <div className="contact-meta-divider"></div>
                <div className="contact-inquiry-label">
                  <Copy animateOnScroll={false} delay={0.9}>
                    <p className="bodyCopy contact-label">Dispatch Inquiry System</p>
                  </Copy>
                </div>
                
                <div className="contact-cta-cards">
                  <Copy animateOnScroll={false} delay={1}>
                    <a href="mailto:hello@withusla.com" className="cta-card">
                      <div className="cta-icon-wrapper">
                        <FiMail size={20} strokeWidth={1.5} />
                      </div>
                      <div className="cta-text-wrapper">
                        <span className="cta-sub">EMAIL US</span>
                        <span className="cta-main">HELLO@WITHUSLA.COM</span>
                      </div>
                      <FiArrowRight size={22} strokeWidth={1.5} className="cta-arrow" />
                    </a>
                  </Copy>
                  
                  <Copy animateOnScroll={false} delay={1.1}>
                    <a href="/contact" className="cta-card">
                      <div className="cta-icon-wrapper">
                        <FiMessageSquare size={20} strokeWidth={1.5} />
                      </div>
                      <div className="cta-text-wrapper">
                        <span className="cta-sub">SEND A MESSAGE</span>
                        <span className="cta-main">CONTACT FORM</span>
                      </div>
                      <FiArrowRight size={22} strokeWidth={1.5} className="cta-arrow" />
                    </a>
                  </Copy>
                </div>
              </div>
              
              <div className="contact-badge-wrapper">
                <BrandIcon />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
