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
      <p>
        {formValuesHomePage.firstDate
          ? format(formValuesHomePage.firstDate, "yyyy.MM.dd")
          : "Brak daty"}
      </p>
      <FormHomeDate
        formValuesHomePage={formValuesHomePage}
        setFormValuesHomePage={setFormValuesHomePage}
      />

      <MainTable
        formValuesHomePage={formValuesHomePage}
        setFormValuesHomePage={setFormValuesHomePage}
      />
    </div>
  );
};

export default HomePage;
