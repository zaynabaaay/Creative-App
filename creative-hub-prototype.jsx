import React, { useState } from "react";
import {
  ChevronLeft, Search, Plus, MessageSquare, User, Camera,
  MapPin, Calendar, Users, Check, Instagram, Globe, Sparkles,
  Send, Heart, Inbox as InboxIcon, ArrowRight
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const t = {
  paper: "#FBFAF7", card: "#FFFFFF", ink: "#1A1917", muted: "#8B8680",
  faint: "#B4AFA6", line: "#EBE7DE", lineSoft: "#F2EEE6",
  accent: "#2743E8", accentSoft: "#EBEEFF", chip: "#F4F1EA",
};
const swatches = [
  ["#C98B7E", "#A5675C"], ["#8FA087", "#657A5F"], ["#C9A24B", "#9C7A2E"],
  ["#6B7A8F", "#4A5768"], ["#7E6E8F", "#5B4E6B"], ["#B5715A", "#8A5138"],
];
const grad = (i) => `linear-gradient(145deg, ${swatches[i % 6][0]}, ${swatches[i % 6][1]})`;
const font = `'Bricolage Grotesque', 'Inter', -apple-system, system-ui, sans-serif`;

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */
const CREATIVES = {
  maya: { id: "maya", name: "Maya Okonkwo", handle: "@maya.shoots", role: "BTS & documentary videographer", area: "East London", disciplines: ["Video", "BTS", "Doc"], rate: "£180–260 / day", workedWith: 14, vouched: 9, bio: "I shoot the in-between moments — the tension backstage, the laugh between takes. Handheld, natural, unposed.", work: [0, 3, 1, 4, 2, 5] },
  tunde: { id: "tunde", name: "Tunde Bailey", handle: "@tundebailey", role: "Editorial & fashion photographer", area: "Hackney", disciplines: ["Photo", "Fashion", "Editorial"], rate: "£300–500 / day", workedWith: 22, vouched: 15, bio: "Fashion and editorial, shot on film when the budget allows. I care about styling as much as light.", work: [2, 5, 0, 3, 4, 1] },
  ines: { id: "ines", name: "Inès Duarte", handle: "@ines.frames", role: "Portrait photographer — natural light", area: "Dalston", disciplines: ["Photo", "Portrait"], rate: "£250–350 / day", workedWith: 11, vouched: 8, bio: "Quiet, warm portraiture. I like windows, morning light, and letting people settle before I press the shutter.", work: [4, 1, 3, 0, 5, 2] },
  rowan: { id: "rowan", name: "Rowan Sethi", handle: "@rowanlights", role: "Gaffer & lighting", area: "Peckham", disciplines: ["Lighting", "Gaffer"], rate: "£220 / day", workedWith: 31, vouched: 19, bio: "Ten years lighting music videos and commercials. I make small crews look big-budget.", work: [3, 0, 4, 2, 1, 5] },
  cass: { id: "cass", name: "Cass Moreau", handle: "@cassmua", role: "Makeup artist", area: "Shoreditch", disciplines: ["MUA", "Beauty"], rate: "£200 / day", workedWith: 18, vouched: 12, bio: "Editorial and runway MUA. Clean skin, bold graphic looks, fast backstage hands.", work: [5, 2, 1, 4, 0, 3] },
};

const SEED_SHOOTS = [
  { id: "b1", title: "Photos of my baked goods for Instagram", posterName: "Rise & Crumb bakery", posterType: "Client", roles: ["Photographer"], disciplines: ["Photo", "Product"], area: "Dalston", budget: "£90 flat", date: "This wk", brief: "Small home bakery — I need bright, appetising photos of about a dozen cakes and pastries for my Instagram and website. Half a day, my kitchen or a nearby café. Just one person.", responders: ["ines", "tunde"] },
  { id: "b2", title: "LinkedIn headshots — quick 30 min", posterName: "Priya K.", posterType: "Client", roles: ["Photographer"], disciplines: ["Photo", "Portrait"], area: "Shoreditch", budget: "£60", date: "9 Jul", brief: "Just need a few clean, professional headshots for LinkedIn. Natural light is great. Should be quick — 30 minutes tops.", responders: ["ines"] },
  { id: "b3", title: "Film a 60-second reel for my café", posterName: "Ako — café owner", posterType: "Client", roles: ["Videographer"], disciplines: ["Video"], area: "Hackney", budget: "£130", date: "12 Jul", brief: "Looking for one person to shoot and edit a short, warm 60-second reel of the café — the space, the coffee, a bit of the morning buzz. One morning's work.", responders: [] },
  { id: "b4", title: "BTS crew for SS26 runway show", posterName: "Zara — show producer", posterType: "Creative", roles: ["BTS Videographer", "Photographer ×2", "MUA"], disciplines: ["Video", "BTS", "Photo", "MUA"], area: "East London", budget: "£180 / day", date: "20 Jun", brief: "Bigger one — putting together a small crew for a SS26 runway show. Backstage energy, the getting-ready, the walk. A BTS videographer, two photographers, and an MUA. Loose, documentary feel.", responders: ["maya", "cass"] },
  { id: "b5", title: "Music video — 2nd shooter + gaffer", posterName: "Deniz — director", posterType: "Creative", roles: ["2nd Shooter", "Gaffer"], disciplines: ["Video", "Lighting", "Gaffer"], area: "Peckham", budget: "£250 / day", date: "2 Jul", brief: "One-day music video in a warehouse. I've got the concept and lead camera — need a confident second shooter and a gaffer who can work fast with limited kit.", responders: ["rowan"] },
];

/* ------------------------------------------------------------------ */
/*  Small UI pieces                                                    */
/* ------------------------------------------------------------------ */
const Avatar = ({ seed = 0, size = 40, name = "" }) => (
  <div style={{ width: size, height: size, borderRadius: size, background: grad(seed), flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.36, fontFamily: font }}>{name ? name[0] : ""}</div>
);
const Chip = ({ children, active, onClick, small }) => (
  <button onClick={onClick} style={{ fontFamily: font, fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "5px 10px" : "7px 14px", borderRadius: 100, border: `1px solid ${active ? t.accent : t.line}`, background: active ? t.accent : t.card, color: active ? "#fff" : t.ink, whiteSpace: "nowrap", cursor: "pointer", transition: "all .15s" }}>{children}</button>
);
const WorkGrid = ({ work }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
    {work.map((w, i) => <div key={i} style={{ aspectRatio: "1", background: grad(w), borderRadius: i === 0 ? "10px 0 0 0" : i === 2 ? "0 10px 0 0" : 0 }} />)}
  </div>
);
const Segmented = ({ options, value, onChange }) => (
  <div style={{ display: "flex", background: t.chip, borderRadius: 12, padding: 4, gap: 4 }}>
    {options.map(o => {
      const active = value === o.id;
      return (
        <button key={o.id} onClick={() => onChange(o.id)} style={{ flex: 1, fontFamily: font, fontSize: 14, fontWeight: 700, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", background: active ? t.card : "transparent", color: active ? t.ink : t.muted, boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all .15s" }}>{o.label}</button>
      );
    })}
  </div>
);
const EmptyState = ({ icon: Icon, title, body, cta, onCta }) => (
  <div style={{ textAlign: "center", padding: "48px 28px", fontFamily: font }}>
    <div style={{ width: 60, height: 60, borderRadius: 100, background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
      <Icon size={26} color={t.accent} />
    </div>
    <h3 style={{ fontSize: 19, fontWeight: 800, color: t.ink, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{title}</h3>
    <p style={{ fontSize: 14.5, color: t.muted, lineHeight: 1.5, margin: "0 0 20px" }}>{body}</p>
    {cta && <button onClick={onCta} style={{ fontFamily: font, fontSize: 15, fontWeight: 700, padding: "12px 22px", borderRadius: 12, border: "none", background: t.accent, color: "#fff", cursor: "pointer" }}>{cta}</button>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Preview banner — a clearly-labelled dev tool, not product          */
/* ------------------------------------------------------------------ */
const PreviewBar = ({ preview, setPreview }) => (
  <div style={{ margin: "0 20px 14px", border: `1px dashed ${t.faint}`, borderRadius: 12, padding: "8px 10px 10px", background: "rgba(180,175,166,0.06)" }}>
    <div style={{ fontFamily: font, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.faint, margin: "0 2px 7px" }}>Preview · how it looks when…</div>
    <Segmented options={[{ id: "dayone", label: "Day one" }, { id: "thriving", label: "Thriving" }]} value={preview} onChange={setPreview} />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Screens                                                            */
/* ------------------------------------------------------------------ */
function ShootsFeed({ shoots, filter, setFilter, open, goPost }) {
  const filters = ["All", "Video", "Photo", "MUA", "Lighting"];
  const list = filter === "All" ? shoots : shoots.filter(s => s.disciplines.includes(filter));
  return (
    <div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontFamily: font, fontSize: 13, color: t.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <MapPin size={13} /> East London · within 5 mi
        </div>
        <p style={{ fontFamily: font, fontSize: 14, color: t.muted, margin: "0 0 12px" }}>
          {list.length === 0 ? "Nothing open here yet" : `${list.length} job${list.length === 1 ? "" : "s"} open — from single gigs to full crews`}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 20px 14px", scrollbarWidth: "none" }}>
        {filters.map(f => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={Camera} title="No open jobs in your area" body="This is exactly how day one feels — empty. The fix isn't more browsing, it's the first few real jobs. Post one — whether you need a single photographer or a whole crew — and creatives start showing up." cta="Post the first job" onCta={goPost} />
      ) : (
        <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((s) => (
            <button key={s.id} onClick={() => open(s.id)} style={{ textAlign: "left", background: t.card, border: `1px solid ${t.line}`, borderRadius: 18, padding: 16, cursor: "pointer", fontFamily: font }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: s.posterType === "Client" ? "#9C7A2E" : t.accent, background: s.posterType === "Client" ? "#FBF3DD" : t.accentSoft, padding: "3px 8px", borderRadius: 6 }}>{s.posterType} posting</span>
                <span style={{ fontSize: 12, color: t.faint, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}><Calendar size={12} /> {s.date}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", margin: "10px 0 8px", color: t.ink, lineHeight: 1.2 }}>{s.title}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {s.roles.map(r => <span key={r} style={{ fontSize: 12, fontWeight: 600, color: t.ink, background: t.chip, padding: "4px 9px", borderRadius: 7 }}>{r}</span>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${t.lineSoft}`, paddingTop: 11 }}>
                <span style={{ fontSize: 13, color: t.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} /> {s.area} · {s.budget}</span>
                <span style={{ fontSize: 13, color: s.responders.length ? t.accent : t.faint, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}><Users size={13} /> {s.responders.length}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function YourShoots({ shoots, open, goPost }) {
  return (
    <div>
      <p style={{ fontFamily: font, fontSize: 14, color: t.muted, margin: "0 20px 14px" }}>
        {shoots.length === 0 ? "You haven't posted anything yet" : `${shoots.length} job${shoots.length === 1 ? "" : "s"} you've posted`}
      </p>
      {shoots.length === 0 ? (
        <EmptyState icon={Plus} title="Post your first job" body="Tell people what you need — one photographer for your baked goods, or a whole crew for a shoot. The right creatives respond and you review them here." cta="Post a job" onCta={goPost} />
      ) : (
        <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
          {shoots.map(s => (
            <button key={s.id} onClick={() => open(s.id)} style={{ textAlign: "left", background: t.card, border: `1px solid ${t.line}`, borderRadius: 18, padding: 16, cursor: "pointer", fontFamily: font }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px", color: t.ink, lineHeight: 1.2 }}>{s.title}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {s.roles.map(r => <span key={r} style={{ fontSize: 12, fontWeight: 600, color: t.ink, background: t.chip, padding: "4px 9px", borderRadius: 7 }}>{r}</span>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${t.lineSoft}`, paddingTop: 11 }}>
                <span style={{ fontSize: 13, color: t.muted, fontWeight: 600 }}>{s.area} · {s.budget}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.responders.length ? t.accent : t.faint, display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={13} /> {s.responders.length ? `${s.responders.length} responded` : "Waiting…"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShootDetail({ shoot, openCreative, respond, responded, mine }) {
  return (
    <div style={{ padding: "4px 20px 20px" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: shoot.posterType === "Client" ? "#9C7A2E" : t.accent, background: shoot.posterType === "Client" ? "#FBF3DD" : t.accentSoft, padding: "3px 8px", borderRadius: 6, fontFamily: font }}>{mine ? "Your posting" : shoot.posterType + " posting"}</span>
      <h1 style={{ fontFamily: font, fontSize: 25, fontWeight: 800, letterSpacing: "-0.02em", margin: "12px 0 6px", color: t.ink, lineHeight: 1.12 }}>{shoot.title}</h1>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontFamily: font, fontSize: 13, color: t.muted, fontWeight: 600, marginBottom: 16 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} /> {shoot.area}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={13} /> {shoot.date}</span>
        <span style={{ color: t.ink }}>{shoot.budget}</span>
      </div>
      <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: t.faint, marginBottom: 8 }}>Roles needed</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        {shoot.roles.map(r => <span key={r} style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: t.ink, background: t.chip, padding: "6px 12px", borderRadius: 8 }}>{r}</span>)}
      </div>
      <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: t.faint, marginBottom: 8 }}>The brief</div>
      <p style={{ fontFamily: font, fontSize: 15, lineHeight: 1.55, color: t.ink, margin: "0 0 24px" }}>{shoot.brief}</p>
      <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: t.faint, marginBottom: 10 }}>{shoot.responders.length} responded</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {shoot.responders.map((cid, i) => {
          const c = CREATIVES[cid] || { name: "You", role: "Videographer" };
          return (
            <button key={cid + i} onClick={() => cid !== "me" && openCreative(cid)} style={{ display: "flex", alignItems: "center", gap: 12, background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: 12, cursor: cid === "me" ? "default" : "pointer", fontFamily: font, textAlign: "left" }}>
              <Avatar seed={i} name={c.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{cid === "me" ? "You" : c.name}</div>
                <div style={{ fontSize: 12, color: t.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.role}</div>
              </div>
              {cid !== "me" && <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>View →</span>}
            </button>
          );
        })}
        {shoot.responders.length === 0 && (
          <div style={{ fontFamily: font, fontSize: 14, color: t.muted, background: t.card, border: `1px dashed ${t.line}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
            {mine ? "No responses yet. Share the link to your scene to get the first ones in." : "No responses yet — be the first."}
          </div>
        )}
      </div>
      {!mine && (
        <>
          <button onClick={respond} disabled={responded} style={{ width: "100%", fontFamily: font, fontSize: 16, fontWeight: 700, padding: "15px", borderRadius: 14, border: "none", cursor: responded ? "default" : "pointer", background: responded ? "#E8F3EC" : t.accent, color: responded ? "#2E7D48" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {responded ? <><Check size={18} /> You responded — profile shared</> : <><Sparkles size={17} /> Respond to this job</>}
          </button>
          {!responded && <p style={{ fontFamily: font, fontSize: 12.5, color: t.faint, textAlign: "center", margin: "10px 0 0", lineHeight: 1.4 }}>Responding shares your portfolio with {shoot.posterName.split(" ")[0]}.</p>}
        </>
      )}
    </div>
  );
}

function Portfolio({ c, message }) {
  const isNew = c.workedWith === 0;
  return (
    <div>
      <WorkGrid work={c.work} />
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: font, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: t.ink }}>{c.name}</h1>
            <div style={{ fontFamily: font, fontSize: 14, color: t.muted, marginTop: 2 }}>{c.handle}</div>
          </div>
          <Avatar seed={0} size={52} name={c.name} />
        </div>
        <p style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: t.ink, margin: "12px 0 4px" }}>{c.role}</p>
        <div style={{ fontFamily: font, fontSize: 13.5, color: t.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}><MapPin size={13} /> {c.area} · {c.rate}</div>
        <p style={{ fontFamily: font, fontSize: 15, lineHeight: 1.55, color: t.ink, margin: "0 0 18px" }}>{c.bio}</p>
        {isNew ? (
          <div style={{ background: t.accentSoft, borderRadius: 14, padding: "14px 16px", marginBottom: 18, fontFamily: font }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>New here</div>
            <div style={{ fontSize: 13.5, color: t.ink, lineHeight: 1.5, opacity: 0.85 }}>No collabs on the app yet. Be their first — it's how track records start.</div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: t.ink }}>{c.workedWith}</div>
              <div style={{ fontFamily: font, fontSize: 12, color: t.muted, fontWeight: 600 }}>collabs on here</div>
            </div>
            <div style={{ flex: 1, background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: t.accent, display: "flex", alignItems: "center", gap: 4 }}><Heart size={16} fill={t.accent} /> {c.vouched}</div>
              <div style={{ fontFamily: font, fontSize: 12, color: t.muted, fontWeight: 600 }}>vouched by</div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
          {c.disciplines.map(d => <span key={d} style={{ fontFamily: font, fontSize: 12.5, fontWeight: 600, color: t.ink, background: t.chip, padding: "5px 11px", borderRadius: 7 }}>{d}</span>)}
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 22 }}>
          <span style={{ fontFamily: font, fontSize: 13.5, color: t.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Instagram size={15} /> Instagram</span>
          <span style={{ fontFamily: font, fontSize: 13.5, color: t.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Globe size={15} /> Website</span>
        </div>
        <button onClick={message} style={{ width: "100%", fontFamily: font, fontSize: 16, fontWeight: 700, padding: "15px", borderRadius: 14, border: "none", cursor: "pointer", background: t.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <MessageSquare size={17} /> Message {c.name.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

function Chat({ c, shootTitle, thread, send }) {
  const [text, setText] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ background: t.accentSoft, borderRadius: 14, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: grad(c.work[0]), flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            {shootTitle && <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: t.accent, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Re: {shootTitle}</div>}
            <div style={{ fontFamily: font, fontSize: 13, color: t.ink, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {c.role}{c.workedWith > 0 ? ` · ${c.workedWith} collabs · vouched ${c.vouched}×` : " · new here"}
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {thread.length === 0 && <div style={{ fontFamily: font, fontSize: 13.5, color: t.faint, textAlign: "center", padding: "20px 10px", lineHeight: 1.5 }}>Say hello. A good first message says which shoot and what you're offering.</div>}
        {thread.map((m, i) => (
          <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "78%" }}>
            <div style={{ fontFamily: font, fontSize: 14.5, lineHeight: 1.4, padding: "10px 14px", borderRadius: m.me ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.me ? t.accent : t.card, color: m.me ? "#fff" : t.ink, border: m.me ? "none" : `1px solid ${t.line}` }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${t.line}`, display: "flex", gap: 8, alignItems: "center", background: t.paper }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && text.trim()) { send(text); setText(""); } }} placeholder={`Message ${c.name.split(" ")[0]}…`} style={{ flex: 1, fontFamily: font, fontSize: 14.5, padding: "12px 14px", borderRadius: 100, border: `1px solid ${t.line}`, outline: "none", background: t.card, color: t.ink }} />
        <button onClick={() => { if (text.trim()) { send(text); setText(""); } }} style={{ width: 44, height: 44, borderRadius: 100, border: "none", background: t.accent, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Send size={18} /></button>
      </div>
    </div>
  );
}

function FindCreatives({ creatives, openCreative }) {
  const [q, setQ] = useState("");
  const [disc, setDisc] = useState("All");
  const discs = ["All", "Photo", "Video", "MUA", "Lighting"];
  const list = Object.values(creatives).filter(c => (disc === "All" || c.disciplines.includes(disc)) && (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.role.toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.card, border: `1px solid ${t.line}`, borderRadius: 100, padding: "11px 16px", marginBottom: 12 }}>
        <Search size={18} color={t.muted} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, role, city…" style={{ flex: 1, border: "none", outline: "none", fontFamily: font, fontSize: 15, background: "transparent", color: t.ink }} />
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
        {discs.map(d => <Chip key={d} active={disc === d} onClick={() => setDisc(d)}>{d}</Chip>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((c, i) => (
          <button key={c.id} onClick={() => openCreative(c.id)} style={{ display: "flex", gap: 12, background: t.card, border: `1px solid ${t.line}`, borderRadius: 16, padding: 12, cursor: "pointer", fontFamily: font, textAlign: "left", alignItems: "center" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, width: 52, height: 52, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
              {c.work.slice(0, 4).map((w, k) => <div key={k} style={{ background: grad(w) }} />)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: t.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.role}</div>
              <div style={{ fontSize: 12, color: t.accent, fontWeight: 600, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={11} /> {c.area}{c.workedWith > 0 ? ` · ${c.workedWith} collabs` : " · new here"}
              </div>
            </div>
          </button>
        ))}
        {list.length === 0 && <div style={{ fontFamily: font, fontSize: 14, color: t.muted, textAlign: "center", padding: 24 }}>No one matches yet. Try a different filter.</div>}
      </div>
    </div>
  );
}

function PostShoot({ onPost }) {
  const [title, setTitle] = useState(""); const [roles, setRoles] = useState([]);
  const [area, setArea] = useState(""); const [budget, setBudget] = useState("");
  const roleOptions = ["Photographer", "Videographer", "BTS Videographer", "2nd Shooter", "MUA", "Gaffer", "Stylist"];
  const toggle = (r) => setRoles(roles.includes(r) ? roles.filter(x => x !== r) : [...roles, r]);
  const ready = title.trim() && roles.length && area.trim();
  const field = { fontFamily: font, fontSize: 15, padding: "13px 15px", borderRadius: 13, border: `1px solid ${t.line}`, outline: "none", background: t.card, color: t.ink, width: "100%", boxSizing: "border-box" };
  const label = { fontFamily: font, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: t.faint, margin: "18px 0 8px" };
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <p style={{ fontFamily: font, fontSize: 14, color: t.muted, margin: "0 0 4px" }}>One person or a whole crew — the right creatives come to you.</p>
      <div style={label}>What do you need?</div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Photos of my baked goods for Instagram" style={field} />
      <div style={label}>Who do you need? <span style={{ textTransform: "none", color: t.faint, fontWeight: 500 }}>(pick one, or more for a crew)</span></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{roleOptions.map(r => <Chip key={r} active={roles.includes(r)} onClick={() => toggle(r)} small>{r}</Chip>)}</div>
      <div style={label}>Area</div>
      <input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. East London" style={field} />
      <div style={label}>Budget <span style={{ textTransform: "none", color: t.faint, fontWeight: 500 }}>(optional)</span></div>
      <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. £200 / day" style={field} />
      <button onClick={() => ready && onPost({ title, roles, area, budget: budget || "Budget TBC" })} disabled={!ready} style={{ width: "100%", marginTop: 26, fontFamily: font, fontSize: 16, fontWeight: 700, padding: "15px", borderRadius: 14, border: "none", cursor: ready ? "pointer" : "default", background: ready ? t.accent : t.chip, color: ready ? "#fff" : t.faint }}>Post shoot</button>
    </div>
  );
}

function Profile({ preview }) {
  const me = { name: "You", role: "Videographer", area: "East London", work: [1, 4, 2, 0, 5, 3] };
  const thriving = preview === "thriving";
  return (
    <div>
      <WorkGrid work={me.work} />
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontFamily: font, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: t.ink }}>Your portfolio</h1>
            <div style={{ fontFamily: font, fontSize: 14, color: t.muted, marginTop: 2 }}>{me.role} · {me.area}</div>
          </div>
          <Avatar seed={1} size={52} name="Y" />
        </div>
        <div style={{ background: t.accentSoft, borderRadius: 14, padding: 14, margin: "18px 0", fontFamily: font }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.ink, display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><Sparkles size={16} color={t.accent} /> This is your entry ticket</div>
          <div style={{ fontSize: 13.5, color: t.ink, lineHeight: 1.5, opacity: 0.85 }}>Every time you respond to a shoot, this profile gets shared. The more you collaborate, the more it shows.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: "12px 14px" }}>
            <div style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: t.ink }}>{thriving ? 3 : 0}</div>
            <div style={{ fontFamily: font, fontSize: 12, color: t.muted, fontWeight: 600 }}>collabs on here</div>
          </div>
          <div style={{ flex: 1, background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: "12px 14px" }}>
            <div style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: t.accent }}>{thriving ? 2 : 0}</div>
            <div style={{ fontFamily: font, fontSize: 12, color: t.muted, fontWeight: 600 }}>vouched by</div>
          </div>
        </div>
        {!thriving && <p style={{ fontFamily: font, fontSize: 13, color: t.faint, textAlign: "center", margin: "14px 0 0", lineHeight: 1.5 }}>Day one, everyone starts at zero — including you. Respond to your first shoot to get moving.</p>}
      </div>
    </div>
  );
}

function Inbox({ creatives, threads, openChat }) {
  const ids = Object.keys(threads);
  return (
    <div style={{ padding: "0 20px 20px" }}>
      {ids.length === 0 ? (
        <EmptyState icon={InboxIcon} title="No messages yet" body="Open a portfolio and reach out, or respond to a shoot. Conversations you start show up here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ids.map((id, i) => {
            const c = creatives[id]; if (!c) return null;
            const last = threads[id][threads[id].length - 1];
            return (
              <button key={id} onClick={() => openChat(id)} style={{ display: "flex", gap: 12, background: t.card, border: `1px solid ${t.line}`, borderRadius: 16, padding: 13, cursor: "pointer", fontFamily: font, textAlign: "left", alignItems: "center" }}>
                <Avatar seed={i} name={c.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: t.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{last ? (last.me ? "You: " : "") + last.text : "Say hello"}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App shell                                                          */
/* ------------------------------------------------------------------ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [mode, setMode] = useState("working");     // working | hiring
  const [preview, setPreview] = useState("thriving");
  const [stack, setStack] = useState([]);
  const [filter, setFilter] = useState("All");
  const [shoots, setShoots] = useState(SEED_SHOOTS);
  const [responded, setResponded] = useState({});
  const [threads, setThreads] = useState({
    maya: [
      { me: false, text: "Hey! Saw you're producing the SS26 show — I'd love to shoot the BTS. Backstage is my favourite thing to film." },
      { me: true, text: "Amazing, your reel is exactly the feel we want. Are you free the 20th?" },
    ],
  });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const push = (screen, params) => setStack([...stack, { screen, params }]);
  const pop = () => setStack(stack.slice(0, -1));
  const top = stack[stack.length - 1];

  /* preview-aware views */
  const dayone = preview === "dayone";
  const viewCreative = (c) => dayone && c ? { ...c, workedWith: 0, vouched: 0 } : c;
  const creativesView = Object.fromEntries(Object.entries(CREATIVES).map(([k, v]) => [k, viewCreative(v)]));

  const feedShoots = (dayone ? shoots.filter(s => s.posterName === "You" || ["b1", "b3"].includes(s.id)) : shoots)
    .map(s => dayone ? { ...s, responders: s.responders.filter(r => r === "me") } : s);
  const myShoots = shoots.filter(s => s.posterName === "You");

  const openShoot = (id) => push("shoot", { id });
  const openCreative = (id, shootTitle) => push("creative", { id, shootTitle });
  const openChat = (id, shootTitle) => { if (!threads[id]) setThreads({ ...threads, [id]: [] }); push("chat", { id, shootTitle }); };

  const respondToShoot = (id, title) => {
    setResponded({ ...responded, [id]: true });
    setShoots(shoots.map(s => s.id === id && !s.responders.includes("me") ? { ...s, responders: [...s.responders, "me"] } : s));
    showToast("Response sent · your portfolio was shared");
  };
  const sendMsg = (cid, text) => setThreads({ ...threads, [cid]: [...(threads[cid] || []), { me: true, text }] });
  const postShoot = (data) => {
    const disc = data.roles.map(r => r.includes("Video") || r.includes("Shooter") ? "Video" : r.includes("MUA") ? "MUA" : r.includes("Gaffer") ? "Lighting" : "Photo");
    const s = { id: "new" + Date.now(), title: data.title, posterName: "You", posterType: "Creative", roles: data.roles, disciplines: disc, area: data.area, budget: data.budget, date: "Soon", brief: "Just posted — creatives will start responding here.", responders: [] };
    setShoots([s, ...shoots]); setTab("home"); setMode("hiring"); setStack([]);
    showToast("Job posted · creatives can respond now");
  };

  const goTab = (id) => { setTab(id); setStack([]); };

  /* header title for detail screens */
  const detailTitle = top ? ({ shoot: "Shoot", creative: "Portfolio", chat: (creativesView[top.params.id] || {}).name || "Chat" })[top.screen] : "";

  /* body */
  let body;
  if (top) {
    if (top.screen === "shoot") {
      const s = feedShoots.find(x => x.id === top.params.id) || shoots.find(x => x.id === top.params.id);
      body = <ShootDetail shoot={s} mine={s.posterName === "You"} openCreative={(cid) => openCreative(cid, s.title)} respond={() => respondToShoot(s.id, s.title)} responded={!!responded[s.id]} />;
    } else if (top.screen === "creative") {
      body = <Portfolio c={creativesView[top.params.id]} message={() => openChat(top.params.id, top.params.shootTitle)} />;
    } else if (top.screen === "chat") {
      body = <Chat c={creativesView[top.params.id]} shootTitle={top.params.shootTitle} thread={threads[top.params.id] || []} send={(txt) => sendMsg(top.params.id, txt)} />;
    }
  } else if (tab === "home") {
    body = (
      <div>
        <div style={{ padding: "6px 20px 14px" }}>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px", color: t.ink }}>{mode === "working" ? "Find work" : "Your jobs"}</h1>
          <Segmented options={[{ id: "working", label: "I'm working" }, { id: "hiring", label: "I'm hiring" }]} value={mode} onChange={setMode} />
        </div>
        <PreviewBar preview={preview} setPreview={setPreview} />
        {mode === "working"
          ? <ShootsFeed shoots={feedShoots} filter={filter} setFilter={setFilter} open={openShoot} goPost={() => goTab("post")} />
          : <YourShoots shoots={myShoots} open={openShoot} goPost={() => goTab("post")} />}
      </div>
    );
  } else if (tab === "find") {
    body = <div><div style={{ padding: "6px 20px 6px" }}><h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: t.ink }}>Find creatives</h1></div><PreviewBar preview={preview} setPreview={setPreview} /><FindCreatives creatives={creativesView} openCreative={(id) => openCreative(id)} /></div>;
  } else if (tab === "post") {
    body = <div><div style={{ padding: "6px 20px 6px" }}><h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: t.ink }}>Post a job</h1></div><PostShoot onPost={postShoot} /></div>;
  } else if (tab === "messages") {
    body = <div><div style={{ padding: "6px 20px 12px" }}><h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: t.ink }}>Inbox</h1></div><Inbox creatives={creativesView} threads={threads} openChat={(id) => openChat(id)} /></div>;
  } else if (tab === "profile") {
    body = <Profile preview={preview} />;
  }

  const showHeader = !!top;
  const tabs = [
    { id: "home", icon: Camera, label: "Home" },
    { id: "find", icon: Search, label: "Find" },
    { id: "post", icon: Plus, label: "Post" },
    { id: "messages", icon: MessageSquare, label: "Inbox" },
    { id: "profile", icon: User, label: "You" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#EDEAE3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400..700&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button:active { transform: scale(0.985); }
      `}</style>
      <div style={{ width: "100%", maxWidth: 400, height: "100dvh", maxHeight: 880, background: t.paper, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.22)" }}>
        <div style={{ height: showHeader ? 52 : 14, flexShrink: 0, display: "flex", alignItems: "center", padding: showHeader ? "0 8px" : 0, borderBottom: showHeader ? `1px solid ${t.line}` : "none", background: t.paper, position: "relative", zIndex: 5 }}>
          {showHeader && (
            <>
              <button onClick={pop} style={{ width: 40, height: 40, borderRadius: 100, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={24} color={t.ink} /></button>
              <div style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: t.ink }}>{detailTitle}</div>
            </>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>{body}</div>
        {toast && (
          <div style={{ position: "absolute", bottom: 84, left: 16, right: 16, background: t.ink, color: "#fff", fontFamily: font, fontSize: 13.5, fontWeight: 600, padding: "13px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 9, zIndex: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
            <Check size={17} color="#7BE49A" /> {toast}
          </div>
        )}
        <div style={{ height: 66, flexShrink: 0, borderTop: `1px solid ${t.line}`, background: t.paper, display: "flex", alignItems: "stretch" }}>
          {tabs.map(tb => {
            const active = tab === tb.id && !top;
            if (tb.id === "post") return (
              <button key={tb.id} onClick={() => goTab(tb.id)} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 42, height: 42, borderRadius: 100, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={22} color="#fff" /></div>
              </button>
            );
            return (
              <button key={tb.id} onClick={() => goTab(tb.id)} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                <tb.icon size={22} color={active ? t.ink : t.faint} strokeWidth={active ? 2.4 : 2} />
                <span style={{ fontFamily: font, fontSize: 10.5, fontWeight: 600, color: active ? t.ink : t.faint }}>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
