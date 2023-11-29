import UpdateBulkOrders from "@/components/admin/update-bulk-orders/UpdateBulkOrders"

const page = ({ params: { lng } }) => {
  return <UpdateBulkOrders lng={lng}/>
}

export default page
