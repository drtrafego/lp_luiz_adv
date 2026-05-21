"use client";

import {
  Reveal,
  WordReveal,
  Counter,
  MagneticButton,
  ParallaxY,
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

export default function V1() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const { scrollYProgress: full } = useScroll();
  const bar = useSpring(full, { stiffness: 80, damping: 20 });

  return (
    <main className="relative bg-[var(--color-v1-bg)] text-[var(--color-v1-ink)] grain overflow-hidden">
      {/* progress bar */}
      <motion.div
        style={{ scaleX: bar }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-[var(--color-v1-gold)]"
      />

      {/* nav */}
      <header className="relative z-30 mx-auto max-w-7xl px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="font-serif text-xl tracking-tight">
          <span className="text-[var(--color-v1-gold)]">LF</span>{" "}
          <span className="text-[var(--color-v1-ink)]">·</span> Dr. Luiz
          Fernando
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-[var(--color-v1-ink-soft)]">
          <a href="#problema" className="hover:text-[var(--color-v1-gold)]">
            O Problema
          </a>
          <a href="#solucao" className="hover:text-[var(--color-v1-gold)]">
            Solução
          </a>
          <a
            href="#como-funciona"
            className="hover:text-[var(--color-v1-gold)]"
          >
            Como Funciona
          </a>
          <a href="#contato" className="hover:text-[var(--color-v1-gold)]">
            Contato
          </a>
        </nav>
        <MagneticButton className="text-xs">
          <a
            href="#contato"
            className="rounded-full border border-[var(--color-v1-ink)]/30 px-5 py-2.5 uppercase tracking-[0.18em] hover:bg-[var(--color-v1-ink)] hover:text-[var(--color-v1-paper)] transition-colors"
          >
            Avaliação gratuita
          </a>
        </MagneticButton>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative mx-auto max-w-7xl px-6 md:px-10 pt-12 md:pt-24 pb-24 md:pb-40"
      >
        <motion.div
          style={{ y: yBg, opacity: opacityBg }}
          aria-hidden
          className="absolute -top-10 right-0 w-[60vw] max-w-[700px] h-[700px] pointer-events-none"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-v1-gold-soft)]/40 to-transparent blur-3xl" />
        </motion.div>

        <div className="relative grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8 z-10">
            <Reveal delay={0.1}>
              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[var(--color-v1-muted)]">
                <span className="h-px w-12 bg-[var(--color-v1-gold)]" />
                Consultoria Jurídica Tributária
              </div>
            </Reveal>

            <h1 className="mt-8 font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-balance">
              <WordReveal text={headlines.v1} />
            </h1>

            <Reveal delay={0.3} className="mt-10 max-w-2xl">
              <p className="text-lg md:text-xl leading-relaxed text-[var(--color-v1-ink-soft)] text-pretty">
                {subheadline}
              </p>
            </Reveal>

            <Reveal delay={0.5} className="mt-12 flex flex-wrap gap-4">
              <MagneticButton>
                <a
                  href="#contato"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--color-v1-ink)] text-[var(--color-v1-paper)] px-8 py-4 text-sm font-medium tracking-wide overflow-hidden"
                >
                  <span className="relative z-10">
                    Agendar avaliação gratuita
                  </span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                  <span className="absolute inset-0 bg-[var(--color-v1-gold)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-v1-ink)]/20 px-8 py-4 text-sm font-medium tracking-wide hover:border-[var(--color-v1-ink)]/60 transition-colors"
                >
                  Falar pelo WhatsApp
                </a>
              </MagneticButton>
            </Reveal>
          </div>

          <div className="md:col-span-4 z-10">
            <Reveal delay={0.6} className="border-l border-[var(--color-v1-ink)]/15 pl-6">
              <div className="font-serif text-[5rem] leading-none text-[var(--color-v1-gold)]">
                <Counter to={23} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-v1-muted)]">
                Anos em direito tributário
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <div className="font-serif text-3xl">
                    <Counter to={500} suffix="+" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-v1-muted)] mt-1">
                    Casos resolvidos
                  </div>
                </div>
                <div>
                  <div className="font-serif text-3xl">100%</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-v1-muted)] mt-1">
                    Dentro da legalidade
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* editorial signature */}
        <div className="mt-24 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-3 text-[10px] uppercase tracking-[0.3em] text-[var(--color-v1-muted)]">
            <span className="text-[var(--color-v1-gold)]">N°</span> 01 ·
            Editorial
          </div>
          <div className="md:col-span-6 h-px bg-[var(--color-v1-ink)]/15" />
          <div className="md:col-span-3 text-[10px] uppercase tracking-[0.3em] text-[var(--color-v1-muted)] md:text-right">
            São Paulo · Brasil
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section
        id="problema"
        className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24"
      >
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Reveal>
              <div className="sticky top-24">
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-v1-gold)]">
                  Capítulo I
                </div>
                <div className="mt-3 font-serif text-2xl text-[var(--color-v1-ink-soft)]">
                  O Problema
                </div>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-balance">
                {problema.titulo}
              </h2>
            </Reveal>
            <div className="mt-10 space-y-6 text-lg md:text-xl leading-relaxed text-[var(--color-v1-ink-soft)] text-pretty">
              {problema.paragrafos.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOR */}
      <section className="relative bg-[var(--color-v1-ink)] text-[var(--color-v1-paper)] py-20 md:py-28 overflow-hidden">
        <ParallaxY
          range={80}
          className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-[var(--color-v1-gold)]/8 blur-3xl"
        >
          <div />
        </ParallaxY>
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-v1-gold-soft)]">
                  Capítulo II · A Verdade
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-serif text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-balance">
                  {dor.titulo}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 space-y-5 text-lg md:text-xl leading-relaxed text-[var(--color-v1-paper)]/80 text-pretty">
              {dor.paragrafos.map((p, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <p
                    className={
                      i === 5
                        ? "border-l-2 border-[var(--color-v1-gold)] pl-6 font-serif text-2xl md:text-3xl text-[var(--color-v1-paper)] leading-snug"
                        : ""
                    }
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
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
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-v1-gold)]">
            Capítulo III · Como atuamos
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-balance max-w-4xl">
            {solucao.titulo}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-v1-ink-soft)]">
            {solucao.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {solucao.servicos.map((s, i) => (
            <Reveal key={s.nome} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="group relative h-full rounded-2xl bg-[var(--color-v1-paper)] border border-[var(--color-v1-ink)]/8 p-8 overflow-hidden"
              >
                <div className="font-mono text-xs text-[var(--color-v1-gold)] tracking-widest">
                  0{i + 1}
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight">
                  {s.nome}
                </h3>
                <p className="mt-4 text-[var(--color-v1-ink-soft)] leading-relaxed text-pretty">
                  {s.descricao}
                </p>
                <div className="mt-10 h-px bg-[var(--color-v1-ink)]/10 group-hover:bg-[var(--color-v1-gold)] transition-colors" />
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="mt-12 max-w-3xl text-xl font-serif italic text-[var(--color-v1-ink-soft)] leading-relaxed">
            “{solucao.outro}”
          </p>
        </Reveal>
      </section>

      {/* PROVA SOCIAL */}
      <section className="relative bg-[var(--color-v1-paper)] py-20 md:py-24 border-y border-[var(--color-v1-ink)]/10">
        <div className="mx-auto max-w-5xl px-6 md:px-10 text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-v1-gold)]">
              Resultados Reais
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,4rem)] leading-[1.05] tracking-tight text-balance">
              {provaSocial.titulo}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-[var(--color-v1-ink-soft)] leading-relaxed">
              {provaSocial.texto}
            </p>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
            {[
              { label: "Imóveis salvos", n: 120, suf: "+" },
              { label: "Empresas em pé", n: 230, suf: "+" },
              { label: "Patrimônios protegidos", n: 180, suf: "+" },
            ].map((c, i) => (
              <Reveal key={c.label} delay={0.1 * i}>
                <div className="rounded-2xl border border-[var(--color-v1-ink)]/10 p-8">
                  <div className="font-serif text-5xl text-[var(--color-v1-ink)]">
                    <Counter to={c.n} suffix={c.suf} />
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-v1-muted)]">
                    {c.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-v1-gold)]">
                Capítulo IV
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-serif text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] tracking-tight">
                {diferenciais.titulo}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-[var(--color-v1-ink)]/10">
              {diferenciais.lista.map((d, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li className="group flex items-start gap-6 py-6">
                    <span className="font-mono text-xs text-[var(--color-v1-gold)] mt-1">
                      0{i + 1}
                    </span>
                    <span className="text-lg md:text-xl leading-snug text-[var(--color-v1-ink-soft)] group-hover:text-[var(--color-v1-ink)] transition-colors text-pretty">
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
        className="relative bg-[var(--color-v1-ink)] text-[var(--color-v1-paper)] py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-v1-gold-soft)]">
              Como funciona
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-serif text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] tracking-tight max-w-3xl">
              {comoFunciona.titulo}
            </h2>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
            <div
              className="hidden md:block absolute top-12 left-[14%] right-[14%] h-px bg-[var(--color-v1-gold)]/30"
              aria-hidden
            />
            {comoFunciona.passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.15}>
                <div className="relative">
                  <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-v1-gold)] text-[var(--color-v1-ink)] font-serif text-xl">
                    {p.n}
                    <span
                      className="absolute inset-0 rounded-full border border-[var(--color-v1-gold)]"
                      style={{
                        animation: `pulse-ring 2.4s ${i * 0.6}s cubic-bezier(0.2,0.8,0.2,1) infinite`,
                      }}
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl">{p.nome}</h3>
                  <p className="mt-3 text-[var(--color-v1-paper)]/70 leading-relaxed text-pretty">
                    {p.descricao}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        id="contato"
        className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28"
      >
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.02] tracking-tight text-balance">
                <WordReveal text={ctaFinal.titulo} />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-xl text-[var(--color-v1-ink-soft)] leading-relaxed max-w-xl">
                {ctaFinal.texto}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 text-base text-[var(--color-v1-muted)] max-w-xl">
                {ctaFinal.apoio}
              </p>
            </Reveal>
            <Reveal delay={0.4} className="mt-10 flex flex-wrap gap-4">
              <MagneticButton>
                <a
                  href="#contato"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--color-v1-ink)] text-[var(--color-v1-paper)] px-8 py-4 text-sm font-medium overflow-hidden"
                >
                  <span className="relative z-10">{ctaFinal.principal}</span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                  <span className="absolute inset-0 bg-[var(--color-v1-gold)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-v1-ink)]/20 px-8 py-4 text-sm font-medium hover:border-[var(--color-v1-ink)]/60 transition-colors"
                >
                  {ctaFinal.secundario}
                </a>
              </MagneticButton>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.3}>
              <ContactForm modelo="v1" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--color-v1-ink)]/10 py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-[var(--color-v1-muted)]">
          <div>
            © {new Date().getFullYear()} Dr. Luiz Fernando · Consultoria Jurídica
            Tributária
          </div>
          <div className="uppercase tracking-[0.2em]">
            Modelo 01 · Editorial Sóbrio
          </div>
        </div>
      </footer>
    </main>
  );
}
