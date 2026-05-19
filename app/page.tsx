"use client";
import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { IBM_Plex_Sans, Noto_Sans_JP } from "next/font/google";

import SuzukiCapsuleButton from "@/components/SuzukiCapsuleButton";

const fontDisplay = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const fontBody = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/** Estrelas oficiais da identidade (arquivos em /public) */
const STAR_SRC = [
  "/estrela-verde.svg",
  "/estrela-amarela.svg",
  "/estrela-laranja.svg",
] as const;

const STAR_MOTION_CLASS = [
  "suzuki-star-motion",
  "suzuki-star-motion-alt",
  "suzuki-star-motion-drift",
] as const;

/**
 * top%, left%, size(px), opacity (100%), duração 8–16s, delay(s), motion 0–2, variante 0=verde 1=amarela 2=laranja
 */
const STAR_SPECS = [
  [4, 5, 36, 1, 14, 0.2, 0, 0],
  [7, 94, 32, 1, 18, 1.4, 1, 2],
  [11, 2, 29, 1, 12, 0.6, 2, 1],
  [18, 96, 31, 1, 19, 2.1, 0, 0],
  [28, 3, 26, 1, 13, 0.3, 1, 2],
  [36, 97, 34, 1, 20, 1.9, 2, 1],
  [44, 1, 25, 1, 12, 2.6, 0, 0],
  [52, 95, 29, 1, 15, 0.8, 1, 2],
  [70, 4, 38, 1, 16, 0.4, 2, 1],
  [76, 90, 35, 1, 14, 1.7, 0, 2],
  [73, 14, 28, 1, 19, 2.9, 1, 0],
  [86, 6, 31, 1, 10, 1.1, 2, 1],
  [90, 88, 36, 1, 16, 0.5, 0, 2],
  [93, 48, 24, 1, 18, 2.3, 1, 0],
] as const;

/** Flutuação ampla (vw/vh); linear + keyframes em passos regulares = velocidade espacial mais uniforme, sem “arrastar e parar”. */
const SUZUKI_STAR_LAYER_CSS = `
@keyframes suzuki-star-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  10% { transform: translate3d(8vw, -4vh, 0) rotate(1deg); }
  20% { transform: translate3d(20vw, -7vh, 0) rotate(2deg); }
  30% { transform: translate3d(32vw, -4vh, 0) rotate(3deg); }
  40% { transform: translate3d(44vw, 2vh, 0) rotate(3.5deg); }
  50% { transform: translate3d(52vw, 6vh, 0) rotate(4deg); }
  60% { transform: translate3d(42vw, 11vh, 0) rotate(2deg); }
  70% { transform: translate3d(26vw, 12vh, 0) rotate(0deg); }
  80% { transform: translate3d(8vw, 7vh, 0) rotate(-2deg); }
  90% { transform: translate3d(-6vw, -4vh, 0) rotate(-2deg); }
}
@keyframes suzuki-star-float-alt {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  10% { transform: translate3d(-8vw, 4vh, 0) rotate(-1deg); }
  20% { transform: translate3d(-20vw, 8vh, 0) rotate(-2deg); }
  30% { transform: translate3d(-34vw, 5vh, 0) rotate(-3deg); }
  40% { transform: translate3d(-46vw, -2vh, 0) rotate(-4deg); }
  50% { transform: translate3d(-56vw, 4vh, 0) rotate(-3deg); }
  60% { transform: translate3d(-44vw, 12vh, 0) rotate(-1deg); }
  70% { transform: translate3d(-28vw, 14vh, 0) rotate(1deg); }
  80% { transform: translate3d(-14vw, 6vh, 0) rotate(2deg); }
  90% { transform: translate3d(-4vw, -6vh, 0) rotate(2deg); }
}
@keyframes suzuki-star-float-drift {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  10% { transform: translate3d(6vw, -10vh, 0) rotate(1.5deg); }
  20% { transform: translate3d(14vw, -18vh, 0) rotate(2.5deg); }
  30% { transform: translate3d(4vw, -24vh, 0) rotate(2deg); }
  40% { transform: translate3d(-10vw, -22vh, 0) rotate(0deg); }
  50% { transform: translate3d(-20vw, -10vh, 0) rotate(-2deg); }
  60% { transform: translate3d(-18vw, 6vh, 0) rotate(-3deg); }
  70% { transform: translate3d(-6vw, 16vh, 0) rotate(-2deg); }
  80% { transform: translate3d(10vw, 20vh, 0) rotate(0deg); }
  90% { transform: translate3d(18vw, 8vh, 0) rotate(1.5deg); }
}
@media (prefers-reduced-motion: no-preference) {
  .suzuki-star-motion {
    animation: suzuki-star-float var(--suzuki-dur, 12s) linear var(--suzuki-delay, 0s) infinite;
  }
  .suzuki-star-motion-alt {
    animation: suzuki-star-float-alt var(--suzuki-dur, 12s) linear var(--suzuki-delay, 0s) infinite;
  }
  .suzuki-star-motion-drift {
    animation: suzuki-star-float-drift var(--suzuki-dur, 12s) linear var(--suzuki-delay, 0s) infinite;
  }
}
@media (prefers-reduced-motion: reduce) {
  .suzuki-star-motion,
  .suzuki-star-motion-alt,
  .suzuki-star-motion-drift {
    animation: none !important;
  }
}
`;

function SuzukiStarLayerStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: SUZUKI_STAR_LAYER_CSS,
      }}
    />
  );
}

function StarField() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] overflow-visible"
      aria-hidden
    >
      {STAR_SPECS.map(([top, left, size, opacity, dur, delay, motion, variant], i) => (
        <img
          key={`star-${STAR_SRC[variant]}-${i}`}
          src={STAR_SRC[variant]}
          alt=""
          width={size}
          height={size}
          className={`absolute object-contain select-none will-change-transform ${STAR_MOTION_CLASS[motion]}`}
          style={
            {
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              opacity,
              ["--suzuki-dur" as string]: `${dur}s`,
              ["--suzuki-delay" as string]: `${delay}s`,
            } as CSSProperties
          }
          draggable={false}
        />
      ))}
    </div>
  );
}
  
  function WordmarkLogo() {
  return (
    <a
      href="/"
      className="block shrink-0 transition-opacity duration-300 hover:opacity-[0.88] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123126]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f2]"
    >
      <Image
        src="/logo-suzuki.svg"
        alt="Escola Suzuki"
        width={208}
        height={56}
        className="h-8 w-auto sm:h-9"
        priority
      />
    </a>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const link =
    "text-[0.72rem] font-normal uppercase tracking-[0.2em] text-[#123126]/55 transition-colors duration-300 hover:text-[#f0743e]";

  const whatsappUrl =
    "https://wa.me/5511945468423?text=Ol%C3%A1%2C%20estou%20realizando%20a%20pesquisa%20formativa%20da%20Escola%20Suzuki%20e%20gostaria%20de%20falar%20com%20voc%C3%AAs.";

  return (
    <header className="suzuki-enter suzuki-enter-delay-1 relative z-30 border-b border-[#123126]/[0.06] bg-[#faf8f2]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf8f2]/65">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8 sm:py-5 md:px-12 lg:px-16">
        <WordmarkLogo />

        <nav
          className={`${fontDisplay.className} absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex md:items-center md:gap-10`}
          aria-label="Principal"
        >
          <a className={link} href="/">Recomeçar</a>
          <a className={link} href="https://escolasuzuki.com.br" target="_blank" rel="noopener noreferrer">
            Site oficial
          </a>
        </nav>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hidden shrink-0 md:block">
          <SuzukiCapsuleButton size="sm">Fale conosco</SuzukiCapsuleButton>
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25282b] text-white md:hidden"
          aria-label="Abrir menu"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className={`${fontDisplay.className} border-t border-[#123126]/[0.06] bg-[#faf8f2]/95 px-5 py-5 md:hidden`}>
          <div className="flex flex-col gap-5">
            <a className={link} href="/">Recomeçar</a>
            <a className={link} href="https://escolasuzuki.com.br" target="_blank" rel="noopener noreferrer">
              Site oficial
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-fit">
              <SuzukiCapsuleButton size="sm">Fale conosco</SuzukiCapsuleButton>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden">
      <SuzukiStarLayerStyles />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#faf8f2] via-[#f5f1e8] to-[#efe9dd]"
      />
      <StarField />

      <main
        className={`${fontBody.className} relative z-10 flex min-h-dvh w-full flex-col bg-transparent text-[#123126] antialiased selection:bg-[#f0743e]/15 selection:text-[#123126]`}
      >
        <SiteHeader />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col overflow-x-hidden px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 md:px-12 md:pb-24 md:pt-12 lg:px-16 lg:pt-14">
          <p
            className={`suzuki-enter suzuki-enter-delay-2 ${fontDisplay.className} relative text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#123126]/72 sm:text-xs`}
          >
            Escola Suzuki — Pesquisa formativa
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="relative lg:col-span-7">
              <h1
                className={`suzuki-enter suzuki-enter-delay-3 ${fontDisplay.className} relative text-[2.15rem] font-light leading-[1.12] tracking-[-0.02em] text-[#123126] sm:text-4xl md:text-[2.75rem] lg:text-5xl`}
              >
                <span className="relative inline-block">
                  A infância
                  <svg
                    className="pointer-events-none absolute -bottom-1 left-0 h-3 w-[4.2rem] text-[#f0743e]/40 sm:w-[5rem]"
                    viewBox="0 0 120 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2 10C28 2 72 2 118 8"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                escuta antes
                <br />
                <span className="text-[#123126]/92">de compreender.</span>
              </h1>

              <p className="suzuki-enter suzuki-enter-delay-4 mt-10 max-w-xl text-[0.95rem] font-light leading-relaxed text-[#123126]/88 sm:text-base md:mt-12 md:text-[1.05rem] md:leading-[1.75]">
                Uma pesquisa breve e contemplativa, construída a partir da
                neurociência do desenvolvimento, da filosofia Suzuki e de quase
                quatro décadas de prática pedagógica com gestantes, bebês,
                crianças e educadores.
              </p>

              <div
                className="suzuki-enter suzuki-enter-delay-4 mt-8 hidden max-w-md text-[#f0743e]/25 sm:block"
                aria-hidden
              >
                <svg viewBox="0 0 200 32" className="w-full" fill="none">
                  <path
                    d="M4 24c18-16 40-16 58 0s40 16 58 0 40-16 58 0"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="suzuki-enter suzuki-enter-delay-5 mt-12 flex flex-col items-start gap-5">
              <a className="inline-block" href="/identificacao">
  <SuzukiCapsuleButton size="md">
    Começar pesquisa
  </SuzukiCapsuleButton>
</a>

                <div className="pl-1">
                  <p
                    className={`${fontDisplay.className} text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#123126]`}
                  >
                    SAA
                  </p>
                  <p className="mt-1 max-w-[280px] text-[0.78rem] font-light leading-relaxed text-[#123126]/62">
                    Reconhecida pela Suzuki Association of the Americas.
                  </p>
                </div>
              </div>
            </div>

            <aside className="suzuki-enter suzuki-enter-delay-3 relative lg:col-span-5 lg:pt-2">
              <div className="relative mx-auto w-full max-w-[430px] lg:ml-auto">
              <div className="hero-gradient-border relative rounded-[40px_40px_140px_40px] p-[4px] shadow-[0_20px_60px_rgba(18,49,38,0.08)]">
  <div className="relative overflow-hidden rounded-[38px_38px_138px_38px] bg-[#ede7db]">
              <Image
  src="/hero-suzuki-v2.webp"
  alt="professor e criança em momento musical contemplativo"
  width={900}
  height={1200}
  priority
  className="h-[560px] w-full scale-[1.22] object-cover object-[50%_22%]"
/>

<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#123126]/10 via-transparent to-[#f5f1e8]/10" />
  </div>
</div>

<div className="absolute bottom-[-18px] left-4 right-4 max-w-none rounded-[28px] border border-[#123126]/[0.06] bg-[#FFE485]/90 p-5 shadow-[0_10px_40px_rgba(18,49,38,0.06)] backdrop-blur-md lg:-left-12 lg:right-auto lg:max-w-[330px] lg:p-6">
                  <span
                    className="absolute left-0 top-5 bottom-5 w-px bg-gradient-to-b from-[#f0743e]/20 via-[#f0743e]/60 to-[#f0743e]/10"
                    aria-hidden
                  />

                  <p className="text-[0.92rem] font-normal leading-relaxed text-[#123126]/84">
                    <span className="font-serif text-[1.15em] leading-none text-[#f0743e]/55">
                      “
                    </span>
                    Não é um teste. É um percurso de escuta sobre como a música,
                    o vínculo e a presença formam, desde os primeiros dias, o ser
                    humano que está chegando.
                    <span className="font-serif text-[1.15em] leading-none text-[#f0743e]/55">
                      ”
                    </span>
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <footer className="suzuki-enter suzuki-enter-delay-6 mt-20 grid gap-14 border-t border-[#123126]/12 pt-14 sm:mt-24 sm:gap-12 sm:pt-16 md:grid-cols-3 md:gap-10 lg:mt-28 lg:pt-20">
            <div>
              <p className={`${fontDisplay.className} text-[0.7rem] font-medium tabular-nums tracking-[0.2em] text-[#f0743e]`}>
                01
              </p>
              <h2 className={`${fontDisplay.className} mt-3 text-sm font-medium tracking-wide text-[#123126]`}>
                Neurociência
              </h2>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[#123126]/78">
                Os primeiros mil dias formam a arquitetura do cérebro humano. A
                escuta organiza linguagem, ritmo e vínculo.
              </p>
            </div>

            <div>
              <p className={`${fontDisplay.className} text-[0.7rem] font-medium tabular-nums tracking-[0.2em] text-[#f0743e]`}>
                02
              </p>
              <h2 className={`${fontDisplay.className} mt-3 text-sm font-medium tracking-wide text-[#123126]`}>
                Filosofia Suzuki
              </h2>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[#123126]/78">
                “Caráter primeiro, habilidade depois.” A música como caminho de
                formação humana, não como técnica isolada.
              </p>
            </div>

            <div>
              <p className={`${fontDisplay.className} text-[0.7rem] font-medium tabular-nums tracking-[0.2em] text-[#f0743e]`}>
                03
              </p>
              <h2 className={`${fontDisplay.className} mt-3 text-sm font-medium tracking-wide text-[#123126]`}>
                SECE
              </h2>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[#123126]/78">
                Suzuki Early Childhood Education: o trabalho de fundação, da
                gestação aos 4 anos, em ambiente afetivo cuidado.
              </p>
            </div>
          </footer>
        </div>
        <style jsx>{`
  @property --border-angle {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }

  .hero-gradient-border {
    position: relative;
    background: linear-gradient(
      135deg,
      rgba(240, 116, 62, 0.95),
      rgba(255, 205, 180, 0.9),
      rgba(240, 116, 62, 0.95)
    );
  }

  /* GLOW SUAVE */
  .hero-gradient-border::before {
    content: "";
    position: absolute;
    inset: -18px;
    border-radius: 58px 58px 158px 58px;
    pointer-events: none;
    z-index: 2;

    background:
      radial-gradient(
        circle at 76% 24%,
        rgba(240, 116, 62, 0.22) 0%,
        rgba(240, 116, 62, 0.14) 8%,
        rgba(240, 116, 62, 0.08) 14%,
        transparent 24%
      );

    filter: blur(14px);

    animation:
      soundWaveMove 4.5s linear infinite,
      soundWavePulse 2.4s ease-in-out infinite;
  }

  /* BORDA ANIMADA */
  .hero-gradient-border::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 40px 40px 140px 40px;
    padding: 3px;
    pointer-events: none;
    z-index: 5;

    background: conic-gradient(
      from var(--border-angle),
      transparent 0deg,
      transparent 250deg,
      rgba(240, 116, 62, 0.12) 274deg,
      rgba(240, 116, 62, 0.55) 288deg,
      rgba(255, 247, 239, 0.92) 302deg,
      #ffffff 309deg,
      #f0743e 318deg,
      rgba(240, 116, 62, 0.82) 330deg,
      rgba(240, 116, 62, 0.22) 342deg,
      transparent 360deg
    );

    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);

    -webkit-mask-composite: xor;
    mask-composite: exclude;

    filter:
      drop-shadow(0 0 8px rgba(240, 116, 62, 0.95))
      drop-shadow(0 0 18px rgba(240, 116, 62, 0.45))
      drop-shadow(0 0 28px rgba(240, 116, 62, 0.18));

    animation: borderLightOrbit 4.5s linear infinite;

    mix-blend-mode: screen;
  }

  @keyframes borderLightOrbit {
    to {
      --border-angle: 360deg;
    }
  }

  @keyframes soundWaveMove {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes soundWavePulse {
    0%, 100% {
      opacity: 0.25;
      transform: scale(1);
    }

    50% {
      opacity: 0.7;
      transform: scale(1.04);
    }
  }
`}</style>
      </main>
    </div>
  );
}