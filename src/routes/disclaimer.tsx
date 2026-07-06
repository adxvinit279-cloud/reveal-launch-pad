import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";
export const Route = createFileRoute("/disclaimer")({
  component: () => (
    <PolicyPage eyebrow="Legal" title="Disclaimer" description="Last updated: January 2026">
      <h2>Product information</h2>
      <p>Product information on ProductReveal is compiled from public sources and details supplied by makers. We strive for accuracy but cannot guarantee it — verify features, pricing and terms on the official product website before purchasing.</p>
      <h2>External links</h2>
      <p>Our site contains links to third-party websites. We are not responsible for the content, availability or practices of those sites.</p>
      <h2>Affiliate disclosure</h2>
      <p>Some links on ProductReveal are affiliate or referral links. If you click a link and make a purchase, we may earn a commission at no extra cost to you. These relationships never influence whether a product is listed or how it is described.</p>
      <h2>Reviews</h2>
      <p>Editorial reviews reflect the opinions of the writer at the time of publication. User reviews are moderated but represent individual opinions, not statements of fact.</p>
      <h2>No professional advice</h2>
      <p>Nothing on ProductReveal constitutes legal, financial, medical or professional advice. Consult a qualified professional before making decisions that require expertise.</p>
      <h2>Accuracy</h2>
      <p>Products, pricing and features change frequently. We update listings on a best-effort basis. If you spot outdated information, please contact us so we can correct it.</p>
    </PolicyPage>
  ),
  head: () => ({
    meta: [
      { title: "Disclaimer — ProductReveal" },
      { name: "description", content: "ProductReveal disclaimer: product information, external links, affiliate disclosure, reviews, and accuracy." },
      { property: "og:title", content: "Disclaimer — ProductReveal" },
      { property: "og:description", content: "Read the ProductReveal disclaimer covering product information, affiliates and accuracy." },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
});