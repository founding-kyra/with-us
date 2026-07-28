"use client";
import { useEffect, useRef, useState } from "react";
import "./mvp.css";

export default function MVPPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");
  const formRef = useRef(null);
  
  const fullText = "You're in review.";

  useEffect(() => {
    if (submitted) {
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        i++;
        setTypedText(fullText.slice(0, i));
        if (i >= fullText.length) clearInterval(interval);
      }, 75); // 75ms per character
      return () => clearInterval(interval);
    }
  }, [submitted]);

  const calculateProgress = () => {
    if (!formRef.current) return;
    const fields = formRef.current.querySelectorAll("[required]");
    let total = 0;
    let filled = 0;
    
    const done = (el) => {
      if (el.type === "checkbox") return el.checked;
      if (el.type === "radio") {
        return !!formRef.current.querySelector(`[name="${el.name}"]:checked`);
      }
      return el.value.trim() !== "";
    };

    const names = {};
    fields.forEach((el) => {
      if (el.type === "radio") {
        if (names[el.name]) return;
        names[el.name] = 1;
      }
      total++;
      if (done(el)) filled++;
    });

    const p = Math.round((filled / total) * 100);
    setProgress(p || 0);

    formRef.current.querySelectorAll("section").forEach((s) => {
      const req = s.querySelectorAll("[required]");
      let ok = true;
      req.forEach((el) => {
        if (!done(el)) ok = false;
      });
      s.dataset.done = req.length && ok ? "1" : "0";
    });
  };

  useEffect(() => {
    calculateProgress();
  }, []);

  const handleChange = (e) => {
    calculateProgress();
    if (e.target.name) {
      setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fields = formRef.current.querySelectorAll("[required]");
    
    const done = (el) => {
      if (el.type === "checkbox") return el.checked;
      if (el.type === "radio") {
        return !!formRef.current.querySelector(`[name="${el.name}"]:checked`);
      }
      return el.value.trim() !== "";
    };

    const v = (n) => {
      const e = formRef.current.querySelector(`[name="${n}"]`);
      if (e?.type === 'radio') {
        const checked = formRef.current.querySelector(`[name="${n}"]:checked`);
        return checked ? checked.value : '';
      }
      if (e?.type === 'checkbox') {
        return e.checked;
      }
      return e ? e.value : "";
    };

    const allData = {
      first: v("first"),
      last: v("last"),
      email: v("email"),
      phone: v("phone"),
      city: v("city"),
      region: v("region"),
      ig: v("ig"),
      tt: v("tt"),
      other: v("other"),
      reach: v("reach"),
      niche: v("niche"),
      idea: v("idea"),
      pick1: v("pick1"),
      pick2: v("pick2"),
      size: v("size"),
      ship_name: v("ship_name"),
      addr1: v("addr1"),
      addr2: v("addr2"),
      ship_city: v("ship_city"),
      ship_state: v("ship_state"),
      zip: v("zip"),
      country: v("country"),
      a1: v("a1"),
      a2: v("a2"),
      a3: v("a3"),
      a4: v("a4"),
      a5: v("a5"),
    };

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/mvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allData),
      });

      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit form");
      }

      setFormData(allData);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mvp-page">
      {!submitted && (
        <>
          <div className="rail">
            <div className="rail-in">
              <span className="mono">MVPs — Application</span>
              <div className="bar">
                <span style={{ width: `${progress}%` }}></span>
              </div>
              <span className="mono">{progress}%</span>
            </div>
          </div>

          <header>
            <p className="eyebrow mono">With Us / Los Angeles / Affiliate Program</p>
            <h1 className="wide">WITH US MVPs</h1>
            <p className="lede">A small roster of people who rep With Us before anyone else.</p>
            <dl className="terms">
              <div>
                <dt className="mono">The kit</dt>
                <dd>One seasonal article, free</dd>
              </div>
              <div>
                <dt className="mono">Shipping</dt>
                <dd>On us</dd>
              </div>
              <div>
                <dt className="mono">Your part</dt>
                <dd>Post it, tag us @withus_la</dd>
              </div>
              <div>
                <dt className="mono">Then</dt>
                <dd>Perks scale with performance</dd>
              </div>
            </dl>
          </header>

          <form ref={formRef} onChange={handleChange} onInput={handleChange} onSubmit={handleSubmit} className="main-form">
            <section>
              <div className="num">01</div>
              <div className="head">
                <h2>Who you are</h2>
                <p>So we know who we&apos;re talking to.</p>
                <div className="grid">
                  <div className="f">
                    <label>First name <b className="req">*</b></label>
                    <input name="first" required />
                  </div>
                  <div className="f">
                    <label>Last name <b className="req">*</b></label>
                    <input name="last" required />
                  </div>
                  <div className="f">
                    <label>Email <b className="req">*</b></label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="f">
                    <label>Phone <b className="req">*</b></label>
                    <input type="tel" name="phone" required />
                  </div>
                  <div className="f">
                    <label>City <b className="req">*</b></label>
                    <input name="city" required />
                  </div>
                  <div className="f">
                    <label>State / Region <b className="req">*</b></label>
                    <input name="region" required />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="num">02</div>
              <div className="head">
                <h2>Where you post</h2>
                <p>This is what we look at. Handles must be public.</p>
                <div className="grid">
                  <div className="f">
                    <label>Instagram handle <b className="req">*</b></label>
                    <input name="ig" placeholder="@" required />
                  </div>
                  <div className="f">
                    <label>TikTok handle</label>
                    <input name="tt" placeholder="@" />
                  </div>
                  <div className="f">
                    <label>Anywhere else</label>
                    <input name="other" placeholder="YouTube, Substack, link" />
                  </div>
                  <div className="f">
                    <label>Combined following <b className="req">*</b></label>
                    <select name="reach" required defaultValue="">
                      <option value="" disabled>Select</option>
                      <option>Under 1,000</option>
                      <option>1,000 – 5,000</option>
                      <option>5,000 – 25,000</option>
                      <option>25,000 – 100,000</option>
                      <option>100,000+</option>
                    </select>
                  </div>
                  <div className="f full">
                    <label>What do you post about? <b className="req">*</b></label>
                    <textarea name="niche" rows="2" placeholder="Two sentences is plenty." required></textarea>
                  </div>
                  <div className="f full">
                    <label>How would you shoot this kit? <b className="req">*</b></label>
                    <textarea name="idea" rows="2" placeholder="Where, what format, what vibe." required></textarea>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="num">03</div>
              <div className="head">
                <h2>Your kit</h2>
                <p>Pick what you&apos;ll actually wear. Sizes run true — if you&apos;re between, size up.</p>
                <div className="grid">
                  <div className="f">
                    <label>First choice <b className="req">*</b></label>
                    <select name="pick1" required defaultValue="">
                      <option value="" disabled>Select a piece</option>
                      <option>Mock Vent Tee — Sunset</option>
                      <option>Mock Vent Tee — Night Sky</option>
                      <option>Mesh 2-in-1 Shorts</option>
                      <option>New Era 59Fifty Fitted Hat</option>
                    </select>
                  </div>
                  <div className="f">
                    <label>Backup, if sold out <b className="req">*</b></label>
                    <select name="pick2" required defaultValue="">
                      <option value="" disabled>Select a piece</option>
                      <option>Mock Vent Tee — Sunset</option>
                      <option>Mock Vent Tee — Night Sky</option>
                      <option>Mesh 2-in-1 Shorts</option>
                      <option>New Era 59Fifty Fitted Hat</option>
                    </select>
                  </div>
                  <div className="f full">
                    <label>Size <b className="req">*</b></label>
                    <div className="chips">
                      <label className="chip"><input type="radio" name="size" value="S" required /><span>S</span></label>
                      <label className="chip"><input type="radio" name="size" value="M" /><span>M</span></label>
                      <label className="chip"><input type="radio" name="size" value="L" /><span>L</span></label>
                      <label className="chip"><input type="radio" name="size" value="XL" /><span>XL</span></label>
                      <label className="chip"><input type="radio" name="size" value="2XL" /><span>2XL</span></label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="num">04</div>
              <div className="head">
                <h2>Where to send it</h2>
                <p>We ship it to you directly. Double-check this one — we can&apos;t reroute a package once it&apos;s out.</p>
                <div className="grid">
                  <div className="f full">
                    <label>Name on the package <b className="req">*</b></label>
                    <input name="ship_name" required />
                  </div>
                  <div className="f full">
                    <label>Street address <b className="req">*</b></label>
                    <input name="addr1" required />
                  </div>
                  <div className="f full">
                    <label>Apartment, unit, floor</label>
                    <input name="addr2" />
                  </div>
                  <div className="f">
                    <label>City <b className="req">*</b></label>
                    <input name="ship_city" required />
                  </div>
                  <div className="f">
                    <label>State <b className="req">*</b></label>
                    <input name="ship_state" required />
                  </div>
                  <div className="f">
                    <label>ZIP <b className="req">*</b></label>
                    <input name="zip" required />
                  </div>
                  <div className="f">
                    <label>Country <b className="req">*</b></label>
                    <input name="country" defaultValue="United States" required />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="num">05</div>
              <div className="head">
                <h2>The deal</h2>
                <p>Short, and we hold you to it.</p>
                <div className="checks">
                  <label className="check"><input type="checkbox" name="a1" required /><span>I&apos;ll post the fit at least <b>three times</b> in my first 30 days.</span></label>
                  <label className="check"><input type="checkbox" name="a2" required /><span>I&apos;ll tag <b>@withus_la</b> in every post and story.</span></label>
                  <label className="check"><input type="checkbox" name="a3" required /><span>With Us can repost and reuse my content across their channels and ads.</span></label>
                  <label className="check"><input type="checkbox" name="a4" required /><span>One free fit per person. Item not for resale.</span></label>
                  <label className="check"><input type="checkbox" name="a5" /><span>Send me texts and emails about drops. (Optional)</span></label>
                </div>
              </div>
            </section>

            <div className="submit">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Apply to the roster"}
              </button>
              <p className="fine">We review every application by hand. If you&apos;re in, you&apos;ll hear from us within 5 business days.</p>
            </div>
            {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
          </form>
        </>
      )}

      {submitted && (
        <div className="done on" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", minHeight: "60vh", justifyContent: "center", paddingTop: "8rem" }}>
          <h1 className="wide" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", marginBottom: "1rem" }}>THANK YOU</h1>
          <h2 className="wide" style={{ color: "var(--mid)", marginBottom: "1.5rem" }}>
            {typedText}<span className="blink-cursor">|</span>
          </h2>
          <p style={{ maxWidth: "42ch", marginBottom: "3rem" }}>We read every one of these. If it&apos;s a fit, your article ships within a week of approval — nothing else for you to do.</p>
          
          <div className="card" style={{ textAlign: "left", width: "100%" }}>
            <p className="mono">With Us — MVP Roster</p>
            <p className="name">{formData.first} {formData.last}</p>
            <p className="mono">{formData.ig || "—"}</p>
            <hr />
            <dl>
              <dt>Status</dt>
              <dd>Pending review</dd>
              <dt>Kit</dt>
              <dd>{formData.pick1 || "—"}</dd>
              <dt>Size</dt>
              <dd>{formData.size || "—"}</dd>
              <dt>Ships to</dt>
              <dd>{formData.ship_city ? `${formData.ship_city}, ${formData.ship_state}` : "—"}</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
