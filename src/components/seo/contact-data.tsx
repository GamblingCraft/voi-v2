import { company } from "@/lib/company";
import { siteUrl } from "@/lib/seo";

export function ContactData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Контакты ВОЙ в Иркутске",
    url: new URL("/contacts", siteUrl).href,
    mainEntity: {
      "@type": "Organization",
      name: company.name,
      url: siteUrl,
      telephone: company.phoneInternational,
      ...(company.email ? { email: company.email } : {}),
      sameAs: [company.telegramUrl, company.maxUrl].filter(Boolean),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
