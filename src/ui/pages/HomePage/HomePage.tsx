import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>HomePage</h1>

      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default HomePage;
