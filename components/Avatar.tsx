/* Deterministic warm gradients (from the prototype) used when a profile has
   no avatar image yet — the initial on a colour, never a grey silhouette. */
const SWATCHES = [
  ["#C98B7E", "#A5675C"],
  ["#8FA087", "#657A5F"],
  ["#C9A24B", "#9C7A2E"],
  ["#6B7A8F", "#4A5768"],
  ["#7E6E8F", "#5B4E6B"],
  ["#B5715A", "#8A5138"],
] as const;

function gradientFor(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b] = SWATCHES[h % SWATCHES.length];
  return `linear-gradient(145deg, ${a}, ${b})`;
}

export function AvatarCircle({
  name,
  seed,
  imageUrl,
  size = 40,
}: {
  name: string;
  seed: string;
  imageUrl?: string | null;
  size?: number;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="rounded-full shrink-0 flex items-center justify-center text-white font-display font-bold"
      style={{
        width: size,
        height: size,
        background: gradientFor(seed),
        fontSize: size * 0.36,
      }}
    >
      {name ? name[0].toUpperCase() : ""}
    </div>
  );
}
