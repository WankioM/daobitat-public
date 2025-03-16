
import { Header } from "../Header/Header";
import AboutHero from "./AboutHero";
import MissionSection from "./MissionSection";
import QuoteSection from "./QuoteSection";
import TeamSection from "./TeamSection";
import CtaSection from "./CtaSection";
import FaqSection from "./FaqSection";
import Footer from "../Footer/Footer";

export default function AboutUs() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <AboutHero />
      <MissionSection />
      <QuoteSection />
      <TeamSection />
      <CtaSection />
      <FaqSection />
      <Footer/>

         </main>
  );
}
