import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { landingMetadata } from "@/features/content/landing-metadata";
import { ContactsPage } from "@/features/content/pages/contacts-page";

type Props = { params: Promise<{ locale: string }> };
export function generateMetadata({ params }: Props) {
  return landingMetadata("contacts", params);
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <ContactsPage />;
}
