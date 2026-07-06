import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";
export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy — ProductReveal" },
      { name: "description", content: "How ProductReveal reviews products, decides rankings, handles sponsored links, and maintains original, unbiased content." },
      { property: "og:title", content: "Editorial Policy — ProductReveal" },
      { property: "og:description", content: "Our editorial standards for product reviews, rankings, sponsorships and corrections." },
    ],
    links: [{ rel: "canonical", href: "/editorial-policy" }],
  }),
  component: () => (
    <PolicyPage eyebrow="Trust" title="Editorial Policy" description="How we review, rank and publish products.">
      <h2>How products are reviewed</h2>
      <p>Every product on ProductReveal is reviewed by a member of our editorial team before it appears on the site. We verify the product website is live, confirm the maker's identity where possible, and write our own product summary rather than republishing marketing copy.</p>
      <h2>How rankings are decided</h2>
      <p>Trending order combines community upvotes, recency, and editorial signals. "Editor's Picks" and "Featured" placements are chosen by our editors on merit — they are never sold.</p>
      <h2>Sponsored and affiliate links</h2>
      <p>Some listings and blog posts contain affiliate links. When we accept a sponsored placement, it is clearly labelled as "Sponsored". Affiliate relationships never affect whether a product is approved, how it is described, or its ranking.</p>
      <h2>Corrections</h2>
      <p>Spotted a mistake or outdated information? Email <a href="mailto:contact@productreveal.com">contact@productreveal.com</a> or use the "Report incorrect information" link on any product page. We investigate every report and correct genuine errors promptly.</p>
      <h2>Original content</h2>
      <p>ProductReveal publishes original descriptions, reviews and guides written by real editors. We do not scrape competing sites or republish AI-generated content without human editing and fact-checking.</p>
      <h2>No fake reviews</h2>
      <p>User reviews are moderated to detect duplicate, incentivised or otherwise fake reviews. Verified fake reviews are removed and repeat offenders lose the ability to post.</p>
    </PolicyPage>
  ),
});