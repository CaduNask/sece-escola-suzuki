"use client";
import {
    useEffect,
    useState,
    type CSSProperties,
    type ReactNode,
  } from "react";
import Image from "next/image";
import { IBM_Plex_Sans, Noto_Sans_JP } from "next/font/google";
import { getSuzukiData } from "@/lib/api";

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
      ? "group-hover:translate-x-[calc(100%+5rem)] h-8 w-8"
      : "group-hover:translate-x-[calc(100%+6rem)] h-11 w-11"
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
    const [pesquisa, setPesquisa] = useState<any>(null);
  
    useEffect(() => {
      async function loadPesquisa() {
        const perfilSelecionado = localStorage.getItem("perfilSelecionado");
        const data = await getSuzukiData();
  
        const perfil = data.perfis.find(
          (perfil: any) => perfil.nome_perfil === perfilSelecionado
        );
  
        const pesquisasDoPerfil = JSON.parse(
            localStorage.getItem("pesquisasDoPerfil") || "[]"
          );
          
          const pesquisaAtualIndex = Number(
            localStorage.getItem("pesquisaAtualIndex") || "0"
          );
          
          const idPesquisaAtual = pesquisasDoPerfil[pesquisaAtualIndex];
          
          const pesquisaEncontrada = data.pesquisas.find(
            (pesquisa: any) =>
              pesquisa.id_pesquisa === idPesquisaAtual && pesquisa.ativo === true
          );
  
        setPesquisa(pesquisaEncontrada || data.pesquisas[0]);
      }
  
      loadPesquisa();
    }, []);
    if (!pesquisa) {
        return (
          <div className="relative min-h-dvh w-full overflow-x-hidden">
            <SuzukiStarLayerStyles />
      
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#faf8f2] via-[#f5f1e8] to-[#efe9dd]"
            />
      
            <StarField />
      
            <main
              className={`${fontBody.className} relative z-10 flex min-h-dvh w-full flex-col bg-transparent text-[#123126] antialiased`}
            >
              <SiteHeader />
      
              <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-5">
                <p
                  className={`${fontDisplay.className} text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[#123126]/55`}
                >
                  Carregando pesquisa...
                </p>
              </div>
            </main>
          </div>
        );
      }
    return (
      <div className="relative min-h-dvh w-full overflow-x-hidden">
        <SuzukiStarLayerStyles />
  
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#faf8f2] via-[#f5f1e8] to-[#efe9dd]"
        />
  
        <StarField />
  
        <main
          className={`${fontBody.className} relative z-10 flex min-h-dvh w-full flex-col bg-transparent text-[#123126] antialiased selection:bg-[#f0743e]/15`}
        >
          <SiteHeader />
  
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-12 lg:px-16 lg:pt-16">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
              <p
                className={`suzuki-enter suzuki-enter-delay-2 ${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#123126]/72 sm:text-xs`}
              >
                {pesquisa?.titulo || "Pesquisa"}
              </p>
  
              <h1
                className={`suzuki-enter suzuki-enter-delay-3 mt-5 max-w-2xl ${fontDisplay.className} text-[2.2rem] font-light leading-[1.08] tracking-[-0.02em] text-[#123126] sm:text-5xl`}
              >
                {pesquisa?.subtitulo || "Os primeiros vínculos moldam muito antes da compreensão."}
              </h1>
  
              <p className="suzuki-enter suzuki-enter-delay-4 mt-8 max-w-2xl text-[1rem] font-light leading-relaxed text-[#123126]/78 sm:text-[1.05rem]">
              {pesquisa?.descricao || "Essa experiência foi construída para investigar como escuta, presença, vínculo e ambiente influenciam o desenvolvimento humano desde os primeiros anos de vida."}
              </p>
  
              <div className="suzuki-enter suzuki-enter-delay-5 mt-14 grid gap-6 sm:grid-cols-3">
                <div className="rounded-[24px] border border-[#123126]/[0.06] bg-[#fffefb]/45 p-5 backdrop-blur-sm">
                  <p
                    className={`${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#123126]/48`}
                  >
                    Tempo estimado
                  </p>
  
                  <p className="mt-3 text-[1rem] font-light leading-relaxed text-[#123126]">
                    Aproximadamente
                    <br />
                    4 minutos
                  </p>
                </div>
  
                <div className="rounded-[24px] border border-[#123126]/[0.06] bg-[#fffefb]/45 p-5 backdrop-blur-sm">
                  <p
                    className={`${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#123126]/48`}
                  >
                    Estrutura
                  </p>
  
                  <p className="mt-3 text-[1rem] font-light leading-relaxed text-[#123126]">
                    Perguntas contemplativas
                    <br />
                    com interpretação pedagógica
                  </p>
                </div>
  
                <div className="rounded-[24px] border border-[#123126]/[0.06] bg-[#fffefb]/45 p-5 backdrop-blur-sm">
                  <p
                    className={`${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#123126]/48`}
                  >
                    Resultado
                  </p>
  
                  <p className="mt-3 text-[1rem] font-light leading-relaxed text-[#123126]">
                    Leitura formativa
                    <br />
                    personalizada
                  </p>
                </div>
              </div>
  
              <div
  className="suzuki-enter suzuki-enter-delay-5 mt-14 cursor-pointer"
  onClick={() => {
    window.location.href = "/pergunta";
  }}
>
  <SuzukiCapsuleButton size="md">
    Começar pesquisa
  </SuzukiCapsuleButton>
</div>
            </div>
          </div>
        </main>
      </div>
    );
  }