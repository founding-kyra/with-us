"use client";

import React, { useEffect, useState } from "react";
import "./community.css";

export default function CommunityPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="community-container">
      <iframe
        src="/lookbook3-gallery/index.html"
        className="community-iframe"
        title="WITHUS Community Gallery"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
