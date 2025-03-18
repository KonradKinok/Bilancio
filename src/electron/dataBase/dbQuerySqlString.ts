export function getTableDictionaryDocumentsSqlString() {
    return `SELECT * FROM DictionaryDocuments`;
};

// Pobierz wszystkie nazwy dokumentów 
export function getAllDocumentsNameSqlString():string {
  return `SELECT
  dd.DocumentName AS DocumentName,
    mt.MainTypeName AS MainTypeName,
    t.TypeName AS TypeName,
    st.SubtypeName AS SubtypeName
FROM
    DictionaryDocuments dd
    LEFT JOIN DictionaryDocuments_MainType dmt ON dd.DocumentId = dmt.DocumentId
    LEFT JOIN DictionaryMainType mt ON dmt.MainTypeId = mt.MainTypeId
    LEFT JOIN DictionaryMainType_DictionaryType mtdt ON mt.MainTypeId = mtdt.MainTypeId
    LEFT JOIN DictionaryType t ON mtdt.TypeId = t.TypeId
    LEFT JOIN DictionaryType_DictionarySubtype tds ON t.TypeId = tds.TypeId
    LEFT JOIN DictionarySubtype st ON tds.SubtypeId = st.SubtypeId
ORDER BY
    dd.DocumentName,
    mt.MainTypeName,
    t.TypeName,
    st.SubtypeName;`;
}