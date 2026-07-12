import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise on ProductReveal" },
      {
        name: "description",
        content:
          "Partner with ProductReveal to promote your AI tool, SaaS product, or digital service through clearly disclosed advertising and sponsorship opportunities.",
      },
      { property: "og:title", content: "Advertise on ProductReveal" },
      {
        property: "og:description",
        content:
          "Explore advertising and sponsorship opportunities on ProductReveal for AI tools, SaaS products, and digital services.",
      },
    ],
    links: [{ rel: "canonical", href: "/advertise" }],
  }),

  component: () => (
    <PolicyPage
      eyebrow="Advertising"
      title="Partner with ProductReveal"
      description="Promote your software, AI tool, or digital product through transparent advertising opportunities."
    >
      <p>
        ProductReveal welcomes advertising partnerships with companies that
        offer valuable software, AI tools, SaaS products, developer tools,
        marketing platforms, ecommerce solutions, and other digital services
        relevant to our audience.
      </p>

      <p>
        We believe advertising should be transparent, informative, and clearly
        distinguishable from editorial content. Our goal is to create a positive
        experience for both readers and advertisers while maintaining the trust
        of our audience.
      </p>

      <h2>Advertising Opportunities</h2>

      <ul>
        <li>
          <strong>Sponsored Listings</strong> — Promote your product in relevant
          categories with clear sponsorship disclosure.
        </li>

        <li>
          <strong>Display Advertising</strong> — Banner placements in selected
          areas of the website, subject to availability.
        </li>

        <li>
          <strong>Sponsored Articles</strong> — Educational or informational
          content that is clearly labeled as sponsored and reviewed before
          publication.
        </li>

        <li>
          <strong>Newsletter Sponsorships</strong> — Opportunities to feature
          your brand in future email newsletters when available.
        </li>
      </ul>

      <h2>Our Advertising Policy</h2>

      <p>
        All paid promotions are clearly identified as sponsored content. Paid
        partnerships do not influence our editorial opinions, product
        recommendations, or informational content. Maintaining transparency with
        our readers is an important part of our publishing standards.
      </p>

      <p>
        We reserve the right to decline advertisements that do not align with
        our editorial policies, community standards, or applicable laws. This
        includes misleading, deceptive, illegal, or inappropriate products and
        services.
      </p>

      <h2>Who Should Advertise?</h2>

      <p>
        Advertising may be suitable for companies offering:
      </p>

      <ul>
        <li>AI tools and AI assistants</li>
        <li>SaaS applications</li>
        <li>Marketing and SEO software</li>
        <li>Developer tools</li>
        <li>WordPress plugins and themes</li>
        <li>Shopify apps</li>
        <li>No-code platforms</li>
        <li>Business and productivity software</li>
      </ul>

      <h2>Contact Us</h2>

      <p>
        If you're interested in advertising or discussing a partnership, please
        email{" "}
        <a href="mailto:contact@productreveal.com">
          contact@productreveal.com
        </a>{" "}
        or visit our <Link to="/contact">Contact page</Link>.
      </p>

      <p>
        Please include a brief introduction to your company, your product or
        service, and the type of advertising opportunity you're interested in.
        We'll respond as soon as possible.
      </p>
    </PolicyPage>
  ),
});
```
