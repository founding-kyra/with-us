import "./ContactForm.css";

import { MdOutlineArrowOutward } from "react-icons/md";

const ContactForm = () => {
  return (
    <section className="contact-form">
      <div className="contact-parallax-image-wrapper">
        <h1>WITHUS</h1>
        <img src="/contact-form/group-shot_withus_footer.png" alt="" />
      </div>
      <div className="contact-form-container">
        <div className="cf-header">
          <h4>I&apos;m With Us.</h4>
        </div>
        <div className="cf-copy">
          <p className="bodyCopy sm">
            New releases.<br />
            Limited drops.<br />
            Nothing unnecessary.
          </p>
        </div>
        <div className="cf-input">
          <input type="text" placeholder="Enter Signal Address" />
        </div>
        <button className="cf-submit-btn">
          Join the Crew
        </button>

      </div>
    </section>
  );
};

export default ContactForm;
