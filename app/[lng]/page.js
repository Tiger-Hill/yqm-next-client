import HomeContent from "@/components/home/HomeContent"

const Home = ({ params: { lng }}) => {
  return <HomeContent lng={lng} />;
}

export default Home
