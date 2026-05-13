'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { IBM_Plex_Sans, Noto_Sans_JP } from "next/font/google";

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

function SuzukiCapsuleButton({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      className={`${fontDisplay.className} group inline-flex items-center rounded-full border-0 bg-transparent p-0 font-medium uppercase tracking-[0.14em] text-[#f5f1e8] ${className}`}
    >
      <span
className={`relative z-10 flex shrink-0 items-center justify-center rounded-full bg-[#f0743e] text-[#25282b] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
  ${
    isSm
      ? "group-hover:translate-x-[calc(100%+5.5rem)] h-8 w-8"
      : "group-hover:translate-x-[calc(100%+9.8rem)] h-11 w-11"
  }`}        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className={isSm ? "h-3.5 w-3.5" : "h-4.5 w-4.5"}
          fill="currentColor"
        >
          <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
        </svg>
      </span>

      <span
        className={`relative z-0 -ml-1 flex items-center rounded-full bg-[#25282b] text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[calc(2.75rem+0.25rem)] ${
          isSm
            ? "min-h-8 px-5 pl-6 text-[0.62rem]"
            : "min-h-11 px-8 pl-9 text-[0.72rem]"
        }`}
      >
        {children}
      </span>
    </button>
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
  const link =
    "text-[0.72rem] font-normal uppercase tracking-[0.2em] text-[#123126]/55 transition-colors duration-300 hover:text-[#f0743e]";

  return (
    <header className="suzuki-enter suzuki-enter-delay-1 relative z-30 border-b border-[#123126]/[0.06] bg-[#faf8f2]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf8f2]/65">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8 sm:py-5 md:px-12 lg:px-16">
        <WordmarkLogo />

        <nav
          className={`${fontDisplay.className} absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex md:items-center md:gap-10`}
          aria-label="Principal"
        >
          <a className={link} href="#">
            Início
          </a>
          <a className={link} href="#">
            Formação
          </a>
          <a className={link} href="#">
            SECE
          </a>
        </nav>

        <SuzukiCapsuleButton size="sm" className="shrink-0">
          Fale conosco
        </SuzukiCapsuleButton>
      </div>
    </header>
  );
}

export default function Home() {
    const [nome, setNome] = useState("");
const [percentual, setPercentual] = useState(0);
const [nivel, setNivel] = useState("");
useEffect(() => {
    setNome(localStorage.getItem("usuarioNome") || "");
  
    setPercentual(
      Number(localStorage.getItem("resultadoPercentual") || "0")
    );
  
    setNivel(
      localStorage.getItem("resultadoNivel") || ""
    );
  }, []);
    return (
      <div className="relative min-h-dvh w-full overflow-x-hidden">
        <SuzukiStarLayerStyles />
  
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#faf8f2] via-[#f5f1e8] to-[#efe9dd]"
        />
  
        <StarField />
  
        <main className={`${fontBody.className} relative z-10 flex min-h-dvh w-full flex-col bg-transparent text-[#123126] antialiased selection:bg-[#f0743e]/15`}>
          <SiteHeader />
  
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-12 lg:px-16 lg:pt-16">
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
  
              <div className="mb-12 rounded-[36px] border border-[#123126]/[0.07] bg-[#f3eee4] p-8 shadow-[0_20px_60px_rgba(18,49,38,0.05)]">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8">
                    <p className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#f0743e]`}>
                      Próximo passo
                    </p>
  
                    <h2 className={`${fontDisplay.className} mt-5 text-[2rem] font-light leading-[1.08] text-[#123126]`}>
                      Vivencie a experiência
                      <br />
                      SECE presencialmente.
                    </h2>
  
                    <p className="mt-6 max-w-2xl text-[1rem] font-light leading-relaxed text-[#123126]/72">
                      A aula experimental permite que famílias e educadores
                      conheçam na prática a experiência de escuta, vínculo e
                      desenvolvimento construída pela Escola Suzuki.
                    </p>
                  </div>
  
                  <div className="flex justify-start lg:col-span-4 lg:justify-end">
                  <a
  href="https://wa.me/5511945468423?text=Olá%2C%20acabei%20de%20concluir%20a%20experiência%20formativa%20da%20Escola%20Suzuki%20e%20gostaria%20de%20agendar%20uma%20aula%20experimental%20SECE.%20A%20experiência%20me%20despertou%20interesse%20em%20conhecer%20a%20metodologia."
  target="_blank"
  rel="noopener noreferrer"
>
  <SuzukiCapsuleButton size="md">
    Agendar aula experimental
  </SuzukiCapsuleButton>
</a>
                  </div>
                </div>
              </div>
  
              <div className="rounded-[42px] border border-[#123126]/[0.07] bg-[#fffefb]/50 p-8 shadow-[0_30px_80px_rgba(18,49,38,0.06)] backdrop-blur-sm sm:p-12">
                <div className="flex flex-col items-center text-center">
                  <p className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#123126]/55`}>
                    Certificado de participação
                  </p>
  
                  <div className="mt-10">
                    <Image
                      src="/logo-suzuki.svg"
                      alt="Escola Suzuki"
                      width={240}
                      height={70}
                      className="h-10 w-auto opacity-90 sm:h-12"
                    />
                  </div>
  
                  <h1 className={`${fontDisplay.className} mt-12 max-w-3xl text-[2.4rem] font-light leading-[1.08] tracking-[-0.02em] text-[#123126] sm:text-[4rem]`}>
  {nivel || "Experiência concluída"}
</h1>
  
                  <p className="mt-10 max-w-2xl text-[1.05rem] font-light leading-relaxed text-[#123126]/78">
                    Este certificado reconhece sua participação na experiência
                    formativa desenvolvida pela Escola Suzuki sobre vínculo,
                    escuta e desenvolvimento humano nos primeiros anos de vida.
                  </p>
  
                  <div className="mt-14 grid w-full gap-6 border-y border-[#123126]/10 py-10 sm:grid-cols-3">
                    <div>
                      <p className={`${fontDisplay.className} text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/42`}>
                        Participante
                      </p>
  
                      <p className="mt-3 text-[1rem] font-light text-[#123126]">
                      {nome || "Participante"}
                      </p>
                    </div>
  
                    <div>
                      <p className={`${fontDisplay.className} text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/42`}>
                        Experiência
                      </p>
  
                      <p className="mt-3 text-[1rem] font-light text-[#123126]">
                      {nivel || "Experiência formativa"}
                      </p>
                    </div>
  
                    <div>
                      <p className={`${fontDisplay.className} text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/42`}>
                        Conclusão
                      </p>
  
                      <p className="mt-3 text-[1rem] font-light text-[#123126]">
                        Maio de 2026
                      </p>
                    </div>
                  </div>
  
                  <div className="mt-12 max-w-2xl">
                    <p className="text-[0.98rem] font-light italic leading-relaxed text-[#123126]/68">
                      “A capacidade de aprender nasce muito antes da consciência
                      racional. Ela começa no ambiente, na repetição e no vínculo.”
                    </p>
                  </div>
  
                  <div className="mt-16 h-px w-32 bg-[#123126]/12" />
  
                  <div className="mt-8">
                    <p className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#123126]/55`}>
                      Escola Suzuki
                    </p>
  
                    <p className="mt-2 text-[0.95rem] font-light text-[#123126]/65">
                      Educação musical pela Filosofia Suzuki
                    </p>
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </main>
      </div>
    );
  }