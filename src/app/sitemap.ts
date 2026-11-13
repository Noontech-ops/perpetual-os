import type { MetadataRoute } from 'next';
import { marketplaceOrgs } from '@/lib/mock-marketplace';

const BASE = 'https://perpetual-os-inoon.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/outcomes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/os`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/outcomes/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  const orgPages: MetadataRoute.Sitemap = marketplaceOrgs.map((org) => ({
    url: `${BASE}/outcomes/org/${org.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...orgPages];
}
