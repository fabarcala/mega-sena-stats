import { MetadataRoute } from "next";

const BASE_URL = "https://mega-sena-stats.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/frequencia", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/mais-sorteados", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/atrasados", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/faixas", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/pares-impares", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/somatorio", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/consecutivos", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/sorteios", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/curiosidades", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/sugerir-numeros", priority: 0.9, changeFrequency: "monthly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
