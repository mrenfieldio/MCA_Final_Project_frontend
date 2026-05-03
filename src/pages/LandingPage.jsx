import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import WhySection from "../components/WhySection";
import HowItWorksSection from "../components/HowItWorksSection";
import "../styles/global.css";

export default function App() {
  return (
    <>
      
      <div className="lp-root">
        <Navbar />
        <HeroSection />
        <WhySection />
        <HowItWorksSection />
        <Footer />
      </div>
    </>
  );
}