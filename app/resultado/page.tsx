'use client';

import { useEffect, useState, type CSSProperties } from "react";
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
  const [totalPerguntas, setTotalPerguntas] = useState(0);
  const [totalAcertos, setTotalAcertos] = useState(0);
  const [percentual, setPercentual] = useState(0);

  useEffect(() => {
    setTotalPerguntas(Number(localStorage.getItem("resultadoTotalPerguntas") || "0"));
    setTotalAcertos(Number(localStorage.getItem("resultadoTotalAcertos") || "0"));
    setPercentual(Number(localStorage.getItem("resultadoPercentual") || "0"));
  }, []);

  let nivelInterpretacao = "";
  let textoInterpretacao = "";
  let tituloResultado = "";
  let subtituloResultado = "";

  if (percentual <= 40) {
    nivelInterpretacao = "Percepção inicial";
    tituloResultado =
      "Sua experiência demonstra uma percepção ainda inicial sobre vínculo e desenvolvimento.";
    subtituloResultado =
      "Sua participação demonstra contato inicial com temas relacionados à escuta, vínculo e desenvolvimento humano.";
    textoInterpretacao =
      "Sua experiência demonstra uma percepção ainda introdutória sobre os processos de escuta, vínculo e desenvolvimento humano nos primeiros anos de vida.";
  } else if (percentual <= 85) {
    nivelInterpretacao = "Percepção em desenvolvimento";
    tituloResultado =
      "Sua percepção demonstra uma compreensão em construção sobre escuta e formação humana.";
    subtituloResultado =
      "Ao longo da experiência, suas respostas demonstraram compreensão em desenvolvimento sobre repetição, ambiente e formação humana.";
    textoInterpretacao =
      "Suas respostas demonstram uma compreensão em construção sobre repetição, ambiente, escuta e formação humana.";
  } else {
    nivelInterpretacao = "Sensibilidade formativa elevada";
    tituloResultado =
      "Sua percepção demonstra sensibilidade elevada para vínculo e desenvolvimento.";
    subtituloResultado =
      "Ao longo da experiência, suas respostas demonstraram compreensão consistente sobre escuta, repetição, ambiente e formação humana nos primeiros anos de vida.";
    textoInterpretacao =
      "Sua experiência demonstra percepção consistente sobre vínculo, escuta e desenvolvimento infantil nos primeiros anos de vida.";
  }

  useEffect(() => {
    localStorage.setItem("resultadoNivel", nivelInterpretacao);
  }, [nivelInterpretacao]);

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

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-12 lg:px-16 lg:pt-16">
          <div className="grid min-w-0 flex-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <section className="min-w-0 max-w-full lg:col-span-7">
              <p className={`${fontDisplay.className} break-words text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#123126]/72 sm:text-xs`}>
                Resultado da experiência
              </p>

              <h1 className={`${fontDisplay.className} mt-5 max-w-full break-words text-[2rem] font-light leading-[1.08] tracking-[-0.02em] text-[#123126] sm:max-w-3xl sm:text-5xl`}>
                {tituloResultado}
              </h1>

              <p className="mt-8 max-w-full break-words text-[1rem] font-light leading-relaxed text-[#123126]/78 sm:max-w-2xl sm:text-[1.02rem]">
                {subtituloResultado}
              </p>

              <div className="mt-14 grid min-w-0 gap-6 sm:grid-cols-3">
                <div className="min-w-0 rounded-[28px] border border-[#123126]/[0.06] bg-[#fffefb]/45 p-6 backdrop-blur-sm">
                  <p className={`${fontDisplay.className} break-words text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/45`}>
                    Acertos
                  </p>

                  <p className="mt-4 text-[2.2rem] font-light text-[#123126]">
                    {totalAcertos}
                  </p>

                  <p className="mt-2 break-words text-[0.92rem] font-light text-[#123126]/62">
                    de {totalPerguntas} perguntas
                  </p>
                </div>

                <div className="min-w-0 rounded-[28px] border border-[#123126]/[0.06] bg-[#fffefb]/45 p-6 backdrop-blur-sm">
                  <p className={`${fontDisplay.className} break-words text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/45`}>
                    Percentual
                  </p>

                  <p className="mt-4 text-[2.2rem] font-light text-[#123126]">
                    {percentual}%
                  </p>

                  <p className="mt-2 break-words text-[0.92rem] font-light text-[#123126]/62">
                    aproveitamento geral
                  </p>
                </div>

                <div className="min-w-0 rounded-[28px] border border-[#123126]/[0.06] bg-[#fffefb]/45 p-6 backdrop-blur-sm">
                  <p className={`${fontDisplay.className} break-words text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/45`}>
                    Consciência
                  </p>

                  <p className="mt-4 break-words text-[1.12rem] font-light leading-snug text-[#123126]">
                    {nivelInterpretacao}
                  </p>
                </div>
              </div>

              <div className="mt-14 min-w-0 rounded-[36px] border border-[#123126]/[0.07] bg-[#fffefb]/45 p-6 shadow-[0_20px_60px_rgba(18,49,38,0.05)] backdrop-blur-sm sm:p-8">
                <p className={`${fontDisplay.className} break-words text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#f0743e]`}>
                  Interpretação pedagógica
                </p>

                <p className="mt-6 break-words text-[1rem] font-light leading-relaxed text-[#123126]/78 sm:text-[1.08rem]">
                  {textoInterpretacao}
                </p>

                <p className="mt-6 break-words text-[1rem] font-light leading-relaxed text-[#123126]/78 sm:text-[1.08rem]">
                  Mais do que respostas corretas, o resultado revela capacidade
                  de compreender que a formação humana começa muito antes da
                  racionalização consciente.
                </p>

                <div className="mt-8 border-t border-[#123126]/10 pt-6">
                  <p className="break-words text-[0.95rem] font-light leading-relaxed text-[#123126]/65">
                    Esta interpretação possui caráter formativo e pedagógico,
                    sendo parte da experiência desenvolvida pela Escola Suzuki.
                  </p>
                </div>
              </div>
            </section>

            <aside className="min-w-0 max-w-full lg:col-span-5">
              <div className="sticky top-24 min-w-0 rounded-[38px] border border-[#123126]/[0.07] bg-[#f3eee4] p-6 shadow-[0_20px_60px_rgba(18,49,38,0.05)] sm:p-8">
                <p className={`${fontDisplay.className} break-words text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#f0743e]`}>
                  Próxima etapa
                </p>

                <h2 className={`${fontDisplay.className} mt-6 break-words text-[1.9rem] font-light leading-[1.1] text-[#123126] sm:text-[2rem]`}>
                  Seu certificado está pronto.
                </h2>

                <p className="mt-6 break-words text-[1rem] font-light leading-relaxed text-[#123126]/72">
                  A próxima etapa reúne sua participação nesta experiência em um
                  fechamento institucional desenvolvido pela Escola Suzuki.
                </p>

                <a className="mt-10 block max-w-full overflow-hidden" href="/certificado">
                  <SuzukiCapsuleButton size="sm" className="max-w-full">
                    Visualizar certificado
                  </SuzukiCapsuleButton>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}