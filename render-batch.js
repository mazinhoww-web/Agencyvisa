// render-batch.js — Renderiza múltiplos stories de aprovação em batch
//
// Uso:
//   node render-batch.js
//
// Saída: pasta out/ com um MP4 por cliente

const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs");

// ─── Lista de clientes ────────────────────────────────────────────────────────
// Edite esta lista para gerar novos stories sem redesign.
const clientes = [
  {
    nomeCliente: "Mariana S.",
    cidadeCliente: "São Paulo, SP",
    tipoVisto: "B1/B2",
    mensagem: "Que conquista incrível! 🎉",
  },
  {
    nomeCliente: "Rafael e Amanda",
    cidadeCliente: "Curitiba, PR",
    tipoVisto: "B1/B2",
    mensagem: "Casal aprovado! 🥹",
  },
  {
    nomeCliente: "João P.",
    cidadeCliente: "Belo Horizonte, MG",
    tipoVisto: "F-1",
    mensagem: "Estudar nos EUA! ✈️",
  },
  // Adicione mais clientes aqui...
];

// ─── Renderização ─────────────────────────────────────────────────────────────
async function renderAll() {
  // Garante que a pasta de saída existe
  const outDir = path.join(__dirname, "out");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("📦 Empacotando composição...");
  const bundled = await bundle({
    entryPoint: path.join(__dirname, "src", "remotion", "index.ts"),
    // Desativa fast refresh para builds headless
    webpackOverride: (config) => config,
  });

  for (const cliente of clientes) {
    const slug = cliente.nomeCliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    const outputPath = path.join(outDir, `aprovacao-${slug}.mp4`);

    console.log(`\n🎬 Renderizando: ${cliente.nomeCliente}...`);

    const composition = await selectComposition({
      serveUrl: bundled,
      id: "AprovacaoStory",
      inputProps: cliente,
    });

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: cliente,
    });

    console.log(`✓ Salvo em: ${outputPath}`);
  }

  console.log(`\n🚀 Todos os ${clientes.length} stories renderizados!`);
}

renderAll().catch((err) => {
  console.error("Erro durante renderização:", err);
  process.exit(1);
});
