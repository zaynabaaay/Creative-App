/**
 * Seed realistic sample data so the app feels alive while testing.
 *
 * Creates 5 creative personas (accounts under zaynab.omer+seed-*@gmail.com,
 * shared password below) with profiles, generated portfolio images, jobs,
 * and a few responses. Everything is identifiable as seed data and can be
 * removed by deleting those users in Supabase → Authentication → Users.
 *
 * Run:  node scripts/seed.mjs
 * Env:  reads .env.local (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PASSWORD = "creative-hub-seed-2026";

const SWATCHES = [
  ["#C98B7E", "#A5675C"], ["#8FA087", "#657A5F"], ["#C9A24B", "#9C7A2E"],
  ["#6B7A8F", "#4A5768"], ["#7E6E8F", "#5B4E6B"], ["#B5715A", "#8A5138"],
];

const PERSONAS = [
  {
    email: "zaynab.omer+seed-maya@gmail.com", handle: "maya.shoots",
    name: "Maya Okonkwo", role: "BTS & documentary videographer",
    area: "Hintonburg, Ottawa", rate: "$180–260 / day",
    disciplines: ["Video", "BTS", "Doc"],
    bio: "I shoot the in-between moments — the tension backstage, the laugh between takes. Handheld, natural, unposed.",
    work: [0, 3, 1, 4, 2, 5],
  },
  {
    email: "zaynab.omer+seed-tunde@gmail.com", handle: "tundebailey",
    name: "Tunde Bailey", role: "Editorial & fashion photographer",
    area: "Westboro, Ottawa", rate: "$300–500 / day",
    disciplines: ["Photo", "Fashion"],
    bio: "Fashion and editorial, shot on film when the budget allows. I care about styling as much as light.",
    work: [2, 5, 0, 3, 4, 1],
  },
  {
    email: "zaynab.omer+seed-ines@gmail.com", handle: "ines.frames",
    name: "Inès Duarte", role: "Portrait photographer — natural light",
    area: "The Glebe, Ottawa", rate: "$250–350 / day",
    disciplines: ["Photo", "Portrait"],
    bio: "Quiet, warm portraiture. I like windows, morning light, and letting people settle before I press the shutter.",
    work: [4, 1, 3, 0, 5, 2],
  },
  {
    email: "zaynab.omer+seed-rowan@gmail.com", handle: "rowanlights",
    name: "Rowan Sethi", role: "Gaffer & lighting",
    area: "Centretown, Ottawa", rate: "$220 / day",
    disciplines: ["Lighting", "Gaffer"],
    bio: "Ten years lighting music videos and commercials. I make small crews look big-budget.",
    work: [3, 0, 4, 2, 1, 5],
  },
  {
    email: "zaynab.omer+seed-cass@gmail.com", handle: "cassmua",
    name: "Cass Moreau", role: "Makeup artist",
    area: "ByWard Market, Ottawa", rate: "$200 / day",
    disciplines: ["MUA", "Beauty"],
    bio: "Editorial and runway MUA. Clean skin, bold graphic looks, fast backstage hands.",
    work: [5, 2, 1, 4, 0, 3],
  },
];

const JOBS = [
  {
    poster: "ines.frames", title: "Photos of my baked goods for Instagram",
    kind: "client", roles: ["Photographer"], disciplines: ["Photo"],
    area: "The Glebe, Ottawa", budget: "$120 flat", daysOut: 5,
    brief: "Small home bakery — I need bright, appetising photos of about a dozen cakes and pastries for my Instagram and website. Half a day, my kitchen or a nearby café. Just one person.",
    responders: ["tundebailey"],
  },
  {
    poster: "tundebailey", title: "LinkedIn headshots — quick 30 min",
    kind: "client", roles: ["Photographer"], disciplines: ["Photo", "Portrait"],
    area: "Centretown, Ottawa", budget: "$80", daysOut: 8,
    brief: "Just need a few clean, professional headshots for LinkedIn. Natural light is great. Should be quick — 30 minutes tops.",
    responders: ["ines.frames"],
  },
  {
    poster: "maya.shoots", title: "BTS crew for a runway show",
    kind: "creative", roles: ["BTS Videographer", "Photographer", "MUA"],
    disciplines: ["Video", "BTS", "Photo", "MUA"],
    area: "Lansdowne, Ottawa", budget: "$200 / day", daysOut: 15,
    brief: "Bigger one — putting together a small crew for a runway show. Backstage energy, the getting-ready, the walk. A BTS videographer, a photographer, and an MUA. Loose, documentary feel.",
    responders: ["cassmua"],
  },
  {
    poster: "rowanlights", title: "Music video — 2nd shooter",
    kind: "creative", roles: ["2nd Shooter"], disciplines: ["Video"],
    area: "Vanier, Ottawa", budget: "$250 / day", daysOut: 3,
    brief: "One-day music video in a warehouse. I've got lighting and lead camera covered — need a confident second shooter who can work fast with limited kit.",
    responders: [],
  },
];

// Minimal 1-colour JPEG per swatch, generated with sharp-free canvas-free
// trick: a tiny pre-encoded gradient would need a canvas; instead upload
// simple solid-colour PNGs built by hand (raw deflate of a small bitmap).
import zlib from "node:zlib";
function pngSolid(hex, w = 800, h = 1000) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(w * 3, 0)]);
  for (let x = 0; x < w; x++) row.set([r, g, b], 1 + x * 3);
  const raw = Buffer.concat(Array(h).fill(row));
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const clients = new Map(); // handle -> { supabase, userId }

for (const persona of PERSONAS) {
  const supabase = createClient(URL_, KEY);
  let userId;
  const { data: up, error: upErr } = await supabase.auth.signUp({
    email: persona.email,
    password: PASSWORD,
  });
  if (upErr || !up.session) {
    const { data: inn, error: innErr } = await supabase.auth.signInWithPassword(
      { email: persona.email, password: PASSWORD },
    );
    if (innErr) { console.error(persona.handle, innErr.message); continue; }
    userId = inn.user.id;
  } else {
    userId = up.user.id;
  }
  clients.set(persona.handle, { supabase, userId });

  const { data: existing } = await supabase
    .from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!existing) {
    const { error } = await supabase.from("profiles").insert({
      id: userId, display_name: persona.name, handle: persona.handle,
      role_title: persona.role, bio: persona.bio, area: persona.area,
      rate: persona.rate, disciplines: persona.disciplines,
    });
    if (error) { console.error("profile", persona.handle, error.message); continue; }
  }

  const { count } = await supabase
    .from("portfolio_items")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", userId);
  if ((count ?? 0) === 0) {
    for (let i = 0; i < persona.work.length; i++) {
      const [c1] = SWATCHES[persona.work[i] % 6];
      const png = pngSolid(c1);
      const path = `${userId}/seed-${i}.png`;
      const { error: se } = await supabase.storage
        .from("portfolio")
        .upload(path, png, { contentType: "image/png", upsert: true });
      if (se) { console.error("storage", persona.handle, se.message); break; }
      const { data: { publicUrl } } = supabase.storage
        .from("portfolio").getPublicUrl(path);
      await supabase.from("portfolio_items").insert({
        profile_id: userId, image_url: publicUrl, sort_order: i,
      });
    }
  }
  console.log("✓ persona", persona.handle);
}

for (const job of JOBS) {
  const poster = clients.get(job.poster);
  if (!poster) continue;
  const { data: dup } = await poster.supabase
    .from("jobs").select("id").eq("title", job.title).maybeSingle();
  let jobId = dup?.id;
  if (!jobId) {
    const date = new Date(Date.now() + job.daysOut * 86400e3)
      .toISOString().slice(0, 10);
    const { data, error } = await poster.supabase.from("jobs").insert({
      poster_id: poster.userId, title: job.title, brief: job.brief,
      area: job.area, budget: job.budget, date, poster_kind: job.kind,
      roles: job.roles, disciplines: job.disciplines,
    }).select("id").single();
    if (error) { console.error("job", job.title, error.message); continue; }
    jobId = data.id;
  }
  for (const rh of job.responders) {
    const responder = clients.get(rh);
    if (!responder) continue;
    await responder.supabase.from("responses").insert({
      job_id: jobId, responder_id: responder.userId,
    });
  }
  console.log("✓ job", job.title);
}
console.log("Seed complete.");
