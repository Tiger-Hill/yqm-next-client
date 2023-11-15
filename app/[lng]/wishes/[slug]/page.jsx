import WishShow from "@/components/wishes/show/WishShow";

const WishShowPage = ({ params: { lng, slug } }) => {
  console.log(slug);

  return <WishShow lng={lng} wishSlug={slug} />;
}

export default WishShowPage
