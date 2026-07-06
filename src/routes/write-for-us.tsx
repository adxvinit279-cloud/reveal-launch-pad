import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";
export const Route = createFileRoute("/write-for-us")({
  head: () => ({
    meta: [
      { title: "Write for ProductReveal — Guest post guidelines" },
      { name: "description", content: "Pitch original guides, product roundups and comparisons to ProductReveal. Read our guest post guidelines and editorial process." },
      { property: "og:title", content: "Write for ProductReveal" },
      { property: "og:description", content: "Guest post guidelines for ProductReveal contributors." },
    ],
    links: [{ rel: "canonical", href: "/write-for-us" }],
  }),
  component: () => (
    <PolicyPage eyebrow="Contribute" title="Write for ProductReveal" description="Guest post guidelines for makers, marketers and researchers.">
      <p>We welcome original pitches from writers who understand the maker economy. If you have a strong point of view about a category we cover — AI tools, SaaS, no-code, WordPress, Shopify, marketing, design or developer tooling — we'd love to hear from you.</p>
      <h2>Guidelines</h2>
      <ul>
        <li><strong>Original content only.</strong> No previously published or AI-spun articles.</li>
        <li><strong>1,200 words minimum.</strong> Long-form guides and comparisons perform best.</li>
        <li><strong>Point of view.</strong> Bring genuine expertise, examples and opinions — not generic summaries.</li>
        <li><strong>No spam links.</strong> One relevant author link is fine; product links are subject to editorial review.</li>
      </ul>
      <h2>Editorial process</h2>
      <p>Send your pitch (topic, angle, outline and short bio) to <a href="mailto:contact@productreveal.com">contact@productreveal.com</a>. If it's a fit, an editor will reply within a week with feedback and a deadline. Every accepted draft goes through a light edit before publishing.</p>
    </PolicyPage>
  ),
});