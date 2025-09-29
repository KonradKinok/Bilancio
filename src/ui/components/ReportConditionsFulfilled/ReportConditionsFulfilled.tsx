import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useMainDataContext } from "../Context/useMainDataContext";
import { useToggle } from "../../hooks/useToggle";
import { getFormatedDate } from "../GlobalFunctions/GlobalFunctions";
import scss from "./ReportConditionsFulfilled.module.scss";

interface ReportConditionsFulfilledProps {
  reportCriteriaToDb: ReportCriteriaToDb[];
}

export const ReportConditionsFulfilled = ({
  reportCriteriaToDb,
}: ReportConditionsFulfilledProps) => {
  const { options } = useMainDataContext();
  const { isOpenModal: isResizeText, toggleModal: toogleText } = useToggle();

  if (!reportCriteriaToDb?.length) return null;

  const hasCriteria = reportCriteriaToDb.length > 0;

  return (
    <div className={`${scss["reportConditionsFulfilled-main-container"]}`}>
      <div
        className={`${scss["reportConditionsFulfilled-container"]} ${
          scss[`${options.fontSize.en}-font`]
        }`}
      >
        <p
          onClick={hasCriteria ? toogleText : undefined}
          className={`${scss["show-criteria-text"]}`}
        >
          {hasCriteria ? (
            isResizeText ? (
              <span>
                <FaMinus /> Ukryj kryteria
              </span>
            ) : (
              <span>
                <FaPlus />
                Pokaż kryteria
              </span>
            )
          ) : (
            <span>"Brak kryteriów"</span>
          )}
        </p>
        <ul
          className={`${scss["list-show-criteria"]} ${
            isResizeText ? scss["resized"] : ""
          }`}
        >
          {isResizeText ? (
            hasCriteria ? (
              reportCriteriaToDb.map((criteria) => (
                <li
                  key={criteria.name}
                  className={`${scss["item-list-show-criteria"]}`}
                >
                  <span className={`${scss["criteria-description"]}`}>
                    {criteria.description}:
                  </span>

                  <span>
                    {criteria.firstDate
                      ? getFormatedDate(criteria.firstDate)
                      : "brak daty"}
                  </span>
                  <span>
                    <FaArrowRight />
                  </span>
                  <span>
                    {criteria.secondDate
                      ? getFormatedDate(criteria.secondDate)
                      : "brak daty"}
                  </span>
                </li>
              ))
            ) : (
              <p>Brak kryteriów</p>
            )
          ) : null}
        </ul>
      </div>
    </div>
  );
};
