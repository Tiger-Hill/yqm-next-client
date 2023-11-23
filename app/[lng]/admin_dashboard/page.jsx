import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminDasboardPage = ({ params: { lng } }) => {
  return <AdminDashboard lng={lng} />;
};

export default AdminDasboardPage;
