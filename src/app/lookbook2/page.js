"use client";

import React, { useEffect, useState } from "react";
import CurveGallery from "@/components/CurveGallery/CurveGallery";

export default function Lookbook2Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CurveGallery />
    </div>
  );
}
