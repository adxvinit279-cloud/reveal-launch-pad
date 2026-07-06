import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — ProductReveal" },
      { name: "description", content: "ProductReveal is an editorial product discovery platform for AI tools, SaaS apps, templates, and startup launches. Learn about our mission, editorial process, and how we stay independent." },
      { property: "og:title", content: "About ProductReveal" },
      { property: "og:description", content: "How ProductReveal reviews, ranks and publishes new products — and why makers and readers trust us." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <PolicyPage eyebrow="About" title="A calmer place to discover new products" description="ProductReveal exists to help builders and readers cut through the noise of daily launches.">
      <p>ProductReveal is an editorial product discovery platform for AI tools, SaaS apps, WordPress and Shopify products, website templates, no-code builders, and everything in between. Every day, hundreds of new digital products launch across the internet. Most disappear within a week. Some quietly become the tools that thousands of people rely on. Our job is to help you tell the difference.</p>
      <p>We started ProductReveal because the daily launch feed had become exhausting. Founders were shipping strong products only to be buried under promotional noise, and readers were losing hours evaluating tools that turned out to be shallow or half-finished. We wanted a smaller, slower, more useful place — one where every listing is checked by a real editor and every review is written by someone who has actually tried the product.</p>
      <h2>Who ProductReveal helps</h2>
      <p>Our audience is people who build and buy digital tools for a living: indie founders, small SaaS teams, freelancers, community leaders, WordPress publishers, ecommerce operators and product-minded marketers. If you have ever spent a Saturday morning comparing three tools that all promise the same thing, ProductReveal is for you.</p>
      <h2>How products are selected</h2>
      <p>Every product that appears on ProductReveal has been submitted by a maker and reviewed by a member of our editorial team. Before publishing, we check that the product website is live, that pricing information is honest and complete, and that the description accurately reflects what the product does. When we can, we spend time inside the product — signing up, poking around, and forming a genuine opinion — before we approve a listing.</p>
      <p>We do not auto-publish. We do not sell placement in "trending" or "editor's picks". Sponsored placements, when they exist, are always labelled clearly.</p>
      <h2>Why you can trust the platform</h2>
      <p>Trust is earned in the small details. Our reviews are written in plain English and include the things you actually want to know: what the product is best for, what it does not do well, and how the pricing compares to alternatives. We link out to the maker's website using standard commercial link practices, and any affiliate relationships are disclosed on our <a href="/disclaimer">disclaimer</a> page. Reader reviews and upvotes are moderated to prevent astroturfing, and we remove listings that stop working or become misleading.</p>
      <h2>Editorial mission</h2>
      <p>Our editorial mission is simple: help builders and buyers make faster, better decisions about the digital tools they rely on. That means being honest when a product is early. Being generous when a small maker ships something genuinely useful. And being unafraid to remove a listing when the product no longer lives up to its claims.</p>
      <h2>Commitment to useful, original and unbiased discovery</h2>
      <p>We write our own descriptions. We do not republish marketing copy. We prefer boring, accurate reviews over hype. When a category is crowded, we would rather link you to the two products worth trying than to twenty products competing for attention. Over time, we hope that discipline earns your trust — and helps every maker who publishes with us reach the readers who genuinely need their work.</p>
    </PolicyPage>
  );
}