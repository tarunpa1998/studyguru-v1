import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedScholarships from "@/components/FeaturedScholarships";
import PopularDestinations from "@/components/PopularDestinations";
import LatestArticles from "@/components/LatestArticles";
import EducationNews from "@/components/EducationNews";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

const StudyGuru = () => {
  return (
    <>
      <Helmet>
        <title>Study Guru - Your Guide to International Education</title>
        <meta 
          name="description" 
          content="Discover scholarships, universities, and resources for studying abroad with Study Guru - the premier education resource for international students."
        />
        <meta property="og:title" content="Study Guru - Your Guide to International Education" />
        <meta 
          property="og:description" 
          content="Find scholarships, universities, and expert advice for your international education journey."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://studyguruindia.com" />
      </Helmet>
      
      <Hero />
      <CategorySection />
      <FeaturedScholarships />
      <PopularDestinations />
      <LatestArticles />
      <EducationNews />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default StudyGuru;


