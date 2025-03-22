import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { MainTable } from "../../components/MainTable/MainTable";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <MainTable />
    </div>
  );
};

export default HomePage;
