import { useEffect, useState } from "react";
import { useToggle } from "../../../hooks/useToggle";
import { CheckboxRegular } from "../../CheckboxRegular/CheckboxRegular";
import scss from "./ReportFormSingleDocument.module.scss";

interface ReportFormSingleDocumentProps {
  id: string;
  name: string;
  checkbox: ReportCriteriaChB;
  onToggleCheckbox?: (id: string, checked: boolean) => void;
  children?: ReportFormSingleDocumentProps[];
}

export const ReportFormSingleDocument = ({
  id,
  name,
  checkbox,
  onToggleCheckbox,
  children,
}: ReportFormSingleDocumentProps) => {
  const { isOpenModal: isResizeText, toggleModal: toggleText } = useToggle();
  const [hasChildren, setHasChildren] = useState(false);

  useEffect(() => {
    if (children && children.length > 0) {
      setHasChildren(true);
    } else {
      setHasChildren(false);
    }
  }, [children]);

  const handleSetChecked: React.Dispatch<React.SetStateAction<boolean>> = (
    val
  ) => {
    if (typeof val === "boolean") {
      onToggleCheckbox?.(id, val);
    }
  };

  return (
    <li className={`${scss["reportFormSingleDocument-main-container-li"]}`}>
      <div className={`${scss["reportFormSingleDocument-main-container"]}`}>
        <div className={scss["checkbox-container"]}>
          <CheckboxRegular
            checked={checkbox.checked}
            setChecked={handleSetChecked}
            name={checkbox.name}
          />
        </div>
        <div
          onClick={toggleText}
          className={`${scss["description-container"]} ${
            hasChildren ? scss["description-container-cursor"] : ""
          } ${!checkbox.checked ? scss["inactive-component"] : ""}`}
        >
          <p>
            {name} <sup>{hasChildren ? `(${children?.length})` : null}</sup>
          </p>
        </div>
      </div>

      {isResizeText && hasChildren && (
        <ul className={`${scss["child-list"]}`}>
          {children?.map((child) => (
            <ReportFormSingleDocument
              key={child.id}
              id={child.id}
              name={child.name}
              checkbox={child.checkbox}
              onToggleCheckbox={onToggleCheckbox}
              children={child.children}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
