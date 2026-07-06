import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/terms-and-conditions")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms and Conditions — ProductReveal" },
      { name: "description", content: "The terms that govern your use of ProductReveal, including rules for user-submitted content, product listings, and limitations of liability." },
      { property: "og:title", content: "Terms and Conditions — ProductReveal" },
      { property: "og:description", content: "Rules and terms for using ProductReveal." },
    ],
    links: [{ rel: "canonical", href: "/terms-and-conditions" }],
  }),
});

function Terms() {
  return (
    <PolicyPage eyebrow="Legal" title="Terms and Conditions" description="Last updated: January 2026">
      <h2>Website usage</h2>
      <p>By using ProductReveal, you agree to these terms. You may browse, read and share our content for personal, non-commercial use. You may not scrape, resell or republish our editorial content without written permission.</p>
      <h2>User accounts</h2>
      <p>You are responsible for maintaining the security of your account and for any activity that occurs under it. Do not share your credentials, and notify us immediately if you suspect unauthorised access.</p>
      <h2>User-submitted content</h2>
      <p>When you submit a product, review, comment or other content to ProductReveal, you grant us a non-exclusive, worldwide, royalty-free licence to publish, distribute and edit that content in connection with the service. You are responsible for the accuracy of what you submit and for having the right to submit it. Do not submit content that is illegal, misleading, defamatory, infringing, spammy, harmful, or promotes gambling, adult, weapons, drug or piracy-related products.</p>
      <h2>Product listings</h2>
      <p>Product listings are curated by our editorial team. We reserve the right to edit, decline or remove any listing at any time, for any reason, including if the product becomes misleading, unavailable or violates these terms.</p>
      <h2>No guarantee of accuracy</h2>
      <p>We work hard to keep listings accurate, but products change frequently. ProductReveal makes no warranties about the completeness, accuracy or reliability of any information on the site. Always verify pricing, features and terms on the product's official website before purchase.</p>
      <h2>External links</h2>
      <p>ProductReveal contains links to third-party websites. We are not responsible for the content, policies or practices of those websites.</p>
      <h2>Limitation of liability</h2>
      <p>To the maximum extent permitted by law, ProductReveal and its team shall not be liable for any indirect, incidental, consequential or special damages arising from your use of the site or reliance on any information published here.</p>
      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. Continued use of ProductReveal after changes means you accept the updated terms.</p>
      <h2>Contact</h2>
      <p>Questions? Email <a href="mailto:contact@productreveal.com">contact@productreveal.com</a>.</p>
    </PolicyPage>
  );
}