import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import MoveRequestForm from "@/components/MoveRequestForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { ScrollProgress } from "@/components/motion/ScrollEffects";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollTruck from "@/components/ScrollTruck";
import LangUpdater from "@/components/LangUpdater";

export default function Home() {
  return (
    <>
      <LangUpdater />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <HowItWorks />
        <FAQ />
        <MoveRequestForm />
      </main>
      <Footer />
      <ScrollTruck />
      <WhatsAppButton />
    </>
  );
}
