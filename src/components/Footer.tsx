"use client";

import Link from "next/link";
import { Mail, Heart } from "lucide-react";
import { SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons";
import { useEffect, useRef, useState } from "react";
import styles from "./Footer.module.css";
import { CITIES, SERBIA_PATH, SERBIA_VIEWBOX } from "./footer-data";

// Determinističan "nasumičan" broj 0..1 na osnovu indeksa, da svaka tačkica
// trepće svojim ritmom, a da SSR i klijent daju iste vrednosti (bez hydration upozorenja).
function seeded(i: number): number {
  const x = Math.sin(i * 99.13) * 43758.5453;
  return x - Math.floor(x);
}

// Linkovi — promeni href-ove ako se neka stranica drugačije zove.
const NAV = [
  {
    title: "Otkrij",
    links: [
      { label: "Katalog", href: "/katalog" },
      { label: "Radnje", href: "/radnje" },
      { label: "Priče", href: "/magazin" },
      { label: "Saveti", href: "/saveti" },
    ],
  },
  {
    title: "Pomoć",
    links: [
      { label: "O nama", href: "/o-nama" },
      { label: "Za prodavce", href: "/postani-prodavac" },
      { label: "Česta pitanja", href: "/pomoc" },
    ],
  },
];

const LEGAL = [
  { label: "Privatnost", href: "/privatnost" },
  { label: "Uslovi korišćenja", href: "/uslovi" },
];

// Kontakt podaci — zameni pravim vrednostima.
const SOCIAL = {
  instagram: "https://instagram.com/zlatne.ruke",
  instagramLabel: "@zlatne.ruke",
  facebook: "https://facebook.com/zlatneruke",
  facebookLabel: "Zlatne Ruke",
  email: "kontakt@zlatneruke.rs",
};

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* Glavni red */}
      <div className={`${styles.inner} ${styles.main}`}>
        {/* Brend + kontakt */}
        <div className={styles.brand}>
          <div className={`${styles.name} ${styles.script}`}>Zlatne Ruke</div>
          <div className={`${styles.slogan} ${styles.script}`}>
            Kad žena stvara srcem, nastaje magija.
          </div>
          <p className={styles.desc}>
            Katalog rukotvorina žena iz Srbije. Svaki predmet ima ime, mesto i
            priču.
          </p>
          <p className={styles.socLabel}>Kontakt</p>
          <div className={styles.soc}>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${SOCIAL.instagramLabel}`}
            >
              <SiInstagram size={16} aria-hidden="true" />
              <span className={styles.tip}>{SOCIAL.instagramLabel}</span>
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Facebook ${SOCIAL.facebookLabel}`}
            >
              <SiFacebook size={16} aria-hidden="true" />
              <span className={styles.tip}>{SOCIAL.facebookLabel}</span>
            </a>
            <a
              href={`mailto:${SOCIAL.email}?subject=${encodeURIComponent(
                "Pitanja, predlozi"
              )}`}
              aria-label="Pošalji email"
            >
              <Mail size={16} aria-hidden="true" />
              <span className={styles.tip}>Pitanja, predlozi</span>
            </a>
          </div>
        </div>

        {/* Kolone linkova (grupisane u sredini) */}
        <div className={styles.cols}>
          {NAV.map((col) => (
            <div key={col.title} className={styles.col}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mapa Srbije sa gradovima koji svetlucaju */}
        <div className={styles.map}>
          <svg
            className={styles.mapSvg}
            viewBox={SERBIA_VIEWBOX}
            fill="none"
            aria-hidden="true"
          >
            <path
              d={SERBIA_PATH}
              fill="rgba(192,99,122,0.07)"
              stroke="#C0637A"
              strokeWidth={1.3}
            />
            {CITIES.map((city, i) => {
              const dur = (2.2 + seeded(i) * 1.7).toFixed(2);
              const delay = (i * 0.11 + 0.6 + seeded(i + 7) * 0.7).toFixed(2);
              const style = {
                transitionDelay: revealed ? `${(i * 0.11).toFixed(2)}s` : "0s",
                "--tw-dur": `${dur}s`,
                "--tw-delay": `${delay}s`,
              } as React.CSSProperties;

              if (city.capital) {
                return (
                  <g key={city.name}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={6}
                      className={`${styles.ring} ${
                        revealed ? styles.ringShown : ""
                      }`}
                    />
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={4.6}
                      className={`${styles.city} ${styles.capital} ${
                        revealed
                          ? `${styles.cityShown} ${styles.capitalShown}`
                          : ""
                      }`}
                      style={style}
                    />
                  </g>
                );
              }

              return (
                <circle
                  key={city.name}
                  cx={city.x}
                  cy={city.y}
                  r={3.4}
                  className={`${styles.city} ${
                    revealed ? styles.cityShown : ""
                  }`}
                  style={style}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Poruka zahvalnosti */}
      <div className={`${styles.inner} ${styles.ribbon} ${styles.script}`}>
        <Heart size={18} aria-hidden="true" style={{ color: "#C0637A" }} />
        Hvala što čuvate i delite ručni rad žena iz Srbije.
      </div>

      {/* Tamna pravna traka */}
      <div className={styles.bottomWrap}>
        <div className={`${styles.inner} ${styles.bottom}`}>
          <div className={styles.legal}>
            {LEGAL.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <span>
            © {new Date().getFullYear()} Zlatne Ruke · Srbija · Prodavci
            dogovaraju plaćanje i dostavu direktno sa kupcima
          </span>
        </div>
      </div>
    </footer>
  );
}
