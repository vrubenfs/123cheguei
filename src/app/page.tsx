import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import MoveRequestForm from "@/components/MoveRequestForm";
import Footer from "@/components/Footer";
import { ScrollProgress } from "@/components/motion/ScrollEffects";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollTruck from "@/components/ScrollTruck";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <HowItWorks />
        <MoveRequestForm />
      </main>
      <Footer />
      <ScrollTruck />
      <WhatsAppButton />
    </>
  );
}
