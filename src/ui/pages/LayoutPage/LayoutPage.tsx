import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "../../components/Navigation/Navigation";

export const LayoutPage: React.FC = () => {
  return (
    <div>
      <header>
        <h1>LayoutPage</h1>
        <Navigation />
      </header>
      <main>
        <Suspense fallback={"LOADING..."}>
          <Outlet />
        </Suspense>
      </main>

      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};
