import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { DateTimePicker } from "../../../DateTimePicker/DateTimePicker";
import { CheckboxRegular } from "../../../CheckboxRegular/CheckboxRegular";
import scss from "./ReportFormSingleDocuments.module.scss";
import { useToggle } from "../../../../hooks/useToggle";

interface ReportFormSingleDocumentsProps {
  id: string;
  name: string;
  checkbox: ReportCriteriaChB;
  nodes?: ReportCriteriaDocument[] | ReportCriteriaMainType[];
}

export const ReportFormSingleDocuments = ({
  id,
  name,
  checkbox,
  nodes,
}: ReportFormSingleDocumentsProps) => {
  // Destrukturyzacja obiektu reportCriteria w celu uzyskania indywidualnych kryteriów
  const { isOpenModal: isResizeText, toggleModal: toogleText } = useToggle();
  const [checked, setChecked] = useState(checkbox?.checked);
  const [hasChildren, setHasChildren] = useState(false);
  console.log(typeof nodes);
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      setHasChildren(true);
    } else {
      setHasChildren(false);
    }
  }, [nodes]);
  return (
    <li className={`${scss["reportFormSingleDocument-main-container-li"]}`}>
      <div className={`${scss["reportFormSingleDocument-main-container"]}`}>
        <div className={scss["checkbox-container"]}>
          <CheckboxRegular
            checked={checked}
            setChecked={setChecked}
            name={checkbox.name}
          />
        </div>

        <div
          onClick={toogleText}
          className={`${scss["description-container"]} ${
            hasChildren ? scss["description-container-cursor"] : ""
          }`}
        >
          <p>
            {name} <sup>{hasChildren ? `(${nodes?.length})` : null}</sup>
          </p>
        </div>
      </div>

      {isResizeText && hasChildren && (
        <ul className={`${scss["child-list"]}`}>
          {nodes?.map((node) => (
            <ReportFormSingleDocuments
              key={node.id!}
              id={node.id!}
              name={node.name!}
              checkbox={node.checkbox}
              nodes={node.mainTypes}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
