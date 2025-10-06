import { ReportFormDateTimePickers } from "./ReportFormDateTimePickers/ReportFormDateTimePickers";
import scss from "./ReportFormCriteria.module.scss";
import { use, useEffect, useState } from "react";
import { ReportFormButtonGenerateRaport } from "./ReportFormButtonGenerateRaport/ReportFormButtonGenerateRaport";
import { ReportFormSingleDocument } from "./ReportFormSingleDocument/ReportFormSingleDocument";

interface ReportFormCriteriaProps {
  reportCriteria: ReportCriteria[];
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
  handleButtonClick: () => void;
  isRaportGenerating: boolean;
  reportDocumentsCriteria: ReportCriteriaAllDocuments[] | undefined;
  setReportDocumentsCriteria?: React.Dispatch<
    React.SetStateAction<ReportCriteriaAllDocuments[] | undefined>
  >;
}

export const ReportFormCriteria: React.FC<ReportFormCriteriaProps> = ({
  reportCriteria,
  setReportCriteria,
  handleButtonClick,
  isRaportGenerating,
  reportDocumentsCriteria = undefined,
  setReportDocumentsCriteria = undefined,
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
        {reportDocumentsCriteria?.map((root) => (
          <ReportFormSingleDocument
            id={root.id}
            name={root.name}
            checkbox={root.checkbox}
            onToggleCheckbox={(id, newChecked) => {
              setReportDocumentsCriteria?.((prev) =>
                prev ? updateChecked(prev, id, newChecked) : prev
              );
            }}
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

// Definiuj typ TreeNode, aby obsłużyć wszystkie poziomy drzewa
type TreeNode =
  | ReportCriteriaAllDocuments
  | ReportCriteriaAllDocuments["documents"][number]
  | ReportCriteriaAllDocuments["documents"][number]["mainTypes"][number]
  | ReportCriteriaAllDocuments["documents"][number]["mainTypes"][number]["types"][number]
  | ReportCriteriaAllDocuments["documents"][number]["mainTypes"][number]["types"][number]["subtypes"][number];

function updateChecked(
  nodes: ReportCriteriaAllDocuments[],
  nodeId: string,
  checked: boolean
): ReportCriteriaAllDocuments[] {
  const updateNode = (node: TreeNode): TreeNode => {
    // Sprawdź, czy to ten node (porównaj po wszystkich możliwych ID)
    if (
      ("id" in node && node.id === nodeId) ||
      ("documentId" in node && node.documentId === nodeId) ||
      ("mainTypeId" in node && node.mainTypeId === nodeId) ||
      ("typeId" in node && node.typeId === nodeId) ||
      ("subtypeId" in node && node.subtypeId === nodeId)
    ) {
      // Propaguj w dół (ustaw checked na tym nodzie i wszystkich dzieciach)
      return propagateDown(node, checked);
    }

    // Rekurencyjnie aktualizuj dzieci i recalculuj rodzica
    if ("documents" in node) {
      const updatedDocs = node.documents.map(
        updateNode
      ) as typeof node.documents;
      return {
        ...node,
        documents: updatedDocs,
        checkbox: recalcParent(updatedDocs, node.checkbox),
      };
    }

    if ("mainTypes" in node) {
      const updatedMain = node.mainTypes.map(
        updateNode
      ) as typeof node.mainTypes;
      return {
        ...node,
        mainTypes: updatedMain,
        checkbox: recalcParent(updatedMain, node.checkbox),
      };
    }

    if ("types" in node) {
      const updatedTypes = node.types.map(updateNode) as typeof node.types;
      return {
        ...node,
        types: updatedTypes,
        checkbox: recalcParent(updatedTypes, node.checkbox),
      };
    }

    if ("subtypes" in node) {
      const updatedSubs = node.subtypes.map(updateNode) as typeof node.subtypes;
      return {
        ...node,
        subtypes: updatedSubs,
        checkbox: recalcParent(updatedSubs, node.checkbox),
      };
    }

    return node;
  };

  return nodes.map(updateNode) as ReportCriteriaAllDocuments[];
}

function propagateDown(node: TreeNode, checked: boolean): TreeNode {
  const newNode = {
    ...node,
    checkbox: { ...node.checkbox, checked },
  };

  if ("documents" in newNode) {
    newNode.documents = newNode.documents.map((d) =>
      propagateDown(d, checked)
    ) as typeof newNode.documents;
  }
  if ("mainTypes" in newNode) {
    newNode.mainTypes = newNode.mainTypes.map((mt) =>
      propagateDown(mt, checked)
    ) as typeof newNode.mainTypes;
  }
  if ("types" in newNode) {
    newNode.types = newNode.types.map((t) =>
      propagateDown(t, checked)
    ) as typeof newNode.types;
  }
  if ("subtypes" in newNode) {
    newNode.subtypes = newNode.subtypes.map((s) =>
      propagateDown(s, checked)
    ) as typeof newNode.subtypes;
  }

  return newNode;
}

function recalcParent<T extends { checkbox: ReportCriteriaChB }>(
  children: T[],
  parentCheckbox: ReportCriteriaChB
): ReportCriteriaChB {
  if (children.length === 0) return parentCheckbox;

  const someChecked = children.some((c) => c.checkbox.checked);
  return { ...parentCheckbox, checked: someChecked }; // Rodzic checked, jeśli choć jedno dziecko checked
}
