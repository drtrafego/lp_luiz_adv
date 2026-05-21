"use client";

import {
  Reveal,
  WordReveal,
  Counter,
  MagneticButton,
  Tilt3D,
} from "@/components/motion-primitives";
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

export default function V3() {
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hScroll } = useScroll({
    target: horizontalRef,
    offset: ["start start", "end end"],
  });
  const xMove = useTransform(hScroll, [0, 1], ["0%", "-66%"]);

  const { scrollYProgress: full } = useScroll();
  const bar = useSpring(full, { stiffness: 80, damping: 20 });

  return (
    <main className="relative bg-[var(--color-v3-bg)] text-[var(--color-v3-ink)] overflow-hidden">
      <motion.div
        style={{ scaleX: bar }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-[var(--color-v3-accent)]"
      />

      {/* nav */}
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4">
        <div className="flex items-center gap-2 rounded-full border border-[var(--color-v3-ink)]/10 bg-[var(--color-v3-paper)]/80 backdrop-blur-md px-3 py-2 shadow-[0_8px_30px_rgba(14,27,44,0.06)]">
          <div className="px-3 text-sm font-medium">
            <span className="text-[var(--color-v3-accent)]">LF</span>{" "}
            <span className="opacity-30">·</span>{" "}
            <span className="font-instrument italic">
              Dr. Luiz Fernando
            </span>
          </div>
          <nav className="hidden md:flex items-center text-xs text-[var(--color-v3-muted)]">
            <a
              className="px-3 py-2 rounded-full hover:text-[var(--color-v3-ink)] transition-colors"
              href="#problema"
            >
              Diagnóstico
            </a>
            <a
              className="px-3 py-2 rounded-full hover:text-[var(--color-v3-ink)] transition-colors"
              href="#solucao"
            >
              Atuação
            </a>
            <a
              className="px-3 py-2 rounded-full hover:text-[var(--color-v3-ink)] transition-colors"
              href="#metodo"
            >
              Método
            </a>
          </nav>
          <MagneticButton>
            <a
              href="#contato"
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-v3-ink)] text-[var(--color-v3-bg)] px-4 py-2 text-xs font-medium hover:bg-[var(--color-v3-accent)] transition-colors"
            >
              Conversar
              <span>→</span>
            </a>
          </MagneticButton>
        </div>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <Reveal>
                <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[var(--color-v3-muted)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-v3-accent)]" />
                  Consultoria Jurídica Tributária
                  <span className="opacity-30">·</span>
                  <span>São Paulo, Brasil</span>
                </div>
              </Reveal>
              <h1 className="mt-8 text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.98] tracking-[-0.02em] font-medium text-balance">
                <span className="font-instrument italic text-[var(--color-v3-accent)] mr-2">
                  Você
                </span>
                <WordReveal text={headlines.v3.replace("Você ", "")} />
              </h1>
              <Reveal delay={0.4}>
                <p className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-[var(--color-v3-ink-soft)] text-pretty">
                  {subheadline}
                </p>
              </Reveal>
              <Reveal delay={0.6}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <MagneticButton>
                    <a
                      href="#contato"
                      className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-v3-ink)] text-[var(--color-v3-bg)] px-7 py-4 text-sm font-medium hover:bg-[var(--color-v3-accent)] transition-colors"
                    >
                      Agendar avaliação gratuita
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href="#contato"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-v3-ink)]/15 hover:border-[var(--color-v3-ink)]/40 px-7 py-4 text-sm font-medium transition-colors"
                    >
                      Falar pelo WhatsApp
                    </a>
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            {/* card lateral 3D */}
            <div className="md:col-span-4">
              <Reveal delay={0.5}>
                <Tilt3D intensity={10} className="relative">
                  <div className="rounded-3xl bg-[var(--color-v3-paper)] border border-[var(--color-v3-ink)]/8 p-8 shadow-[0_30px_80px_rgba(14,27,44,0.08)]">
                    <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
                      23 anos · OAB SP
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-4xl font-medium">
                          <Counter to={500} suffix="+" />
                        </div>
                        <div className="mt-1 text-xs text-[var(--color-v3-muted)]">
                          Casos resolvidos
                        </div>
                      </div>
                      <div>
                        <div className="text-4xl font-medium">
                          <Counter to={100} suffix="%" />
                        </div>
                        <div className="mt-1 text-xs text-[var(--color-v3-muted)]">
                          Dentro da lei
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 h-px bg-[var(--color-v3-ink)]/10" />
                    <div className="mt-6 text-sm text-[var(--color-v3-ink-soft)] leading-relaxed font-instrument italic">
                      “Apresentamos o que é possível, os riscos reais e a
                      estratégia mais inteligente para o seu caso.”
                    </div>
                  </div>
                  <div
                    aria-hidden
                    className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-[var(--color-v3-accent)]/15 via-transparent to-[var(--color-v3-accent-2)]/15 blur-2xl"
                  />
                </Tilt3D>
              </Reveal>
            </div>
          </div>

          {/* tags */}
          <Reveal delay={0.8}>
            <div className="mt-16 flex flex-wrap gap-2">
              {[
                "Gestão de Passivo Fiscal",
                "Transação Tributária",
                "Planejamento Sucessório",
                "PGFN",
                "Receita Federal",
                "ITCMD",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--color-v3-ink)]/10 bg-[var(--color-v3-paper)] px-4 py-1.5 text-xs text-[var(--color-v3-ink-soft)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEMA + Bento */}
      <section id="problema" className="relative py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-12">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
                  Diagnóstico · 01
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal>
                <h2 className="text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] tracking-[-0.02em] font-medium text-balance">
                  {problema.titulo}
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="grid md:grid-cols-6 md:grid-rows-2 gap-4 md:h-[520px]">
            {problema.paragrafos.map((p, i) => {
              const layouts = [
                "md:col-span-4 md:row-span-1",
                "md:col-span-2 md:row-span-1",
                "md:col-span-2 md:row-span-1",
                "md:col-span-4 md:row-span-1",
              ];
              const colors = [
                "bg-[var(--color-v3-paper)]",
                "bg-[var(--color-v3-ink)] text-[var(--color-v3-bg)]",
                "bg-gradient-to-br from-[var(--color-v3-accent)]/12 to-[var(--color-v3-paper)]",
                "bg-[var(--color-v3-paper)]",
              ];
              return (
                <Reveal key={i} delay={i * 0.08} className={layouts[i]}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.4 }}
                    className={`group h-full rounded-3xl border border-[var(--color-v3-ink)]/8 p-8 ${colors[i]} relative overflow-hidden`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-50">
                      / 0{i + 1}
                    </div>
                    <p className="mt-6 text-lg md:text-xl leading-snug text-pretty">
                      {p}
                    </p>
                    {i === 1 && (
                      <div
                        aria-hidden
                        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-[var(--color-v3-accent)]/30 blur-3xl group-hover:bg-[var(--color-v3-accent)]/50 transition-colors"
                      />
                    )}
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOR - sticky panels */}
      <section className="relative px-6 md:px-10 py-20 md:py-32">
        <div className="mx-auto max-w-7xl grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <Reveal>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
                  A verdade · 02
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.04] tracking-[-0.02em] font-medium text-balance">
                  <span className="font-instrument italic text-[var(--color-v3-accent)]">
                    Esse peso
                  </span>{" "}
                  você não precisa carregar sozinho.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 inline-flex items-center gap-3 text-sm text-[var(--color-v3-muted)]">
                  <span className="h-px w-8 bg-[var(--color-v3-accent)]" />
                  23 anos ao lado de empresários e famílias
                </div>
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-7 space-y-5">
            {dor.paragrafos.map((p, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <p
                  className={
                    i === 5
                      ? "rounded-2xl bg-[var(--color-v3-ink)] text-[var(--color-v3-bg)] p-8 text-xl md:text-2xl font-instrument italic leading-snug"
                      : "text-lg md:text-xl leading-relaxed text-[var(--color-v3-ink-soft)] text-pretty"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO - Horizontal scroll pin */}
      <section
        id="solucao"
        ref={horizontalRef}
        className="relative h-[300vh]"
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 md:px-10 w-full">
            <Reveal>
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
                Atuação · 03
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.06] tracking-[-0.02em] font-medium max-w-3xl text-balance">
                {solucao.titulo}
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 overflow-hidden">
            <motion.div
              style={{ x: xMove }}
              className="flex gap-6 px-6 md:px-10 will-change-transform"
            >
              {solucao.servicos.map((s, i) => (
                <div
                  key={s.nome}
                  className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[42vw] rounded-3xl border border-[var(--color-v3-ink)]/8 bg-[var(--color-v3-paper)] p-10 overflow-hidden"
                >
                  <div className="font-mono text-xs text-[var(--color-v3-accent)] tracking-widest">
                    0{i + 1} / 03
                  </div>
                  <h3 className="mt-8 text-3xl md:text-4xl font-medium leading-tight tracking-[-0.01em]">
                    {s.nome}
                  </h3>
                  <p className="mt-6 text-lg leading-relaxed text-[var(--color-v3-ink-soft)] max-w-md text-pretty">
                    {s.descricao}
                  </p>
                  <div className="absolute bottom-10 right-10 flex items-center gap-3 text-sm text-[var(--color-v3-accent)]">
                    <span className="h-px w-10 bg-[var(--color-v3-accent)]" />
                    Saiba mais
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
                    style={{
                      background:
                        i === 0
                          ? "var(--color-v3-accent-2)"
                          : i === 1
                            ? "var(--color-v3-accent)"
                            : "var(--color-v3-ink-soft)",
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mx-auto max-w-7xl px-6 md:px-10 w-full mt-10">
            <p className="font-instrument italic text-xl md:text-2xl text-[var(--color-v3-ink-soft)] max-w-3xl">
              “{solucao.outro}”
            </p>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="relative py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
              Resultados · 04
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 text-[clamp(2rem,4vw,4rem)] leading-[1.04] tracking-[-0.02em] font-medium max-w-4xl mx-auto text-balance">
              <span className="font-instrument italic text-[var(--color-v3-accent)]">
                Imóveis salvos.
              </span>{" "}
              Empresas que continuaram de pé.{" "}
              <span className="font-instrument italic text-[var(--color-v3-accent-2)]">
                Patrimônios protegidos.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-[var(--color-v3-ink-soft)] leading-relaxed">
              {provaSocial.texto}
            </p>
          </Reveal>
        </div>
      </section>

      {/* DIFERENCIAIS - bento alternado */}
      <section className="relative py-24 md:py-32 px-6 md:px-10 bg-[var(--color-v3-paper)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-12 gap-10 mb-12">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
                  Diferenciais · 05
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.04] tracking-[-0.02em] font-medium">
                  {diferenciais.titulo}.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 self-end">
              <Reveal delay={0.2}>
                <p className="text-lg text-[var(--color-v3-ink-soft)] leading-relaxed max-w-xl">
                  Construímos relação de confiança, não de transação. Você
                  recebe avaliação honesta antes de qualquer proposta.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {diferenciais.lista.map((d, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-3xl border border-[var(--color-v3-ink)]/8 bg-[var(--color-v3-bg)] p-8 flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[var(--color-v3-accent)]">
                      0{i + 1}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[var(--color-v3-accent)]" />
                  </div>
                  <p className="text-lg leading-snug text-pretty">{d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="metodo"
        className="relative py-24 md:py-32 px-6 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]">
                  Método · 06
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.04] tracking-[-0.02em] font-medium">
                  {comoFunciona.titulo}
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6">
            {comoFunciona.passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.12}>
                <Tilt3D intensity={8}>
                  <div className="relative rounded-3xl border border-[var(--color-v3-ink)]/8 bg-[var(--color-v3-paper)] p-8 h-full">
                    <div className="flex items-start justify-between">
                      <div className="font-instrument text-6xl italic text-[var(--color-v3-accent)]">
                        {p.n}
                      </div>
                      <span className="font-mono text-xs text-[var(--color-v3-muted)]">
                        passo
                      </span>
                    </div>
                    <h3 className="mt-8 text-2xl font-medium tracking-tight">
                      {p.nome}
                    </h3>
                    <p className="mt-4 text-[var(--color-v3-ink-soft)] leading-relaxed">
                      {p.descricao}
                    </p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contato" className="relative py-24 md:py-40 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Tilt3D intensity={4}>
            <div className="relative rounded-[2.5rem] bg-[var(--color-v3-ink)] text-[var(--color-v3-bg)] p-10 md:p-20 overflow-hidden">
              <div
                aria-hidden
                className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
                style={{ background: "var(--color-v3-accent)" }}
              />
              <div
                aria-hidden
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
                style={{ background: "var(--color-v3-accent-2)" }}
              />
              <div className="relative grid md:grid-cols-12 gap-10 items-end">
                <div className="md:col-span-8">
                  <Reveal>
                    <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-v3-accent)]/90">
                      Próximo passo
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="mt-6 text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] font-medium text-balance">
                      <span className="font-instrument italic">
                        O melhor momento
                      </span>{" "}
                      para agir foi ontem.{" "}
                      <span className="text-[var(--color-v3-accent)]">
                        O segundo melhor é agora.
                      </span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="mt-8 max-w-xl text-lg text-[var(--color-v3-bg)]/80 leading-relaxed">
                      {ctaFinal.texto}
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <p className="mt-4 max-w-xl text-base text-[var(--color-v3-bg)]/60">
                      {ctaFinal.apoio}
                    </p>
                  </Reveal>
                  <Reveal delay={0.4}>
                    <div className="mt-10 flex flex-wrap gap-3">
                      <MagneticButton strength={0.45}>
                        <a
                          href="#"
                          className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-v3-bg)] text-[var(--color-v3-ink)] px-8 py-4 text-sm font-medium hover:bg-[var(--color-v3-accent)] hover:text-[var(--color-v3-bg)] transition-colors"
                        >
                          {ctaFinal.principal}
                          <span className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      </MagneticButton>
                      <MagneticButton>
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-v3-bg)]/20 hover:border-[var(--color-v3-bg)]/60 px-8 py-4 text-sm font-medium transition-colors"
                        >
                          {ctaFinal.secundario}
                        </a>
                      </MagneticButton>
                    </div>
                  </Reveal>
                </div>
                <div className="md:col-span-4">
                  <Reveal delay={0.5}>
                    <div className="rounded-2xl bg-[var(--color-v3-bg)]/10 backdrop-blur border border-[var(--color-v3-bg)]/10 p-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-v3-bg)]/60">
                          Conversa
                        </span>
                        <span>Gratuita</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-v3-bg)]/60">
                          Sigilo
                        </span>
                        <span>Total</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-v3-bg)]/60">
                          Atendimento
                        </span>
                        <span>Brasil</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-v3-bg)]/60">
                          Retorno
                        </span>
                        <span>1 dia útil</span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Tilt3D>
        </div>
      </section>

      <footer className="border-t border-[var(--color-v3-ink)]/10 py-10 px-6 md:px-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-[var(--color-v3-muted)]">
          <div>
            © {new Date().getFullYear()} Dr. Luiz Fernando · Consultoria Jurídica
            Tributária
          </div>
          <div className="uppercase tracking-[0.22em]">
            Modelo 03 · Arquitetônico Minimalista
          </div>
        </div>
      </footer>
    </main>
  );
}
