"use client";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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
      ? "group-hover:translate-x-[calc(100%+5.5rem)] h-8 w-8"
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
    const [selected, setSelected] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [perguntas, setPerguntas] = useState<any[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      async function loadPergunta() {
        const data = await getSuzukiData();
        const pesquisasDoPerfil = JSON.parse(
            localStorage.getItem("pesquisasDoPerfil") || "[]"
          );
          
          const pesquisaAtualIndex = Number(
            localStorage.getItem("pesquisaAtualIndex") || "0"
          );
          
          const idPesquisaAtual = pesquisasDoPerfil[pesquisaAtualIndex];

const perguntasAtivas = data.perguntas
  .filter(
    (pergunta: any) =>
      pergunta.ativo === true &&
    pergunta.id_pesquisa === idPesquisaAtual
  )
  .sort((a: any, b: any) => Number(a.ordem) - Number(b.ordem));

setPerguntas(perguntasAtivas);
      }
  
      loadPergunta();
    }, []);
  
    if (!perguntas.length) {
      return (
        <div className="relative min-h-dvh w-full overflow-x-hidden">
          <SuzukiStarLayerStyles />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#faf8f2] via-[#f5f1e8] to-[#efe9dd]"
          />
          <StarField />
  
          <main className={`${fontBody.className} relative z-10 flex min-h-dvh w-full flex-col bg-transparent text-[#123126] antialiased`}>
            <SiteHeader />
  
            <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-5">
              <p className={`${fontDisplay.className} text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[#123126]/55`}>
                Carregando pergunta...
              </p>
            </div>
          </main>
        </div>
      );
    }
    const pergunta = perguntas[currentIndex];
    const totalPerguntas = perguntas.length;
    const perguntaAtual = currentIndex + 1;

    const respostaCorreta =
      pergunta.resposta_correta === "A"
        ? 0
        : pergunta.resposta_correta === "B"
        ? 1
        : pergunta.resposta_correta === "C"
        ? 2
        : 3;
  
    const letraCorreta = pergunta.resposta_correta || "B";
  
    const alternativas = [
      pergunta.alternativa_a,
      pergunta.alternativa_b,
      pergunta.alternativa_c,
      pergunta.alternativa_d,
    ];
  
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
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
              <div className="flex items-center justify-between gap-6">
                <p className={`${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#123126]/72 sm:text-xs`}>
                  {`Pergunta ${String(perguntaAtual).padStart(2, "0")}`}
                </p>
  
                <p className="text-[0.85rem] font-light text-[#123126]/55">
                {perguntaAtual} de {totalPerguntas}
                </p>
              </div>
  
              <div className="mt-6 h-[2px] w-full overflow-hidden rounded-full bg-[#123126]/8">
              <div
  className="h-full rounded-full bg-[#f0743e] transition-all duration-500"
  style={{ width: `${(perguntaAtual / totalPerguntas) * 100}%` }}
