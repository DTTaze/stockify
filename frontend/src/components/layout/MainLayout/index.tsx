import Footer from "../Footer";
import Header from "../Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
};

export default MainLayout;
