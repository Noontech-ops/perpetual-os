import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/os/", "/dashboard/", "/onboarding/"],
    },
    sitemap: "https://perpetual-os-inoon.vercel.app/sitemap.xml",
  };
}
