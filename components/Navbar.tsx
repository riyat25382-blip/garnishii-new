"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/explore", label: "Explore careers" },
  { href: "/#industries", label: "Industries" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="brand" aria-label="Garnishii home">
          <span className="brand-mark">g<span>✳</span></span>
          <span>garnishii</span>
        </Link>
        <nav className={`main-nav ${open ? "main-nav--open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link className="nav-saved" href="/saved" onClick={() => setOpen(false)}>Saved <span>♡</span></Link>
        </nav>
        <Link className="nav-cta" href="/explore">Find your path </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}
