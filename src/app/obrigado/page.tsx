"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";

function buildWhatsAppUrl(name?: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
  const baseMsg =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Olá Dr. Luiz, vim do site e gostaria de uma avaliação.";
  const msg = name ? `${baseMsg} Meu nome é ${name}.` : baseMsg;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export default function Obrigado() {
  const params = useSearchParams();
  const leadId = params.get("lead") ?? undefined;
  const modelo = params.get("m") ?? undefined;
  const [count, setCount] = useState(3);
  const [name, setName] = useState<string | undefined>();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lead");
      if (raw) {
        const data = JSON.parse(raw) as { name?: string };
        setName(data.name);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (typeof window.fbq === "function" && leadId) {
      window.fbq("track", "Lead", {}, { eventID: leadId });
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        currency: "BRL",
        lead_id: leadId,
        lead_source: modelo ? `modelo-${modelo}` : "default",
      });
    }

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "generate_lead",
      event_category: "formulario",
      modelo: modelo ?? "default",
      lead_id: leadId,
    });
  }, [leadId, modelo]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCount((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    const redirect = setTimeout(() => {
      window.location.href = buildWhatsAppUrl(name);
    }, 3000);
    return () => {
      clearInterval(tick);
      clearTimeout(redirect);
    };
  }, [name]);

  return (
    <main className="min-h-screen bg-[#050507] text-[#F4EFE6] flex items-center justify-center px-6">
      <div className="relative max-w-2xl text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-32 -z-10 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,106,26,0.25), transparent 70%)",
          }}
        />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mx-auto w-20 h-20 rounded-full bg-[#FF6A1A] text-[#050507] flex items-center justify-center text-3xl font-medium"
        >
          ✓
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight text-balance"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {name ? `${name.split(" ")[0]}, recebemos seu contato.` : "Recebemos seu contato."}
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-6 text-lg text-[#A8A39A] leading-relaxed"
        >
          Você será direcionado ao WhatsApp da nossa equipe em
          <span className="text-[#FF6A1A] font-medium"> {count} segundo{count === 1 ? "" : "s"}</span>.
        </motion.p>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <a
            href={buildWhatsAppUrl(name)}
            className="inline-flex items-center gap-3 rounded-full bg-[#FF6A1A] text-[#050507] px-8 py-4 text-sm font-medium hover:bg-[#FFA060] transition-colors"
          >
            Ir para o WhatsApp agora
            <span>→</span>
          </a>
          <div className="text-xs text-[#A8A39A]/70 uppercase tracking-[0.22em]">
            Atendimento confidencial · Dr. Luiz Fernando
          </div>
        </motion.div>
      </div>
    </main>
  );
}
