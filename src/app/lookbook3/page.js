"use client";

import React, { useEffect, useState } from "react";
import "./lookbook3.css";

export default function Lookbook3Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="lookbook3-container">
      <iframe
        src="/lookbook3-gallery/index.html"
        className="lookbook3-iframe"
        title="Lookbook3 Infinite Scroll Gallery"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
