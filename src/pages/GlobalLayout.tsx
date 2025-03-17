import { Navbar } from "@/components/app";
import { Outlet } from "react-router-dom";

const GlobalLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default GlobalLayout;
