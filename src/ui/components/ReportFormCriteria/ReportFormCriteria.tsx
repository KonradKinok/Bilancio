import { ReportFormDateTimePickers } from "./ReportFormDateTimePickers/ReportFormDateTimePickers";
import scss from "./ReportFormCriteria.module.scss";
import { use, useEffect, useState } from "react";
import { ReportFormButtonGenerateRaport } from "./ReportFormButtonGenerateRaport/ReportFormButtonGenerateRaport";
import { ReportFormDocuments } from "./ReportFormDocuments/ReportFormDocuments";
import { ReportFormSingleDocument } from "./ReportFormDocuments/ReportFormSingleDocument/ReportFormSingleDocument";
import { ReportFormSingleDocuments } from "./ReportFormDocuments/ReportFormSingleDocuments/ReportFormSingleDocuments";

interface ReportFormCriteriaProps {
  reportCriteria: ReportCriteria[];
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
  handleButtonClick: () => void;
  isRaportGenerating: boolean;
  documentsNameCriteria: ReportCriteriaAllDocuments[] | undefined;
}

export const ReportFormCriteria: React.FC<ReportFormCriteriaProps> = ({
  reportCriteria,
  setReportCriteria,
  handleButtonClick,
  isRaportGenerating,
  documentsNameCriteria = undefined,
}) => {
  const onButtonClick = () => {
    handleButtonClick();
  };

  return (
    <form
      action=""
      className={`${scss["reportFormCriteria-main-container"]} ${
        isRaportGenerating ? scss["form-disabled"] : ""
      }`}
    >
      <div className={`${scss["reportFormCriteria-container"]} `}>
        {reportCriteria &&
          reportCriteria.length > 0 &&
          reportCriteria.map((item) => (
            <ReportFormDateTimePickers
              key={item.id}
              reportCriteria={item}
              setReportCriteria={setReportCriteria}
            />
          ))}
      </div>
      <ul className={scss["reportFormCriteria-documents-container"]}>
        {documentsNameCriteria?.map((root) => (
          <ReportFormSingleDocument
            id={root.id}
            name={root.name}
            checkbox={root.checkbox}
            children={root.documents?.map((doc) => ({
              id: doc.documentId ?? "",
              name: doc.documentName ?? "",
              checkbox: doc.checkbox,
              children: doc.mainTypes?.map((mt) => ({
                id: mt.mainTypeId ?? "",
                name: mt.mainTypeName ?? "",
                checkbox: mt.checkbox,
                children: mt.types?.map((t) => ({
                  id: t.typeId ?? "",
                  name: t.typeName ?? "",
                  checkbox: t.checkbox,
                  children: t.subtypes?.map((st) => ({
                    id: st.subtypeId ?? "",
                    name: st.subtypeName ?? "",
                    checkbox: st.checkbox,
                  })),
                })),
              })),
            }))}
          />
        ))}
      </ul>
      <ReportFormButtonGenerateRaport
        reportCriteria={reportCriteria}
        handleButtonClick={onButtonClick}
      />
    </form>
  );
};
