import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useMainDataContext } from "../Context/useMainDataContext";
import { useToggle } from "../../hooks/useToggle";
import { getFormatedDate } from "../GlobalFunctions/GlobalFunctions";
import scss from "./ReportConditionsFulfilled.module.scss";
import { use, useEffect, useMemo } from "react";

interface ReportConditionsFulfilledProps {
  reportCriteriaToDb: ReportCriteriaToDb[];
  reportDocumentsCriteriaToDb?: ReportCriteriaAllDocuments[] | undefined;
}

export const ReportConditionsFulfilled = ({
  reportCriteriaToDb,
  reportDocumentsCriteriaToDb = undefined,
}: ReportConditionsFulfilledProps) => {
  const { options } = useMainDataContext();
  const { isOpenModal: isResizeText, toggleModal: toogleText } = useToggle();

  const documentsReadyForDisplay = useMemo(() => {
    if (!reportDocumentsCriteriaToDb?.length) return [];

    return reportDocumentsCriteriaToDb.flatMap((root) => {
      return root.documents.flatMap((doc) => {
        const docName = `${doc.documentName}`;

        // brak mainTypes
        if (!doc.mainTypes?.length) return [docName];

        return doc.mainTypes.flatMap((mt) => {
          const mtName = `${docName} ${mt.mainTypeName}`;

          // brak types
          if (!mt.types?.length) return [mtName];

          return mt.types.flatMap((t) => {
            const tName = `${mtName} ${t.typeName}`;

            // brak subtypes
            if (!t.subtypes?.length) return [tName];

            return t.subtypes.map((st) => `${tName} ${st.subtypeName}`);
          });
        });
      });
    });
  }, [reportDocumentsCriteriaToDb]);

  if (!reportCriteriaToDb?.length) return null;
  if (reportDocumentsCriteriaToDb && reportDocumentsCriteriaToDb?.length === 0)
    return null;
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
              <>
                {/* 1️⃣ Najpierw kryteria */}
                {reportCriteriaToDb.map((criteria) => (
                  <li
                    key={criteria.name}
                    className={scss["item-list-show-criteria"]}
                  >
                    <span className={scss["criteria-description"]}>
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
                ))}
                {documentsReadyForDisplay.length > 0 && (
                  <>
                    <li>Dokumenty:</li>
                  </>
                )}
                {/* 2️⃣ Potem dokumenty */}
                {documentsReadyForDisplay.length > 0 &&
                  documentsReadyForDisplay.map((docName, index) => (
                    <li
                      key={docName}
                      className={scss["item-list-show-criteria-documents"]}
                    >
                      <span>{String(index + 1).padStart(3, "0")}. </span>
                      <span>{docName}</span>
                    </li>
                  ))}
              </>
            ) : (
              <p>Brak kryteriów</p>
            )
          ) : null}
        </ul>
      </div>
    </div>
  );
};
