import NewProductForm from '@/components/products/new/NewProductForm'

const NewProductPage = ({ params: { lng } }) => {
  return <NewProductForm lmg={lng} />;
}

export default NewProductPage
