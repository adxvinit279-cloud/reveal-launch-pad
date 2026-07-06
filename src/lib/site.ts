export const SITE = {
  name: "ProductReveal",
  tagline: "Discover the best new digital products before everyone else.",
  description:
    "ProductReveal helps you discover the best new AI tools, SaaS apps, templates, plugins, and digital products launched by makers around the world.",
  email: "contact@productreveal.com",
} as const;

export const NAV_LINKS = [
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/blog", label: "Blog" },
  { to: "/submit", label: "Submit Product" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  Explore: [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/categories", label: "Categories" },
    { to: "/blog", label: "Blog" },
  ],
  Company: [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/advertise", label: "Advertise" },
    { to: "/write-for-us", label: "Write for Us" },
  ],
  Trust: [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-and-conditions", label: "Terms & Conditions" },
    { to: "/disclaimer", label: "Disclaimer" },
    { to: "/editorial-policy", label: "Editorial Policy" },
    { to: "/sitemap", label: "Sitemap" },
  ],
} as const;

export function pricingLabel(p: string): string {
  return (
    { free: "Free", freemium: "Freemium", paid: "Paid", free_trial: "Free Trial" } as Record<string, string>
  )[p] ?? p;
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}