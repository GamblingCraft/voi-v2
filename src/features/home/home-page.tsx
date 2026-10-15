import { HomeStory } from "./product-story/home-story";
import { FaqSection } from "@/features/content/components/faq-section";
import { HomeMotion } from "./home-motion";
import { HeroSlider } from "./hero/hero-slider";
import { ProductStrip } from "./product-strip/product-strip";
import { WaterJourney } from "./water-journey";
import {
  OriginStory,
  MagazineSection,
  OrbitCatalog,
  HomeJournal,
  PartnerSection,
} from "./sections/home-sections";
const sections = { waterJourney: false, magazine: false, partners: false };
export function HomePage() {
  return (
    <HomeMotion>
      <HeroSlider />
      <ProductStrip />
      <OriginStory />
      <HomeStory>
        {sections.waterJourney && <WaterJourney />}
        {sections.magazine && <MagazineSection />}
        <OrbitCatalog />
        <HomeJournal />
        {sections.partners && <PartnerSection />}
        <FaqSection />
      </HomeStory>
    </HomeMotion>
  );
}
