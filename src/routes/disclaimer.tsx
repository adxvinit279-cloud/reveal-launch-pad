
import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/disclaimer")({
  component: () => (
    <PolicyPage
      eyebrow="Legal"
      title="Disclaimer"
      description="Last updated: January 2026"
    >
      <p>
        The information published on ProductReveal is provided for general
        informational and educational purposes only. By using this website, you
        acknowledge and agree to the terms outlined in this disclaimer.
      </p>

      <h2>General Information</h2>

      <p>
        We make reasonable efforts to provide accurate, up-to-date, and useful
        information about software, AI tools, SaaS products, and digital
        services. However, ProductReveal does not guarantee the completeness,
        accuracy, reliability, or availability of any information published on
        this website.
      </p>

      <p>
        Product features, pricing, availability, and policies may change without
        notice. Always verify important information directly on the official
        website of the product or service before making a purchase or business
        decision.
      </p>

      <h2>Editorial Content</h2>

      <p>
        Reviews, comparisons, tutorials, and recommendations published on
        ProductReveal are intended to provide helpful information based on
        research, publicly available resources, product documentation, and, when
        appropriate, practical evaluation. They should not be considered
        professional advice or guarantees of performance.
      </p>

      <h2>Affiliate Disclosure</h2>

      <p>
        Some pages may contain affiliate or referral links. If you purchase a
        product or service through one of these links, ProductReveal may earn a
        commission at no additional cost to you.
      </p>

      <p>
        Affiliate partnerships help support the operation of this website.
        However, they do not determine which products we cover or influence our
        editorial content, opinions, or recommendations.
      </p>

      <h2>External Websites</h2>

      <p>
        ProductReveal may link to third-party websites for additional
        information or product access. We do not control or endorse the content,
        services, privacy practices, or policies of external websites and are
        not responsible for their availability or accuracy.
      </p>

      <h2>No Professional Advice</h2>

      <p>
        The content available on ProductReveal is not intended to serve as
        legal, financial, accounting, medical, tax, or other professional
        advice. You should consult a qualified professional before making
        decisions that require specialized expertise.
      </p>

      <h2>Limitation of Liability</h2>

      <p>
        To the fullest extent permitted by applicable law, ProductReveal shall
        not be liable for any direct, indirect, incidental, consequential, or
        other damages resulting from the use of, or reliance upon, information
        available on this website.
      </p>

      <h2>Updates</h2>

      <p>
        We may update this disclaimer from time to time to reflect changes in
        our website, editorial practices, or legal requirements. Any updates
        will be published on this page with the revised effective date.
      </p>

      <h2>Contact</h2>

      <p>
        If you have questions about this disclaimer or believe any information
        on ProductReveal is inaccurate, please contact us at{" "}
        <a href="mailto:contact@productreveal.com">
          contact@productreveal.com
        </a>.
      </p>
    </PolicyPage>
  ),

  head: () => ({
    meta: [
      { title: "Disclaimer | ProductReveal" },
      {
        name: "description",
        content:
          "Read the ProductReveal disclaimer regarding editorial content, affiliate links, external websites, accuracy of information, and limitation of liability.",
      },
      { property: "og:title", content: "Disclaimer | ProductReveal" },
      {
        property: "og:description",
        content:
          "Learn about ProductReveal's disclaimer, affiliate disclosure, editorial content, and legal information.",
      },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
});

