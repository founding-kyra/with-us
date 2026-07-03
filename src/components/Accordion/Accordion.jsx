"use client";
import React, { useState } from "react";
import "./Accordion.css";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="accordion-container">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className={`accordion-item ${isOpen ? "open" : ""}`} key={index}>
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleAccordion(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{item.question}</span>
              <span className="accordion-icon">{isOpen ? "—" : "+"}</span>
            </div>
            <div
              className="accordion-content"
              style={{
                maxHeight: isOpen ? "2000px" : "0px",
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? "auto" : "none",
              }}
            >
              <div className="accordion-content-inner">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
