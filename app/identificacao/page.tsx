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
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const formularioValido = nome.trim() && email.trim() && telefone.trim();

  function handleContinuar() {
    if (!nome.trim()) {
      alert("Por favor, informe seu nome.");
      return;
    }

    if (!email.trim()) {
      alert("Por favor, informe seu e-mail.");
      return;
    }

    if (!telefone.trim()) {
      alert("Por favor, informe seu telefone.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      alert("Por favor, informe um e-mail válido.");
      return;
    }

    localStorage.removeItem("respostasPesquisa");
    localStorage.removeItem("resultadoTotalPerguntas");
    localStorage.removeItem("resultadoTotalAcertos");
    localStorage.removeItem("resultadoPercentual");
    localStorage.removeItem("resultadoNivel");
    localStorage.removeItem("pesquisasDoPerfil");
    localStorage.removeItem("pesquisaAtualIndex");

    localStorage.setItem("usuarioNome", nome.trim());
    localStorage.setItem("usuarioEmail", email.trim());
    localStorage.setItem("usuarioTelefone", telefone.trim());

    window.location.href = "/momento";
  }

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
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <section className="lg:col-span-5">
              <p
                className={`suzuki-enter suzuki-enter-delay-2 ${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#123126]/72 sm:text-xs`}
              >
                Identificação inicial
              </p>

              <h1
                className={`suzuki-enter suzuki-enter-delay-3 mt-5 ${fontDisplay.className} text-[2.1rem] font-light leading-[1.12] tracking-[-0.02em] text-[#123126] sm:text-4xl md:text-[2.8rem]`}
              >
                Antes de começarmos,
                <br />
                queremos entender
                <br />
                seu momento.
              </h1>

              <p className="suzuki-enter suzuki-enter-delay-4 mt-8 max-w-md text-[0.98rem] font-light leading-relaxed text-[#123126]/78 sm:text-base">
                A partir dessas informações, conseguimos organizar sua experiência
                e direcionar a pesquisa para a fase que você vive agora.
              </p>
            </section>

            <section className="suzuki-enter suzuki-enter-delay-4 lg:col-span-7">
              <div className="rounded-[32px] border border-[#123126]/[0.07] bg-[#fffefb]/45 p-6 shadow-[0_20px_60px_rgba(18,49,38,0.05)] backdrop-blur-sm sm:p-8">
                <div className="relative mb-10 flex items-start gap-4 rounded-[24px] border border-[#123126]/[0.04] bg-[#f3eee4] p-5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#f0743e]/70 shadow-[0_8px_24px_rgba(240,116,62,0.18)]">
                    <Image
                      src="/marcos-suzuki.webp"
                      alt="Marcos Osaki"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className={`${fontDisplay.className} text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#123126]/70`}>
                      Marcos Osaki
                    </p>

                    <p className="mt-1 text-[0.9rem] font-light text-[#123126]/62">
                      Fundador da Escola Suzuki
                    </p>

                    <p className="mt-3 max-w-md text-[0.92rem] font-light italic leading-relaxed text-[#123126]/72">
                      “Vamos começar sua jornada entendendo o momento que você vive hoje.”
                    </p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <label className="block">
                    <span className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#123126]/55`}>
                      Nome
                    </span>

                    <input
                      type="text"
                      placeholder="Digite seu nome"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      className="mt-3 w-full border-0 border-b border-[#123126]/18 bg-transparent px-0 py-3 text-base font-light text-[#123126] outline-none transition-colors placeholder:text-[#123126]/35 focus:border-[#f0743e]/70"
                    />
                  </label>

                  <label className="block">
                    <span className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#123126]/55`}>
                      Email
                    </span>

                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-3 w-full border-0 border-b border-[#123126]/18 bg-transparent px-0 py-3 text-base font-light text-[#123126] outline-none transition-colors placeholder:text-[#123126]/35 focus:border-[#f0743e]/70"
                    />
                  </label>

                  <label className="block">
                    <span className={`${fontDisplay.className} text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#123126]/55`}>
                      Telefone
                    </span>

                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(event) => setTelefone(event.target.value)}
                      className="mt-3 w-full border-0 border-b border-[#123126]/18 bg-transparent px-0 py-3 text-base font-light text-[#123126] outline-none transition-colors placeholder:text-[#123126]/35 focus:border-[#f0743e]/70"
                    />
                  </label>
                </div>

                <div
                  className={`mt-10 ${
                    formularioValido
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => {
                    if (formularioValido) {
                      handleContinuar();
                    }
                  }}
                >
                  <SuzukiCapsuleButton size="md">
                    Continuar
                  </SuzukiCapsuleButton>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}