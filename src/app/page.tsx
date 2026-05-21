import Link from "next/link";

const versoes = [
  {
    href: "/v1",
    nome: "Editorial Sóbrio",
    sub: "Patrimônio e Herança",
    desc: "Areia com preto profundo e laranja terracota queimado. Tipografia editorial serif, parallax sutil e revelações de texto.",
    bg: "bg-[#F2EBDD] text-[#0A0A0A]",
    accent: "border-[#D9531E]",
  },
  {
    href: "/v2",
    nome: "Dark Luxury",
    sub: "Urgência e Custo da Inação",
    desc: "Preto absoluto com laranja neon vibrante. Cursor spotlight, aurora animada, marquee de números e CTAs magnéticos.",
    bg: "bg-[#050507] text-[#F4EFE6]",
    accent: "border-[#FF6A1A]",
  },
  {
    href: "/v3",
    nome: "Arquitetônico Minimalista",
    sub: "Inteligência e Planejamento",
    desc: "Off-white com preto e laranja coral. Bento grid, scroll horizontal pinado e 3D cards em perspectiva.",
    bg: "bg-[#FAFAF6] text-[#0A0A0A]",
    accent: "border-[#F26A3E]",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Dr. Luiz Fernando, Consultoria Jurídica Tributária
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight">
            Três modelos de landing page.
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Mesma copy, três direções visuais. Clique para explorar.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {versoes.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className={`group relative overflow-hidden rounded-2xl border ${v.accent} ${v.bg} p-8 transition-transform duration-500 hover:-translate-y-1`}
            >
              <div className="text-xs uppercase tracking-[0.25em] opacity-60">
                {v.href}
              </div>
              <div className="mt-6 text-2xl font-semibold">{v.nome}</div>
              <div className="mt-1 text-sm opacity-70">{v.sub}</div>
              <p className="mt-6 text-sm opacity-80 leading-relaxed">
                {v.desc}
              </p>
              <div className="mt-10 inline-flex items-center gap-2 text-sm font-medium">
                Visitar
                <span className="transition-transform group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
