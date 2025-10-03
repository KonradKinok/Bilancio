import { useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { DateTimePicker } from "../../DateTimePicker/DateTimePicker";
import { CheckboxRegular } from "../../CheckboxRegular/CheckboxRegular";
import scss from "./ReportFormDocuments.module.scss";
import { useToggle } from "../../../hooks/useToggle";
import { ReportFormSingleDocuments } from "./ReportFormSingleDocuments/ReportFormSingleDocuments";
import { ReportFormSingleDocument } from "./ReportFormSingleDocument/ReportFormSingleDocument";

interface ReportFormDocumentsProps {
  // reportCriteria: ReportCriteria;
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
  documentNameCriteria: ReportCriteriaDocument | undefined;
}

export const ReportFormDocuments: React.FC<ReportFormDocumentsProps> = ({
  // reportCriteria,
  setReportCriteria,
  documentNameCriteria,
}) => {
  const { isOpenModal: isResizeText, toggleModal: toogleText } = useToggle();
  const [checked, setChecked] = useState(true);
  const [hasChildren, setHasChildren] = useState(false);
  const mainTypes = useMemo(() => {
    return documentNameCriteria ? [...documentNameCriteria.MainTypes] : [];
  }, [documentNameCriteria]);

  // useEffect(() => {
  //   if (documentNameCriteria && documentNameCriteria.length > 0) {
  //     setHasChildren(true);
  //   } else {
  //     setHasChildren(false);
  //   }
  // }, [children]);
  if (!documentNameCriteria) return null;
  const { DocumentId, DocumentName, Checkbox } = documentNameCriteria;
  return (
    <ul>
      <li className={`${scss["reportFormSingleDocument-main-container-li"]}`}>
        <div className={`${scss["reportFormSingleDocument-main-container"]}`}>
          <div className={scss["checkbox-container"]}>
            <CheckboxRegular
              checked={checked}
              setChecked={setChecked}
              name={"0"}
            />
          </div>

          <div
            onClick={toogleText}
            className={`${scss["description-container"]} ${
              hasChildren ? scss["description-container-cursor"] : ""
            }`}
          >
            <p>
              Dokumenty{" "}
              {/* <sup>{hasChildren ? `(${children?.length})` : null}</sup> */}
            </p>
          </div>
        </div>
        <ul className={`${scss["reportFormDocuments-main-list-container"]}`}>
          <ReportFormSingleDocument
            id={DocumentId}
            name={DocumentName}
            checkbox={Checkbox}
            children={
              documentNameCriteria.MainTypes?.map((mt) => ({
                id: mt.MainTypeId ?? "",
                name: mt.MainTypeName ?? "",
                checkbox: mt.Checkbox,
                children: mt.Types?.map((t) => ({
                  id: t.TypeId ?? "",
                  name: t.TypeName ?? "",
                  checkbox: t.Checkbox,
                  children: t.Subtypes?.map((st) => ({
                    id: st.SubtypeId ?? "",
                    name: st.SubtypeName ?? "",
                    checkbox: st.Checkbox,
                  })),
                })),
              })) || []
            }
          />
        </ul>
      </li>
    </ul>
  );
};

// return (
//   <div className={`${scss["reportFormDocuments-main-container"]}`}>
//     <ul key={documentNameCriteria.DocumentId}>
//       <li>{documentNameCriteria.DocumentName}</li>
//       {documentNameCriteria.MainTypes.map((mainType) => {
//         return (
//           <ul key={mainType.MainTypeId}>
//             <li>
//               {mainType.MainTypeId}: {mainType.MainTypeName}
//             </li>
//             {mainType.Types.map((type) => {
//               return (
//                 <ul key={type.TypeId}>
//                   <li>
//                     {type.TypeId}: {type.TypeName}
//                   </li>
//                   {type.Subtypes.map((subtypes) => {
//                     return (
//                       <ul>
//                         <li>
//                           {subtypes.SubtypeId}: {subtypes.SubtypeName}
//                         </li>
//                       </ul>
//                     );
//                   })}
//                 </ul>
//               );
//             })}
//           </ul>
//         );
//       })}
//     </ul>
//   </div>
// );
