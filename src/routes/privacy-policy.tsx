import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/privacy-policy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — ProductReveal" },
      { name: "description", content: "How ProductReveal collects, uses, and protects information — including cookies, analytics, third-party advertising vendors, and your data rights." },
      { property: "og:title", content: "Privacy Policy — ProductReveal" },
      { property: "og:description", content: "Read how ProductReveal handles your data, cookies, and third-party services." },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
});

function Privacy() {
  return (
    <PolicyPage eyebrow="Legal" title="Privacy Policy" description="Last updated: January 2026">
      <p>This Privacy Policy explains how ProductReveal ("we", "us", "our") collects, uses, discloses and protects information when you visit productreveal.com or interact with our services.</p>
      <h2>Information we collect</h2>
      <p>We collect information you provide directly when you create an account, submit a product, leave a review, subscribe to our newsletter, or contact us. This may include your name, email address, product details, review content, and any files you upload. We also collect limited technical information automatically, such as your IP address, browser type, device information, referring page and the pages you view on ProductReveal.</p>
      <h2>How we use information</h2>
      <p>We use the information we collect to operate the ProductReveal service, review submissions, publish approved products and reviews, send transactional emails, deliver our newsletter, respond to inquiries, improve the site, and prevent abuse.</p>
      <h2>Cookies and similar technologies</h2>
      <p>We use cookies and similar technologies to keep you signed in, remember preferences, understand how the site is used, and support advertising. You can disable cookies in your browser settings, but some parts of the site may not work as expected.</p>
      <h2>Third-party services</h2>
      <p>We rely on trusted third-party providers for hosting, authentication, analytics, email delivery and advertising. These providers process data on our behalf under contractual privacy safeguards.</p>
      <h2>Google AdSense and advertising cookies</h2>
      <p>ProductReveal may display advertising served by Google AdSense and other advertising partners. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and other sites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits to ProductReveal and other sites on the Internet. You may opt out of personalised advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Ads Settings</a>, or opt out of a third-party vendor's use of cookies for personalised advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>
      <h2>Analytics</h2>
      <p>We use privacy-respecting analytics to understand how visitors use the site so we can improve it. Analytics data is aggregated and does not identify individual users.</p>
      <h2>Affiliate and referral links</h2>
      <p>Some product listings and blog posts may contain affiliate or referral links. When you click such a link and make a purchase, ProductReveal may receive a small commission at no additional cost to you. Affiliate relationships never influence whether a product is approved or how it is described.</p>
      <h2>Data protection and retention</h2>
      <p>We store data using industry-standard security controls, including encryption in transit. We retain personal data only as long as needed for the purposes described here, or as required by law. You may request deletion of your account and associated data at any time by contacting us.</p>
      <h2>Your rights</h2>
      <p>Depending on your location, you may have rights to access, correct, delete or export your personal data, or to object to certain processing. To exercise these rights, contact us using the details below.</p>
      <h2>Children</h2>
      <p>ProductReveal is not directed to children under 13. We do not knowingly collect personal information from children.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date above.</p>
      <h2>Contact</h2>
      <p>Questions about privacy? Email us at <a href="mailto:contact@productreveal.com">contact@productreveal.com</a>.</p>
    </PolicyPage>
  );
}