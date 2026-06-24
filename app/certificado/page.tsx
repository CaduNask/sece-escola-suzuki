'use client';

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  return <style dangerouslySetInnerHTML={{ __html: SUZUKI_STAR_LAYER_CSS }} />;
}

function StarField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-visible" aria-hidden>
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
  const certificadoRef = useRef<HTMLDivElement>(null);

  const [nome, setNome] = useState("");
  const [nivel, setNivel] = useState("");
  const [baixando, setBaixando] = useState(false);

  useEffect(() => {
    setNome(localStorage.getItem("usuarioNome") || "");
    setNivel(localStorage.getItem("resultadoNivel") || "");
  }, []);

  const gerarNomeArquivo = () => {
    return (nome || "participante")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
  };

  const baixarCertificadoPDF = async () => {
    if (!certificadoRef.current || baixando) return;

    try {
      setBaixando(true);

      const canvas = await html2canvas(certificadoRef.current, {
        scale: 3,
        backgroundColor: "#fffefb",
        useCORS: true,
        windowWidth: 1280,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 12;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const imgRatio = canvas.width / canvas.height;

      let finalWidth = availableWidth;
      let finalHeight = finalWidth / imgRatio;

      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = finalHeight * imgRatio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.setFillColor(250, 248, 242);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
      pdf.save(`certificado-escola-suzuki-${gerarNomeArquivo()}.pdf`);
    } catch (error) {
      console.error("Erro ao baixar certificado:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível baixar o certificado. Tente novamente."
      );
    } finally {
      setBaixando(false);
    }
  };

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

            <div className="mb-12 min-w-0 rounded-[36px] border border-[#123126]/[0.07] bg-[#f3eee4] p-6 shadow-[0_20px_60px_rgba(18,49,38,0.05)] sm:p-8">
              <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <p className={`${fontDisplay.className} break-words text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#f0743e]`}>
                    Próximo passo
                  </p>

                  <h2 className={`${fontDisplay.className} mt-5 break-words text-[1.9rem] font-light leading-[1.08] text-[#123126] sm:text-[2rem]`}>
                    Vivencie a experiência SECE presencialmente.
                  </h2>

                  <p className="mt-6 max-w-full break-words text-[1rem] font-light leading-relaxed text-[#123126]/72 sm:max-w-2xl">
                    A aula experimental permite que famílias e educadores
                    conheçam na prática a experiência de escuta, vínculo e
                    desenvolvimento construída pela Escola Suzuki.
                  </p>
                </div>

                <div className="min-w-0 max-w-full lg:flex lg:justify-end lg:items-center">
                  <a
                    href="https://wa.me/5511945468423?text=Olá%2C%20acabei%20de%20concluir%20a%20experiência%20formativa%20da%20Escola%20Suzuki%20e%20gostaria%20de%20agendar%20uma%20aula%20experimental%20SECE.%20A%20experiência%20me%20despertou%20interesse%20em%20conhecer%20a%20metodologia."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-full overflow-hidden"
                  >
                    <SuzukiCapsuleButton size="sm" className="whitespace-nowrap">
                      Agendar aula experimental
                    </SuzukiCapsuleButton>
                  </a>
                </div>
              </div>
            </div>

            <div
              ref={certificadoRef}
              className="min-w-0 rounded-[42px] border border-[#123126]/[0.07] bg-[#fffefb] p-6 shadow-[0_30px_80px_rgba(18,49,38,0.06)] backdrop-blur-sm sm:p-12"
            >
              <div className="flex min-w-0 flex-col items-center text-center">
                <p className={`${fontDisplay.className} max-w-full break-words text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#123126]/55`}>
                  Certificado de participação
                </p>

                <div className="mt-10">
                  <img
                    src="/logo-suzuki.svg"
                    alt="Escola Suzuki"
                    width={240}
                    height={70}
                    className="h-10 w-auto opacity-90 sm:h-12"
                  />
                </div>

                <h1 className={`${fontDisplay.className} mt-12 max-w-full break-words text-[2rem] font-light leading-[1.08] tracking-[-0.02em] text-[#123126] sm:max-w-3xl sm:text-[4rem]`}>
                  {nivel || "Experiência concluída"}
                </h1>

                <p className="mt-10 max-w-full break-words text-[1rem] font-light leading-relaxed text-[#123126]/78 sm:max-w-2xl sm:text-[1.05rem]">
                  Este certificado reconhece sua participação na experiência
                  formativa desenvolvida pela Escola Suzuki sobre vínculo,
                  escuta e desenvolvimento humano nos primeiros anos de vida.
                </p>

                <div className="mt-14 grid w-full min-w-0 gap-8 border-y border-[#123126]/10 py-10 sm:grid-cols-3 sm:gap-6">
                  <div className="min-w-0">
                    <p className={`${fontDisplay.className} break-words text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/42`}>
                      Participante
                    </p>

                    <p className="mt-3 break-words text-[1rem] font-light text-[#123126]">
                      {nome || "Participante"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className={`${fontDisplay.className} break-words text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/42`}>
                      Experiência
                    </p>

                    <p className="mt-3 break-words text-[1rem] font-light text-[#123126]">
                      {nivel || "Experiência formativa"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className={`${fontDisplay.className} break-words text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#123126]/42`}>
                      Conclusão
                    </p>

                    <p className="mt-3 break-words text-[1rem] font-light text-[#123126]">
                      Maio de 2026
                    </p>
                  </div>
                </div>

                <div className="mt-12 max-w-full sm:max-w-2xl">
                  <p className="break-words text-[0.98rem] font-light italic leading-relaxed text-[#123126]/68">
                    “A capacidade de aprender nasce muito antes da consciência
                    racional. Ela começa no ambiente, na repetição e no vínculo.”
                  </p>
                </div>

                <div className="mt-16 h-px w-32 bg-[#123126]/12" />

                <div className="mt-8 max-w-full">
                  <p className={`${fontDisplay.className} break-words text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#123126]/55`}>
                    Escola de Música Suzuki
                  </p>

                  <p className="mt-2 break-words text-[0.95rem] font-light text-[#123126]/65">
                    Educação musical orientada por habilidades e competências
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={baixarCertificadoPDF}
                disabled={baixando}
                className="block max-w-full overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SuzukiCapsuleButton size="sm" className="max-w-full">
                  {baixando ? "Gerando PDF..." : "Baixar certificado em PDF"}
                </SuzukiCapsuleButton>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}