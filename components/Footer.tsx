import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="brand"><span className="brand-mark">g<span>✳</span></span><span>garnishii</span></Link>
          <p>A little more clarity for your next big thing.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explore</span><Link href="/explore">All careers</Link><Link href="/#industries">Industries</Link><Link href="/compare">Compare careers</Link></div>
          <div><span className="footer-label">Garnishii</span><Link href="/about">Our story</Link><Link href="/saved">Saved careers</Link></div>
        </div>
        <div className="footer-note"><span className="sparkle">✳</span><p>Your future doesn’t have to be figured out all at once.</p><Link href="/explore">Take a first look </Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Garnishii. Made for curious minds.</span><span>Profession details are marked by verification status.</span></div>
    </footer>
  );
}
