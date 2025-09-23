import { useMainDataContext } from "../Context/useMainDataContext";
import { getFormatedDate } from "../GlobalFunctions/GlobalFunctions";
import scss from "./ReportConditionsFulfilled.module.scss";
import { useEffect, useState } from "react";

interface ReportConditionsFulfilledProps {
  reportCriteriaToDb: ReportCriteriaToDb[];
}

export const ReportConditionsFulfilled = ({
  reportCriteriaToDb,
}: ReportConditionsFulfilledProps) => {
  const { options } = useMainDataContext();
  if (!reportCriteriaToDb || reportCriteriaToDb.length === 0) {
    return <div></div>;
  }
  return (
    <div className={`${scss["reportConditionsFulfilled-main-container"]}`}>
      <div
        className={`${scss["reportConditionsFulfilled-container"]} ${
          scss[`${options.fontSize.en}-font`]
        }`}
      >
        <p>Kryteria wykonanego raportu:</p>
        {reportCriteriaToDb && reportCriteriaToDb.length > 0 ? (
          <ul>
            {reportCriteriaToDb.map((criteria) => (
              <li key={criteria.name}>
                {criteria.description}: {getFormatedDate(criteria.firstDate)} :{" "}
                {getFormatedDate(criteria.secondDate)}
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak kryteriów</p>
        )}
      </div>
    </div>
  );
};
