export type Profile = {
  id: string;
  display_name: string;
  handle: string;
  role_title: string;
  bio: string;
  area: string;
  rate: string;
  disciplines: string[];
  avatar_url: string | null;
  is_available: boolean;
};

export type PortfolioItem = {
  id: string;
  profile_id: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

export type ProfileStats = {
  collabs_count: number;
  vouches_count: number;
};

/** Core disciplines shown as toggle chips when editing a profile. */
export const DISCIPLINES = [
  "Photo",
  "Video",
  "MUA",
  "Hair",
  "Styling",
  "Lighting",
  "Gaffer",
  "Editing",
  "Retouching",
  "BTS",
  "Portrait",
  "Product",
  "Fashion",
  "Events",
  "Doc",
] as const;
