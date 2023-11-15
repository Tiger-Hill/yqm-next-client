import AboutContent from "@/components/public-pages/about/AboutContent";
import AboutHeader from "@/components/public-pages/about/AboutHeader";

const AboutPage = ({ params: { lng }}) => {
  return (
    <>
      <AboutHeader lng={lng} />
      <AboutContent lng={lng} />
    </>
  );
}

export default AboutPage
