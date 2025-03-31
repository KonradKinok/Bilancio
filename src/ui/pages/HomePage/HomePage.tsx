import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { MainTable } from "../../components/MainTable/MainTable";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import scss from "./HomePage.module.scss";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
const HomePage: React.FC = () => {
  const [dateTimePickerDate, setDateTimePickerDate] = useState<Date | null>(
    new Date()
  );
  return (
    <div>
      <FormHomeDate />

      <MainTable />
    </div>
  );
};

export default HomePage;
