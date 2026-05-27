"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneInputWithFlag from "./PhoneInputWithFlag";

type Variant = "v1" | "v2" | "v3";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function getGaClientId(): string | undefined {
  const raw = getCookie("_ga");
  if (!raw) return undefined;
  const m = raw.match(/^GA\d+\.\d+\.(\d+\.\d+)$/);
  return m ? m[1] : undefined;
}

function getGaSessionId(measurementId: string): string | undefined {
  const container = measurementId.replace("G-", "");
  const raw = getCookie(`_ga_${container}`);
  if (!raw) return undefined;
  const m = raw.match(/^GS[^.]*\.\d+\.(\d+)\./);
  return m ? m[1] : undefined;
}

function readGcl(name: string): string | undefined {
  const raw = getCookie(`_gcl_${name}`);
  if (!raw) return undefined;
  const m = raw.match(/^GCL\.\d+\.(.+)$/);
  return m ? m[1] : raw;
}

function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `eid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const themes: Record<
  Variant,
  {
    container: string;
    label: string;
    input: string;
    button: string;
    helper: string;
    title: string;
  }
> = {
  v1: {
    container:
      "rounded-2xl border border-[var(--color-v1-ink)]/10 bg-[var(--color-v1-paper)]/80 backdrop-blur p-8 md:p-10",
    label:
      "text-[11px] uppercase tracking-[0.22em] text-[var(--color-v1-muted)]",
    input:
      "mt-2 w-full rounded-xl border border-[var(--color-v1-ink)]/15 bg-[var(--color-v1-paper)] px-4 py-3 text-[var(--color-v1-ink)] placeholder:text-[var(--color-v1-muted)]/60 focus:outline-none focus:border-[var(--color-v1-gold)] transition-colors",
    button:
      "w-full rounded-full bg-[var(--color-v1-ink)] text-[var(--color-v1-paper)] px-6 py-4 text-sm font-medium hover:bg-[var(--color-v1-gold)] hover:text-[var(--color-v1-ink)] transition-colors disabled:opacity-50",
    helper: "text-xs text-[var(--color-v1-muted)] text-center",
    title:
      "font-serif text-3xl md:text-4xl leading-tight text-[var(--color-v1-ink)]",
  },
  v2: {
    container:
      "rounded-2xl border border-[var(--color-v2-line)] bg-[var(--color-v2-bg-soft)]/60 backdrop-blur p-8 md:p-10",
    label:
      "text-[11px] uppercase tracking-[0.22em] text-[var(--color-v2-fg-soft)]",
    input:
      "mt-2 w-full rounded-xl border border-[var(--color-v2-line)] bg-[var(--color-v2-bg)] px-4 py-3 text-[var(--color-v2-fg)] placeholder:text-[var(--color-v2-fg-soft)]/50 focus:outline-none focus:border-[var(--color-v2-gold)] transition-colors",
    button:
      "w-full rounded-full bg-[var(--color-v2-gold)] text-[var(--color-v2-bg)] px-6 py-4 text-sm font-medium hover:bg-[var(--color-v2-gold-soft)] transition-colors disabled:opacity-50",
    helper: "text-xs text-[var(--color-v2-fg-soft)] text-center",
    title:
      "font-display text-3xl md:text-4xl leading-tight text-[var(--color-v2-fg)]",
  },
  v3: {
    container:
      "rounded-3xl border border-[var(--color-v3-ink)]/8 bg-[var(--color-v3-paper)] p-8 md:p-10 shadow-[0_30px_80px_rgba(10,10,10,0.06)]",
    label:
      "text-[11px] uppercase tracking-[0.22em] text-[var(--color-v3-muted)]",
    input:
      "mt-2 w-full rounded-xl border border-[var(--color-v3-ink)]/12 bg-[var(--color-v3-bg)] px-4 py-3 text-[var(--color-v3-ink)] placeholder:text-[var(--color-v3-muted)]/60 focus:outline-none focus:border-[var(--color-v3-accent)] transition-colors",
    button:
      "w-full rounded-full bg-[var(--color-v3-ink)] text-[var(--color-v3-bg)] px-6 py-4 text-sm font-medium hover:bg-[var(--color-v3-accent)] transition-colors disabled:opacity-50",
    helper: "text-xs text-[var(--color-v3-muted)] text-center",
    title:
      "text-3xl md:text-4xl leading-tight tracking-[-0.01em] text-[var(--color-v3-ink)]",
  },
};

export function ContactForm({
  modelo,
  title = "Primeira conversa, gratuita e confidencial.",
  subtitle = "Deixe seu nome e telefone, nossa equipe entra em contato pelo WhatsApp.",
}: {
  modelo: Variant;
  title?: string;
  subtitle?: string;
}) {
  const t = themes[modelo];
  const router = useRouter();
  const params = useSearchParams();

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappValid, setWhatsappValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const utms = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
  };

  useEffect(() => {
    setErr(null);
  }, [name, whatsapp]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setErr(null);

    if (name.trim().length < 2) {
      setErr("Informe seu nome completo.");
      return;
    }
    if (!whatsappValid) {
      setErr("Informe um WhatsApp válido.");
      return;
    }
    const digits = whatsapp.replace(/\D/g, "");

    setLoading(true);
    try {
      const measurementId =
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
        process.env.NEXT_PUBLIC_GA4_ID ??
        "";
      const eventId = generateEventId();
      const gclid = params.get("gclid") ?? readGcl("aw");
      const wbraid = params.get("wbraid") ?? readGcl("wbraid");
      const gbraid = params.get("gbraid") ?? readGcl("gbraid");

      const payload = {
        name: name.trim(),
        whatsapp: digits,
        modelo,
        event_id: eventId,
        gclid,
        wbraid,
        gbraid,
        ...utms,
        ga_client_id: getGaClientId(),
        ga_session_id: measurementId ? getGaSessionId(measurementId) : undefined,
      };

      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await r.json()) as { success: boolean; leadId?: string };
      if (!r.ok || !json.success) throw new Error("falha");

      const leadId = json.leadId ?? `fallback_${Date.now()}`;
      const leadValue = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? "1000");
      const leadCurrency = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? "BRL";
      const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      const conversionLabel =
        process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

      if (typeof window.gtag === "function") {
        if (conversionId && conversionLabel) {
          window.gtag("event", "conversion", {
            send_to: `${conversionId}/${conversionLabel}`,
            transaction_id: leadId,
            value: leadValue,
            currency: leadCurrency,
          });
        }
        window.gtag("event", "generate_lead", {
          transaction_id: leadId,
          value: leadValue,
          currency: leadCurrency,
          lead_source: `modelo-${modelo}`,
        });
      }

      try {
        sessionStorage.setItem(
          "lead",
          JSON.stringify({ leadId, modelo, name: name.trim() }),
        );
      } catch {}

      router.push(`/obrigado?lead=${encodeURIComponent(leadId)}&m=${modelo}`);
    } catch {
      setErr("Não foi possível enviar agora. Tente novamente em instantes.");
      setLoading(false);
    }
  }

  return (
    <div className={t.container}>
      <h3 className={t.title}>{title}</h3>
      <p className="mt-3 text-sm leading-relaxed opacity-70">{subtitle}</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className={t.label}>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            className={t.input}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label className={t.label}>WhatsApp</label>
          <PhoneInputWithFlag
            value={whatsapp}
            onChange={(v, valid) => {
              setWhatsapp(v);
              setWhatsappValid(valid);
            }}
            className="mt-2"
          />
        </div>

        {err && (
          <p
            className="text-sm rounded-lg px-3 py-2 border border-red-500/30 bg-red-500/10 text-red-500"
            role="alert"
          >
            {err}
          </p>
        )}

        <button type="submit" disabled={loading} className={t.button}>
          {loading ? "Enviando..." : "Agendar avaliação gratuita"}
        </button>

        <p className={t.helper}>
          Atendimento confidencial. Resposta em até 1 dia útil.
        </p>
      </form>
    </div>
  );
}
