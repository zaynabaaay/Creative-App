/** Role chips offered when posting a job (from the prototype, plus Editor/Hair). */
export const JOB_ROLES = [
  "Photographer",
  "Videographer",
  "BTS Videographer",
  "2nd Shooter",
  "MUA",
  "Hair",
  "Gaffer",
  "Stylist",
  "Editor",
] as const;

/** Map chosen roles to feed-filter disciplines (mirrors the prototype). */
export function disciplinesForRoles(roles: string[]): string[] {
  const set = new Set<string>();
  for (const r of roles) {
    if (r.includes("Video") || r.includes("Shooter")) set.add("Video");
    else if (r === "MUA" || r === "Hair") set.add("MUA");
    else if (r === "Gaffer") set.add("Lighting");
    else if (r === "Stylist") set.add("Styling");
    else if (r === "Editor") set.add("Editing");
    else set.add("Photo");
  }
  return [...set];
}

export type Job = {
  id: string;
  poster_id: string;
  title: string;
  brief: string;
  area: string;
  budget: string | null;
  date: string | null;
  poster_kind: "creative" | "client";
  roles: string[];
  disciplines: string[];
  status: "open" | "closed";
  created_at: string;
};
