"use client";

import React, { useEffect } from "react";
import AOS from "aos";

import "aos/dist/aos.css";

import Footer from "~/components/ui/footer";
import Header from "~/components/ui/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  return (
    <div style={{ fontFamily: "Pixelify Sans" }}>
      <Header />

      <main className="grow">{children}</main>

      {/* <Footer border={true} /> */}
    </div>
  );
}
