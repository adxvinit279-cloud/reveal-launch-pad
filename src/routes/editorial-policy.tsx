import { SITE } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy | ProductReveal" },
      {
        name: "description",
        content:
          "Learn how ProductReveal creates, reviews, updates, and maintains editorial content, software reviews, comparisons, and product listings.",
      },
      { property: "og:title", content: "Editorial Policy | ProductReveal" },
      {
        property: "og:description",
        content:
          "Our editorial principles, review process, correction policy, and commitment to transparency.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/editorial-policy` }],
  }),

  component: () => (
    <PolicyPage
      eyebrow="Editorial Standards"
      title="Editorial Policy"
      description="Our commitment to publishing accurate, transparent, and helpful content."
    >
      <p>
        ProductReveal is committed to creating content that is accurate,
        informative, and useful for readers exploring software, AI tools, SaaS
        products, and digital services. This editorial policy explains the
        principles we follow when creating and maintaining content on our
        website.
      </p>

      <h2>Our Editorial Principles</h2>

      <p>
        We aim to publish original content that helps readers understand
        software products, compare available options, and make informed
        decisions. Our articles are written in clear language and focus on
        providing practical information rather than promotional messaging.
      </p>

      <h2>How We Create Content</h2>

      <p>
        Our content may be prepared using publicly available information,
        official product documentation, company websites, industry resources,
        and, where appropriate, hands-on evaluation. We make reasonable efforts
        to verify factual information before publication.
      </p>

      <p>
        Because software products evolve over time, features, pricing, and
        availability may change after an article is published. We encourage
        readers to verify important details on the official website of the
        product provider.
      </p>

      <h2>Editorial Independence</h2>

      <p>
        Our editorial decisions are made independently. Advertising,
        sponsorships, or affiliate partnerships do not determine which products
        we cover or influence the factual information presented in our content.
        Any sponsored content is clearly identified for readers.
      </p>

      <h2>Reviews & Comparisons</h2>

      <p>
        Product reviews and comparison articles are intended to provide helpful
        information about features, pricing, intended use cases, and other
        relevant details. Software recommendations may vary depending on user
        needs, budgets, and individual preferences.
      </p>

      <h2>Content Updates</h2>

      <p>
        We periodically review published content and update it when significant
        product information changes or when inaccuracies are identified.
        However, we cannot guarantee that every page will always reflect the
        latest product updates.
      </p>

      <h2>Corrections</h2>

      <p>
        Accuracy is important to us. If you believe any information published on
        ProductReveal is incorrect or outdated, please contact us at{" "}
        <a href="mailto:contact@productreveal.com">
          contact@productreveal.com
        </a>.
        We review reported issues and make corrections when appropriate.
      </p>

      <h2>Affiliate Disclosure</h2>

      <p>
        Some pages on ProductReveal may include affiliate links. If a purchase
        is made through these links, we may earn a commission at no additional
        cost to the user. These relationships help support the operation of the
        website but do not influence our editorial standards.
      </p>

      <h2>Our Commitment</h2>

      <p>
        We are committed to publishing original, transparent, and trustworthy
        content that provides genuine value to our readers. Our goal is to help
        users discover and evaluate digital products with confidence while
        maintaining high editorial standards.
      </p>
    </PolicyPage>
  ),
});
