"use client";
import React, { useState } from "react";
import "./Accordion.css";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index, e) => {
    e.stopPropagation();
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="accordion-container">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className={`accordion-item ${isOpen ? "open" : ""}`} key={index}>
            <button
              type="button"
              className="accordion-header"
              onClick={(e) => toggleAccordion(index, e)}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{item.question}</span>
              <span className="accordion-icon">{isOpen ? "—" : "+"}</span>
            </button>
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
