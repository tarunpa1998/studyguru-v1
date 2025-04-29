import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedScholarships from "@/components/FeaturedScholarships";
import PopularDestinations from "@/components/PopularDestinations";
import LatestArticles from "@/components/LatestArticles";
import EducationNews from "@/components/EducationNews";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { DevTools } from "@/components/DevTools";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>StudyGlobal - Your Guide to International Education</title>
        <meta 
          name="description" 
          content="Discover scholarships, universities, and resources for studying abroad with StudyGlobal - the premier education resource for international students."
        />
        <meta property="og:title" content="StudyGlobal - Your Guide to International Education" />
        <meta 
          property="og:description" 
          content="Find scholarships, universities, and expert advice for your international education journey."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://studyglobal.com" />
      </Helmet>
      
      <Hero />
      <CategorySection />
      <FeaturedScholarships />
      <PopularDestinations />
      <LatestArticles />
      <EducationNews />
      <Testimonials />
      <CTASection />
      {import.meta.env.DEV && (
        <div className="container mx-auto mb-8">
          <DevTools />
        </div>
      )}
    </>
  );
};

export default Home;
