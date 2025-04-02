import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { format } from "date-fns";
import { MainTable } from "../../components/MainTable/MainTable";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
import scss from "./HomePage.module.scss";
export interface FormValuesHomePage {
  firstDate: Date | null;
  secondDate: Date | null;
}

const HomePage: React.FC = () => {
  const [formValuesHomePage, setFormValuesHomePage] =
    useState<FormValuesHomePage>({
      firstDate: null,
      secondDate: null,
    });
  
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
