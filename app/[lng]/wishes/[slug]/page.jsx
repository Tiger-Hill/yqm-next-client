import WishShow from "@/components/wishes/show/WishShow";

const WishShowPage = ({ params: { lng, slug } }) => {
  return <WishShow lng={lng} wishSlug={slug} />;
}

export default WishShowPage
