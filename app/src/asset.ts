/** URL for a file in public/, so the app works when hosted under a sub-path (e.g. GitHub Pages). */
export const asset = (path: string) => import.meta.env.BASE_URL + path;
