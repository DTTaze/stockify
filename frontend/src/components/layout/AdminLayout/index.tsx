import AdminHeader from "../AdminHeader";
import Footer from "../Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <AdminHeader />

      {children}

      <Footer />
    </>
  );
};

export default AdminLayout;
