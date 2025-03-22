import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import scss from "./MainTable.module.scss";
export const MainTable: React.FC = () => {
  const { data } = useAllDocumentsName();

  console.log(data);
  return (
    <div className={scss[""]}>
      <h2>Main Table</h2>
      <ul className={scss[""]}>
        {data && data.length > 0 ? (
          data.map(
            ({ DocumentName, MainTypeName, TypeName, SubtypeName }, index) => (
              <li key={index}>
                {DocumentName}
                {MainTypeName}
                {TypeName}
                {SubtypeName}
              </li>
            )
          )
        ) : (
          <li>No data</li>
        )}
      </ul>
      <table>
        <thead>
          <tr>
            {data &&
              data.length > 0 &&
              data.map(
                (
                  { DocumentName, MainTypeName, TypeName, SubtypeName },
                  index
                ) => (
                  <th key={index}>
                    <p>{DocumentName}</p>
                    <p>{MainTypeName}</p>
                    <p>{TypeName}</p>
                    <p>{SubtypeName}</p>
                  </th>
                )
              )}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};
