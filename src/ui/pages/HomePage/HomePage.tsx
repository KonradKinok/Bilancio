import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { MainTable } from "../../components/MainTable/MainTable";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import scss from "./HomePage.module.scss";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";

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
      <FormHomeDate
        formValuesHomePage={formValuesHomePage}
        setFormValuesHomePAge={setFormValuesHomePage}
      />

      <MainTable />
    </div>
  );
};

export default HomePage;
