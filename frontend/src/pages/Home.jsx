import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Hero from "@/sections/Hero";
import Stats from "@/sections/Stats";
import WhoFor from "@/sections/WhoFor";
import Services from "@/sections/Services";
import BuildTypes from "@/sections/BuildTypes";
import Pricing from "@/sections/Pricing";
import Showcase from "@/sections/Showcase";
import BlogPreview from "@/sections/BlogPreview";
import Contact from "@/sections/Contact";
import BuyWebsite from "@/sections/BuyWebsite";
import { ReturningOffer } from "@/components/ReturningOffer";

const Home = () => (
  <>
    <SEO
      title=""
      description="HoneyPot Studio builds websites, web apps and CRMs that work — landing pages from $548, tradie websites from $1,048, custom builds from $2,548, plus digital marketing, social media management and hosting. 200+ builds delivered Australia-wide."
      path="/"
    />
    <Navbar />
    <main>
      <Hero />
      <Stats />
      <WhoFor />
      <Services />
      <BuildTypes />
      <Pricing />
      <BuyWebsite />
      <Showcase />
      <BlogPreview />
      <Contact />
    </main>
    <Footer />
    <ReturningOffer />
  </>
);

export default Home;
