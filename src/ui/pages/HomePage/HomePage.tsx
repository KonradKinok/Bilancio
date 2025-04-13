import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { format } from "date-fns";
import { useMainDataContext } from "../../components/Context/useOptionsImage";
import { MainTable } from "../../components/MainTable/MainTable";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
import scss from "./HomePage.module.scss";

const HomePage: React.FC = () => {
  const { formValuesHomePage, setFormValuesHomePage } = useMainDataContext();
  return (
    <div>
      <FormHomeDate />
      <MainTable />
    </div>
  );
};

export default HomePage;
