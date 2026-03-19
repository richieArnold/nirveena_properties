// src/components/Layout.jsx
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const isPropertyPage = location.pathname.startsWith("/properties/");
  return (
    <div className="flex flex-col min-h-screen">
      {!isPropertyPage && <Header />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
