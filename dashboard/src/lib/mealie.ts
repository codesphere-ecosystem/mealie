const BASE_URL = process.env.MEALIE_BASE_URL;
const TOKEN = process.env.MEALIE_API_TOKEN;

if (!BASE_URL || !TOKEN) {
  throw new Error(
    "Missing MEALIE_BASE_URL or MEALIE_API_TOKEN in environment variables."
  );
}

async function mealieGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next: { revalidate: 60 }, // cache for 60s
  });

  if (!res.ok) {
    throw new Error(`Mealie API error ${res.status} on ${path}`);
  }

  return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface HouseholdStatistics {
  totalRecipes: number;
  totalUsers: number;
  totalCategories: number;
  totalTags: number;
  totalTools: number;
}

export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

export interface RecipeSummary {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  description: string | null;
  rating: number | null;
  dateAdded: string;
  lastMade: string | null;
}

export interface UserRatingSummary {
  recipeId: string;
  rating: number | null;
  isFavorite: boolean;
}

export interface UserRatings {
  ratings: UserRatingSummary[];
}

// ── API calls ────────────────────────────────────────────────────────────────

export function getHouseholdStats() {
  return mealieGet<HouseholdStatistics>("/households/statistics");
}

export function getRecentRecipes(count = 6) {
  return mealieGet<PaginatedResponse<RecipeSummary>>(
    `/recipes?perPage=${count}&page=1&orderBy=dateAdded&orderDirection=desc`
  );
}

export function getUserFavorites() {
  return mealieGet<PaginatedResponse<RecipeSummary>>(
    `/users/self/favorites?perPage=-1`
  );
}

export function getUserRatings() {
  return mealieGet<UserRatings>(`/users/self/ratings`);
}
