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

function StarField() {
  const stars = [
    { top: "8%", left: "12%", size: 10, opacity: 0.12 },
    { top: "18%", left: "78%", size: 7, opacity: 0.1 },
    { top: "42%", left: "6%", size: 6, opacity: 0.14 },
    { top: "55%", left: "88%", size: 9, opacity: 0.11 },
    { top: "72%", left: "22%", size: 5, opacity: 0.13 },
    { top: "28%", left: "52%", size: 4, opacity: 0.09 },
    { top: "88%", left: "65%", size: 8, opacity: 0.1 },
    { top: "12%", left: "92%", size: 5, opacity: 0.08 },
  ] as const;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {stars.map((s, i) => (
        <svg
          key={i}
          className="absolute text-[#123126]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1.5l2.2 6.8h7.1l-5.7 4.1 2.2 6.8L12 15.1l-5.8 4.1 2.2-6.8-5.7-4.1h7.1L12 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main
      className={`${fontBody.className} relative z-10 min-h-dvh bg-[#f5f1e8] text-[#123126] antialiased selection:bg-[#123126]/10 selection:text-[#123126]`}
    >
      <StarField />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-16 md:px-12 md:pb-24 md:pt-20 lg:px-16">
        <p
          className={`${fontDisplay.className} text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#123126]/75 sm:text-xs`}
        >
          Escola Suzuki — Pesquisa formativa
        </p>

        <div className="mt-14 flex flex-1 flex-col gap-14 sm:mt-16 md:mt-20 lg:mt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start">
            <div className="lg:col-span-7">
              <h1
                className={`${fontDisplay.className} text-[2.15rem] font-light leading-[1.12] tracking-[-0.02em] text-[#123126] sm:text-4xl md:text-[2.75rem] lg:text-5xl`}
              >
                A infância
                <br />
                escuta antes
                <br />
                de compreender.
              </h1>

              <p className="mt-10 max-w-xl text-[0.95rem] font-light leading-relaxed text-[#123126]/88 sm:text-base md:mt-12 md:text-[1.05rem] md:leading-[1.75]">
                Uma pesquisa breve e contemplativa, construída a partir da
                neurociência do desenvolvimento, da filosofia Suzuki e de quase
                quatro décadas de prática pedagógica com gestantes, bebês,
                crianças e educadores.
              </p>
            </div>

            <aside className="lg:col-span-5 lg:pt-2">
              <div className="relative border-l border-[#123126]/15 pl-6 sm:pl-8 lg:pl-10">
                <span
                  className="absolute left-0 top-0 h-full w-px bg-[#f0743e]/35"
                  aria-hidden
                />
                <p className="text-[0.95rem] font-light leading-relaxed text-[#123126]/82 sm:text-base md:leading-[1.75]">
                  Não é um teste. É um percurso de escuta sobre como a música, o
                  vínculo e a presença formam, desde os primeiros dias, o ser
                  humano que está chegando.
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10 md:gap-14">
            <button
              type="button"
              className={`${fontDisplay.className} group inline-flex w-full items-center justify-center border border-transparent bg-[#123126] px-9 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.18em] text-[#f5f1e8] transition-[background-color,transform,box-shadow] duration-300 ease-out hover:bg-[#1a4538] hover:shadow-[0_12px_40px_-12px_rgba(18,49,38,0.45)] active:scale-[0.99] sm:w-auto sm:px-10 sm:py-4 sm:text-xs`}
            >
              <span className="transition-transform duration-300 ease-out group-hover:translate-y-[-1px]">
                Começar pesquisa
              </span>
            </button>

            <p
              className={`${fontDisplay.className} text-center text-[0.65rem] font-medium uppercase leading-relaxed tracking-[0.22em] text-[#123126]/55 sm:text-left sm:text-[0.68rem]`}
            >
              Aproximadamente 4 minutos · Resultado personalizado
            </p>
          </div>
        </div>

        <footer className="mt-20 grid gap-14 border-t border-[#123126]/12 pt-14 sm:mt-24 sm:gap-12 sm:pt-16 md:grid-cols-3 md:gap-10 lg:mt-28 lg:pt-20">
          <div>
            <p
              className={`${fontDisplay.className} text-[0.7rem] font-medium tabular-nums tracking-[0.2em] text-[#f0743e]`}
            >
              01
            </p>
            <h2
              className={`${fontDisplay.className} mt-3 text-sm font-medium tracking-wide text-[#123126]`}
            >
              Neurociência
            </h2>
            <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[#123126]/78">
              Os primeiros mil dias formam a arquitetura do cérebro humano. A
              escuta organiza linguagem, ritmo e vínculo.
            </p>
          </div>

          <div>
            <p
              className={`${fontDisplay.className} text-[0.7rem] font-medium tabular-nums tracking-[0.2em] text-[#f0743e]`}
            >
              02
            </p>
            <h2
              className={`${fontDisplay.className} mt-3 text-sm font-medium tracking-wide text-[#123126]`}
            >
              Filosofia Suzuki
            </h2>
            <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[#123126]/78">
              “Caráter primeiro, habilidade depois.” A música como caminho de
              formação humana, não como técnica isolada.
            </p>
          </div>

          <div>
            <p
              className={`${fontDisplay.className} text-[0.7rem] font-medium tabular-nums tracking-[0.2em] text-[#f0743e]`}
            >
              03
            </p>
            <h2
              className={`${fontDisplay.className} mt-3 text-sm font-medium tracking-wide text-[#123126]`}
            >
              SECE
            </h2>
            <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-[#123126]/78">
              Suzuki Early Childhood Education: o trabalho de fundação, da
              gestação aos 4 anos, em ambiente afetivo cuidado.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
