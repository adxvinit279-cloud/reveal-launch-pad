import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";
export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise on ProductReveal" },
      { name: "description", content: "Reach founders, makers and product-people with sponsored listings, banner ads or newsletter sponsorship on ProductReveal." },
      { property: "og:title", content: "Advertise on ProductReveal" },
      { property: "og:description", content: "Sponsored listings, banners and newsletter sponsorship for makers." },
    ],
    links: [{ rel: "canonical", href: "/advertise" }],
  }),
  component: () => (
    <PolicyPage eyebrow="Partnerships" title="Advertise on ProductReveal" description="Reach the makers and buyers who read ProductReveal every week.">
      <p>ProductReveal is read by founders, indie hackers, freelancers and small teams shopping for the tools they'll rely on next. If your product genuinely helps this audience, we'd love to talk.</p>
      <h2>Advertising options</h2>
      <ul>
        <li><strong>Sponsored listings</strong> — a labelled placement on category and homepage sections.</li>
        <li><strong>Banner ads</strong> — tasteful in-content placements across product and blog pages.</li>
        <li><strong>Newsletter sponsorship</strong> — one primary sponsor per issue with clear labelling.</li>
      </ul>
      <h2>Our sponsorship principles</h2>
      <p>Sponsored content is always clearly labelled as "Sponsored". We do not accept sponsorship from products in adult, gambling, weapons, piracy or other categories that conflict with our editorial standards. Sponsorship never changes how a product is reviewed or where it ranks organically.</p>
      <h2>Get in touch</h2>
      <p>Email <a href="mailto:contact@productreveal.com">contact@productreveal.com</a> or use our <Link to="/contact">contact form</Link> and mention "Advertising inquiry" — we'll share our current rate card.</p>
    </PolicyPage>
  ),
});