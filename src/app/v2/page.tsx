"use client";

import {
  Reveal,
  WordReveal,
  Counter,
  MagneticButton,
  Marquee,
  Tilt3D,
  useCursorSpotlight,
} from "@/components/motion-primitives";
import { ContactForm } from "@/components/ContactForm";
import {
  headlines,
  subheadline,
  problema,
  dor,
  solucao,
  provaSocial,
  diferenciais,
  comoFunciona,
  ctaFinal,
} from "@/lib/content";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

export default function V2() {
  const spot = useCursorSpotlight();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const { scrollYProgress: full } = useScroll();
  const bar = useSpring(full, { stiffness: 80, damping: 20 });

  return (
    <main
      ref={spot}
      className="relative bg-[var(--color-v2-bg)] text-[var(--color-v2-fg)] spotlight overflow-hidden"
    >
      <motion.div
        style={{ scaleX: bar }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-gradient-to-r from-[var(--color-v2-gold)] via-[var(--color-v2-gold-soft)] to-[var(--color-v2-gold)]"
      />

      {/* aurora background */}
      <motion.div
        aria-hidden
        style={{ y: auroraY }}
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,106,26,0.45), transparent 60%)",
            animation: "aurora 24s linear infinite",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,160,96,0.35), transparent 60%)",
            animation: "aurora 32s linear infinite reverse",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* nav */}
      <header className="relative z-30 mx-auto max-w-7xl px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="font-display text-xl tracking-tight">
          <span className="text-[var(--color-v2-gold)]">LF</span>
          <span className="text-[var(--color-v2-fg-soft)] mx-2">·</span>
          Dr. Luiz Fernando
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-[var(--color-v2-fg-soft)]">
          <a href="#problema" className="hover:text-[var(--color-v2-gold)]">
            Diagnóstico
          </a>
          <a href="#solucao" className="hover:text-[var(--color-v2-gold)]">
            Atuação
          </a>
          <a
            href="#como-funciona"
            className="hover:text-[var(--color-v2-gold)]"
          >
            Método
          </a>
        </nav>
        <MagneticButton>
          <a
            href="#contato"
            className="group relative overflow-hidden rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.18em] border border-[var(--color-v2-gold)]/60 hover:border-[var(--color-v2-gold)] transition-colors"
          >
            <span className="relative z-10">Conversar</span>
            <span className="absolute inset-0 bg-[var(--color-v2-gold)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="absolute inset-0 flex items-center justify-center text-[var(--color-v2-bg)] opacity-0 group-hover:opacity-100 transition-opacity">
              Conversar
            </span>
          </a>
        </MagneticButton>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-28 pb-32 md:pb-48"
      >
        <motion.div style={{ opacity: heroFade }}>
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-v2-line)] bg-[var(--color-v2-bg-soft)]/60 backdrop-blur px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[var(--color-v2-fg-soft)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-v2-gold)] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-v2-gold)]" />
              </span>
              Consultoria Jurídica Tributária
            </div>
          </Reveal>

          <h1 className="mt-10 font-display text-[clamp(2.4rem,5.6vw,5.4rem)] font-light leading-[1.02] tracking-tight max-w-5xl text-balance">
            <WordReveal text={headlines.v2} />
          </h1>

          <Reveal delay={0.4} className="mt-10 max-w-2xl">
            <p className="text-lg md:text-xl leading-relaxed text-[var(--color-v2-fg-soft)] text-pretty">
              {subheadline}
            </p>
          </Reveal>

          <Reveal delay={0.6} className="mt-12 flex flex-wrap gap-4 items-center">
            <MagneticButton strength={0.45}>
              <a
                href="#contato"
                className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium overflow-hidden bg-[var(--color-v2-gold)] text-[var(--color-v2-bg)]"
              >
                <span className="relative z-10">
                  Agendar avaliação gratuita
                </span>
                <span className="relative z-10 transition-transform group-hover:translate-x-1">
                  →
                </span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.6s linear infinite",
                  }}
                />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#contato"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-v2-line)] hover:border-[var(--color-v2-gold)]/60 px-8 py-4 text-sm font-medium transition-colors"
              >
                Falar pelo WhatsApp
              </a>
            </MagneticButton>
            <div className="flex items-center gap-3 text-xs text-[var(--color-v2-fg-soft)]">
              <span className="h-px w-8 bg-[var(--color-v2-gold)]" />
              Primeira conversa gratuita e confidencial
            </div>
          </Reveal>
        </motion.div>

        {/* Stat bar */}
        <Reveal delay={0.7}>
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-v2-line)] border border-[var(--color-v2-line)] rounded-2xl overflow-hidden">
            {[
              { v: 23, suf: "", label: "Anos de atuação" },
              { v: 500, suf: "+", label: "Casos resolvidos" },
              { v: 100, suf: "%", label: "Dentro da lei" },
              { v: 1, suf: "ª", label: "Conversa gratuita" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[var(--color-v2-bg)] px-6 py-8 hover:bg-[var(--color-v2-bg-soft)] transition-colors"
              >
                <div className="font-display text-4xl md:text-5xl text-[var(--color-v2-gold)]">
                  <Counter to={s.v} suffix={s.suf} />
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-v2-fg-soft)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-[var(--color-v2-line)] py-8 bg-[var(--color-v2-bg-soft)]/40">
        <Marquee speed={50} className="font-display text-3xl md:text-5xl text-[var(--color-v2-fg-soft)]">
          <span className="text-[var(--color-v2-gold)]">●</span>{" "}
          Gestão de Passivo Fiscal{" "}
          <span className="mx-6 opacity-40">·</span>
          Transação Tributária{" "}
          <span className="mx-6 opacity-40">·</span>
          Planejamento Fiscal e Sucessório{" "}
          <span className="mx-6 opacity-40">·</span>
          Receita Federal{" "}
          <span className="mx-6 opacity-40">·</span>
          PGFN{" "}
          <span className="mx-6 opacity-40">·</span>
          ITCMD{" "}
          <span className="mx-6 opacity-40">·</span>
        </Marquee>
      </div>

      {/* PROBLEMA */}
      <section
        id="problema"
        className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24"
      >
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Reveal>
              <div className="sticky top-24">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
                  / 01 · Diagnóstico
                </div>
                <div className="mt-4 text-[var(--color-v2-fg-soft)] text-sm leading-relaxed">
                  Tempo não cura passivo fiscal.{" "}
                  <span className="text-[var(--color-v2-fg)]">
                    Ele agrava.
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.6rem)] leading-[1.06] tracking-tight text-balance">
                {problema.titulo}
              </h2>
            </Reveal>
            <div className="mt-12 space-y-6 text-lg md:text-xl leading-relaxed text-[var(--color-v2-fg-soft)] text-pretty">
              {problema.paragrafos.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className={i === 3 ? "text-[var(--color-v2-fg)]" : ""}>
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOR */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(255,106,26,0.08), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
              / 02 · A verdade
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4rem)] leading-[1.05] tracking-tight max-w-4xl text-balance">
              <WordReveal text={dor.titulo} />
            </h2>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7 space-y-5 text-lg md:text-xl leading-relaxed text-[var(--color-v2-fg-soft)] text-pretty">
              {dor.paragrafos.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  {i === 5 ? (
                    <blockquote className="relative pl-8 py-2 border-l-2 border-[var(--color-v2-gold)]">
                      <p className="font-display text-2xl md:text-3xl leading-snug text-[var(--color-v2-fg)]">
                        {p}
                      </p>
                    </blockquote>
                  ) : (
                    <p>{p}</p>
                  )}
                </Reveal>
              ))}
            </div>
            <div className="md:col-span-5">
              <Reveal delay={0.3}>
                <Tilt3D className="rounded-2xl bg-gradient-to-br from-[var(--color-v2-bg-soft)] to-[var(--color-v2-bg)] border border-[var(--color-v2-line)] p-10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
                    Princípios
                  </div>
                  <ul className="mt-8 space-y-6">
                    {[
                      "Conhecimento profundo da legislação",
                      "Estratégia construída caso a caso",
                      "Honestidade desde o primeiro dia",
                    ].map((p, i) => (
                      <li
                        key={p}
                        className="flex items-start gap-4 text-[var(--color-v2-fg)]"
                      >
                        <span className="font-display text-[var(--color-v2-gold)] text-2xl leading-none">
                          0{i + 1}
                        </span>
                        <span className="text-lg leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </Tilt3D>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section
        id="solucao"
        className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24"
      >
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
            / 03 · Atuação
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4rem)] leading-[1.04] tracking-tight max-w-4xl text-balance">
            {solucao.titulo}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-v2-fg-soft)]">
            {solucao.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {solucao.servicos.map((s, i) => (
            <Reveal key={s.nome} delay={i * 0.1}>
              <Tilt3D className="group relative h-full rounded-2xl border border-[var(--color-v2-line)] bg-[var(--color-v2-bg-soft)]/50 p-8 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--color-v2-gold)]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className="relative">
                  <div className="font-mono text-xs text-[var(--color-v2-gold)] tracking-widest">
                    0{i + 1} / 03
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight">
                    {s.nome}
                  </h3>
                  <p className="mt-4 text-[var(--color-v2-fg-soft)] leading-relaxed text-pretty">
                    {s.descricao}
                  </p>
                  <div className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--color-v2-gold)]">
                    Saiba mais
                    <span className="transition-transform group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="mt-12 max-w-3xl font-display text-2xl md:text-3xl italic text-[var(--color-v2-fg-soft)] leading-relaxed">
            “{solucao.outro}”
          </p>
        </Reveal>
      </section>

      {/* PROVA SOCIAL */}
      <section className="relative py-20 md:py-24 border-y border-[var(--color-v2-line)]">
        <div className="mx-auto max-w-5xl px-6 md:px-10 text-center">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
              / 04 · Resultados
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4rem)] leading-[1.04] tracking-tight text-balance">
              {provaSocial.titulo}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-[var(--color-v2-fg-soft)] leading-relaxed">
              {provaSocial.texto}
            </p>
          </Reveal>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
                / 05 · Diferenciais
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] tracking-tight">
                {diferenciais.titulo}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <ul>
              {diferenciais.lista.map((d, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <li className="group flex items-start gap-6 py-5 border-b border-[var(--color-v2-line)] last:border-0">
                    <span className="font-mono text-xs text-[var(--color-v2-gold)] mt-1">
                      / 0{i + 1}
                    </span>
                    <span className="text-lg md:text-xl leading-snug text-[var(--color-v2-fg-soft)] group-hover:text-[var(--color-v2-fg)] transition-colors text-pretty">
                      {d}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="relative py-20 md:py-24 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-v2-gold)]">
              / 06 · Método
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4rem)] leading-[1.04] tracking-tight max-w-3xl text-balance">
              {comoFunciona.titulo}
            </h2>
          </Reveal>

          <div className="mt-16 space-y-px">
            {comoFunciona.passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    backgroundColor: "rgba(255,106,26,0.05)",
                  }}
                  className="grid md:grid-cols-12 gap-6 items-center py-8 border-t border-[var(--color-v2-line)] last:border-b group"
                >
                  <div className="md:col-span-2 font-display text-5xl md:text-6xl text-[var(--color-v2-gold)]">
                    {p.n}
                  </div>
                  <div className="md:col-span-3 font-display text-2xl">
                    {p.nome}
                  </div>
                  <div className="md:col-span-6 text-[var(--color-v2-fg-soft)] leading-relaxed">
                    {p.descricao}
                  </div>
                  <div className="md:col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-v2-gold)]">
                    →
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        id="contato"
        className="relative py-20 md:py-28 overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,106,26,0.12), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.02] tracking-tight text-balance">
                <WordReveal text={ctaFinal.titulo} />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-xl text-[var(--color-v2-fg-soft)] leading-relaxed max-w-xl">
                {ctaFinal.texto}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 text-base text-[var(--color-v2-fg-soft)]/80 max-w-xl">
                {ctaFinal.apoio}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.3}>
              <ContactForm modelo="v2" />
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-v2-line)] py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-[var(--color-v2-fg-soft)]">
          <div>
            © {new Date().getFullYear()} Dr. Luiz Fernando · Consultoria Jurídica
            Tributária
          </div>
          <div className="uppercase tracking-[0.22em]">
            Modelo 02 · Dark Luxury
          </div>
        </div>
      </footer>
    </main>
  );
}
