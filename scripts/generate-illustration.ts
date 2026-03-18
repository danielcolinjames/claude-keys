/**
 * Generate the Claude Keys illustration via Quiver API.
 *
 * Usage:
 *   QUIVER_API_KEY=... npx tsx scripts/generate-illustration.ts
 *
 * Or if you have 1Password CLI:
 *   op run --env-file /path/to/being/.env.production -- npx tsx scripts/generate-illustration.ts
 *
 * Outputs: public/claude-keys-illustration.svg
 */

const QUIVER_API_URL = "https://api.quiver.ai/v1/svgs/generations";

const PROMPT = [
  "Illustration in the Anthropic/Claude brand style:",
  "warm terracotta background (hex #D87756),",
  "three identical Claude AI sparkle/starburst symbols (the 12-pointed organic asterisk logo) arranged in a row,",
  "rendered in cream white with slightly imperfect, hand-drawn organic line quality,",
  "a simple padlock icon drawn in thick black brushstroke lines wrapping around or below the middle sparkle,",
  "the lock should feel protective but not heavy — more like a gentle embrace,",
  "the overall style should match Anthropic's illustration aesthetic:",
  "bold geometric shapes in cream/white, thick organic black line art with a hand-drawn quality,",
  "warm and friendly, minimal detail, lots of negative space,",
  "no text, no gradients, flat colors only,",
  "the composition should be horizontally oriented (wider than tall),",
  "similar in feel to the Anthropic blog illustrations with their characteristic mix of white geometric shapes and black organic linework on terracotta.",
].join(" ");

async function main() {
  const apiKey = process.env.QUIVER_API_KEY;
  if (!apiKey) {
    console.error("Error: QUIVER_API_KEY environment variable required.");
    console.error("");
    console.error("  QUIVER_API_KEY=your-key npx tsx scripts/generate-illustration.ts");
    console.error("");
    console.error("Or with 1Password CLI:");
    console.error("  op run --env-file ../leftway/being/.env.production -- npx tsx scripts/generate-illustration.ts");
    process.exit(1);
  }

  console.log("Generating Claude Keys illustration via Quiver...");
  console.log("Prompt:", PROMPT.slice(0, 80) + "...");

  const res = await fetch(QUIVER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "arrow-preview",
      prompt: PROMPT,
      n: 1,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Quiver API error (${res.status}):`, err);
    process.exit(1);
  }

  const data = await res.json();
  const svg = data.data?.[0]?.svg;

  if (!svg) {
    console.error("No SVG returned from Quiver.");
    console.error("Response:", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(process.cwd(), "public", "claude-keys-illustration.svg");
  fs.writeFileSync(outPath, svg);
  console.log(`Saved to ${outPath}`);
  console.log(`SVG length: ${svg.length} chars`);
}

main();