/>
              </div>
  
              <div className="mt-16">
                <h1 className={`${fontDisplay.className} max-w-3xl text-[2rem] font-light leading-[1.14] tracking-[-0.02em] text-[#123126] sm:text-[2.6rem]`}>
                  {pergunta.pergunta}
                </h1>
  
                <p className="mt-8 max-w-2xl text-[1rem] font-light leading-relaxed text-[#123126]/72">
                  Considere as alternativas abaixo e confirme a resposta que melhor representa sua compreensão.
                </p>
              </div>
  
              <div className="mt-14 divide-y divide-[#123126]/10 border-y border-[#123126]/10">
                {alternativas.map((alternativa, index) => (
                  <button
                    key={alternativa}
                    type="button"
                    onClick={() => {
                      if (!confirmed) setSelected(index);
                    }}
                    className={`group flex w-full items-start justify-between gap-6 py-7 text-left transition-colors ${
                      selected === index ? "text-[#f0743e]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      <span className={`${fontDisplay.className} mt-[0.15rem] text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#123126]/38`}>
                        {String.fromCharCode(65 + index)}
                      </span>
  
                      <span className={`max-w-2xl text-[1.02rem] font-light leading-relaxed transition-colors ${
                        selected === index ? "text-[#f0743e]" : "text-[#123126] group-hover:text-[#f0743e]"
                      }`}>
                        {alternativa}
                      </span>
                    </div>
  
                    <div className={`mt-1 h-4 w-4 rounded-full border transition-all duration-300 ${
                      selected === index
                        ? "border-[#f0743e] bg-[#f0743e]"
                        : "border-[#123126]/18 group-hover:border-[#f0743e]"
                    }`} />
                  </button>
                ))}
              </div>
  
              {!confirmed ? (
                <div className="mt-14 flex items-center justify-between gap-6">
                  <p className="max-w-md text-[0.92rem] font-light leading-relaxed text-[#123126]/58">
                    Escolha a alternativa que mais se aproxima da compreensão construída ao longo da pesquisa.
                  </p>
  
                  <div
                    onClick={() => {
                        if (selected === null) return;
                      
                        const respostas = JSON.parse(
                          localStorage.getItem("respostasPesquisa") || "[]"
                        );
                      
                        const acertou = selected === respostaCorreta;
                      
                        const pesquisasDoPerfil = JSON.parse(
                            localStorage.getItem("pesquisasDoPerfil") || "[]"
                          );
                          
                          const pesquisaAtualIndex = Number(
                            localStorage.getItem("pesquisaAtualIndex") || "0"
                          );
                          
                          const idPesquisaAtual = pesquisasDoPerfil[pesquisaAtualIndex];
                          
                          respostas.push({
                            id_pesquisa: idPesquisaAtual,
                            perguntaId: pergunta.id_pergunta,
                            respostaSelecionada: selected,
                            respostaCorreta,
                            acertou,
                          });
                      
                        localStorage.setItem(
                          "respostasPesquisa",
                          JSON.stringify(respostas)
                        );
                      
                        setConfirmed(true);
                      }}
                    className={selected === null ? "pointer-events-none opacity-35" : "cursor-pointer"}
                  >
                    <SuzukiCapsuleButton size="md">
                      Confirmar resposta
                    </SuzukiCapsuleButton>
                  </div>
                </div>
              ) : (
                <div className="mt-14 rounded-[32px] border border-[#123126]/[0.07] bg-[#fffefb]/55 p-7 shadow-[0_20px_60px_rgba(18,49,38,0.05)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0743e] text-white">
                      <span className={`${fontDisplay.className} text-[0.62rem] font-medium uppercase tracking-[0.12em]`}>
                        {letraCorreta}
                      </span>
                    </div>
  
                    <p className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#f0743e]`}>
                      Resposta comentada
                    </p>
                  </div>
  
                  <h2 className={`${fontDisplay.className} mt-8 text-[1.5rem] font-light leading-snug text-[#123126]`}>
                    {alternativas[respostaCorreta]}
                  </h2>
  
                  <p className="mt-5 text-[0.98rem] font-light leading-relaxed text-[#123126]/76">
                    {selected === respostaCorreta ? pergunta.feedback_correto : pergunta.feedback_errado}
                  </p>
  
                  <div className="mt-7 border-t border-[#123126]/10 pt-5">
                    <p className={`${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#123126]/45`}>
                      Fonte
                    </p>
  
                    <p className="mt-2 text-[0.9rem] font-light leading-relaxed text-[#123126]/68">
                      {pergunta.fonte}
                    </p>
                  </div>
  
                  <div
  className="mt-8 cursor-pointer"
  onClick={async () => {
    setConfirmed(false);
    setSelected(null);
  
    if (currentIndex < totalPerguntas - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
  
    const respostas = JSON.parse(
      localStorage.getItem("respostasPesquisa") || "[]"
    );
  
    const totalRespostas = respostas.length;
    const totalAcertos = respostas.filter((resposta: any) => resposta.acertou).length;
    const percentual =
      totalRespostas > 0 ? Math.round((totalAcertos / totalRespostas) * 100) : 0;
  
    localStorage.setItem("resultadoTotalPerguntas", String(totalRespostas));
    localStorage.setItem("resultadoTotalAcertos", String(totalAcertos));
    localStorage.setItem("resultadoPercentual", String(percentual));
  
    const nome = localStorage.getItem("usuarioNome") || "";
    const email = localStorage.getItem("usuarioEmail") || "";
    const telefone = localStorage.getItem("usuarioTelefone") || "";
    const perfil = localStorage.getItem("perfilSelecionado") || "";
  
    const pesquisasDoPerfil = JSON.parse(
      localStorage.getItem("pesquisasDoPerfil") || "[]"
    );
  
    const pesquisaAtualIndex = Number(
      localStorage.getItem("pesquisaAtualIndex") || "0"
    );
  
    const idPesquisaAtual = pesquisasDoPerfil[pesquisaAtualIndex];
  
    const respostasDaPesquisaAtual = respostas.filter(
      (resposta: any) => resposta.id_pesquisa === idPesquisaAtual
    );
  
    await Promise.all(
      respostasDaPesquisaAtual.map((resposta: any) =>
        fetch("/api/salvar-resultado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_resposta: crypto.randomUUID(),
            id_usuario: email,
            nome,
            email,
            telefone,
            id_perfil: perfil,
            id_pesquisa: idPesquisaAtual,
            id_pergunta: resposta.perguntaId,
            resposta_escolhida: resposta.respostaSelecionada,
            resposta_correta: resposta.respostaCorreta,
            acertou: resposta.acertou,
            fonte_duvida: "",
          }),
        })
      )
    );
  
    const proximoIndex = pesquisaAtualIndex + 1;
  
    if (proximoIndex < pesquisasDoPerfil.length) {
      localStorage.setItem("pesquisaAtualIndex", String(proximoIndex));
      window.location.href = "/transicao";
      return;
    }
  
    window.location.href = "/resultado";
  }}
>
  <SuzukiCapsuleButton size="md">
    {currentIndex < totalPerguntas - 1
      ? "Próxima pergunta"
      : "Finalizar pesquisa"}
  </SuzukiCapsuleButton>
</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }