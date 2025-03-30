import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { MainTable } from "../../components/MainTable/MainTable";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import scss from "./HomePage.module.scss";
const HomePage: React.FC = () => {
  const [dateTimePickerDate, setDateTimePickerDate] = useState<Date | null>(
    new Date()
  );
  return (
    <div>
      <h1>HomePage</h1>
      <div className={scss["container-dateTimePicker"]}>
        <label htmlFor="dateTimePicker">Label</label>
        <DateTimePicker
          dateTimePickerDate={dateTimePickerDate}
          setDateTimePickerDate={setDateTimePickerDate}
        />
      </div>
      <MainTable />
    </div>
  );
};

export default HomePage;
