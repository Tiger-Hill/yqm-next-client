import Wishes from "@/components/wishes/Wishes"

const page = ({ params: { lng} }) => {
  return <Wishes lng={lng} />
}

export default page
