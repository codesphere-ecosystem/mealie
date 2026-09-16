import {
  getHouseholdStats,
  getRecentRecipes,
  getUserFavorites,
  getUserRatings,
} from "@/lib/mealie";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-6 flex items-center gap-4">
      <span className="text-4xl" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-neutral-400 text-sm">—</span>;
  return (
    <span className="text-yellow-400 text-sm" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

export default async function DashboardPage() {
  const [stats, recentRes, favoritesRes, ratingsRes] = await Promise.all([
    getHouseholdStats(),
    getRecentRecipes(6),
    getUserFavorites(),
    getUserRatings(),
  ]);

  const ratingMap = new Map(
    ratingsRes.ratings.map((r) => [r.recipeId, r.rating])
  );

  const baseUrl = process.env.MEALIE_PUBLIC_URL ?? process.env.MEALIE_BASE_URL ?? "";

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900 px-6 py-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">
          🍽️ Mealie Dashboard
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          A quick overview of your recipe collection
        </p>
      </header>

      <section aria-labelledby="stats-heading" className="mb-10">
        <h2
          id="stats-heading"
          className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4"
        >
          Household stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Recipes" value={stats.totalRecipes} icon="📖" />
          <StatCard label="Categories" value={stats.totalCategories} icon="🏷️" />
          <StatCard label="Tags" value={stats.totalTags} icon="🔖" />
          <StatCard label="Tools" value={stats.totalTools} icon="🔧" />
          <StatCard label="Favorites" value={favoritesRes.total ?? 0} icon="❤️" />
        </div>
      </section>

      <section aria-labelledby="ratings-heading" className="mb-10">
        <h2
          id="ratings-heading"
          className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4"
        >
          Your ratings
        </h2>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow px-6 py-4 flex gap-8 flex-wrap">
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {ratingsRes.ratings.length}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Recipes rated
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {ratingsRes.ratings.filter((r) => r.isFavorite).length}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Marked favourite
            </p>
          </div>
          {ratingsRes.ratings.filter((r) => r.rating !== null).length > 0 && (
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {(
                  ratingsRes.ratings
                    .filter((r) => r.rating !== null)
                    .reduce((sum, r) => sum + (r.rating ?? 0), 0) /
                  ratingsRes.ratings.filter((r) => r.rating !== null).length
                ).toFixed(1)}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Avg. rating
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="recent-heading">
        <h2
          id="recent-heading"
          className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4"
        >
          Recently added
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(recentRes.items ?? []).map((recipe) => (
            <a
              key={recipe.id}
              href={`${baseUrl}/g/home/r/${recipe.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {recipe.image ? (
                <div className="relative w-full h-36 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/dashboard/api/recipe-image/${recipe.id}`}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-36 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-4xl">
                  🍴
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                  {recipe.name}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <StarRating rating={ratingMap.get(recipe.id) ?? null} />
                  <span className="text-xs text-neutral-400">
                    {new Date(recipe.dateAdded).toLocaleDateString()}
                  </span>
                </div>
                {recipe.description && (
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
