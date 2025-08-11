import { useEffect, useState } from "react";
import { currencyFormater } from "../../../../components/GlobalFunctions/GlobalFunctions";
import scss from "./SeparateUser.module.scss";
import { spacing } from "react-select/dist/declarations/src/theme";
import { TextInput } from "../../../../components/TextInput/TextInput";
import { Tooltip } from "react-tooltip";

interface SeparateUserProps {
  isNewUser?: boolean;
  user?: User;
  index: number;
  // saveEditedDocument: (
  //   isNewDocument: boolean,
  //   document: AllDocumentsName,
  //   onSuccess: () => void
  // ) => void;
  // handleDeleteRestoreDocument: (document: AllDocumentsName) => void;
  // handleIsSaveButtonEnabled: (document: AllDocumentsName) => boolean;
}
// type User = {
//   UserId: number;
//   UserSystemName: string;
//   UserDisplayName: string;
//   UserPassword: string | null;
//   UserRole: "admin" | "user";
//   IsDeleted: 0 | 1;
// };
const defaultUser: User = {
  UserId: 0,
  UserSystemName: "",
  UserDisplayName: "",
  UserPassword: null,
  UserRole: "user",
  IsDeleted: 0,
};

export const SeparateUser: React.FC<SeparateUserProps> = ({
  isNewUser = false,
  user = defaultUser,
  index,
  // saveEditedDocument,
  // handleDeleteRestoreDocument,
  // handleIsSaveButtonEnabled,
}) => {
  // Domyślny stan

  const [editId, setEditId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [originalUser, setOriginalUser] = useState<User>(user);
  //input errors
  const [inputUserSystemNameError, setInputUserSystemNameError] =
    useState<string>("");
  const [inputUserDisplayNameError, setInputUserDisplayNameError] =
    useState<string>("");
  // const [inputTypeNameError, setInputTypeNameError] = useState<string>("");
  // const [inputSubtypeNameError, setInputSubtypeNameError] =
  //   useState<string>("");
  // const [inputPriceError, setInputPriceError] = useState<string>("");

  // Synchronizuj stany z propem document, gdy się zmieni
  useEffect(() => {
    setOriginalUser(user);
    setEditedUser(user);
  }, [user]);

  const handleEditCancelClick = () => {
    if (editId === user.UserId.toString()) {
      setEditId(null);
    } else {
      setEditId(user.UserId.toString());
      setEditedUser(originalUser);
      setInputUserSystemNameError("");
      setInputUserDisplayNameError("");
    }
  };
  const isSaveButtonDisabled = () => {
    // if (
    //   !editedUser.DocumentName.trim() ||
    //   inputUserSystemNameError ||
    //   inputUserDisplayNameError ||
    //   inputTypeNameError ||
    //   inputSubtypeNameError ||
    //   inputPriceError
    // )
    //   return true;
    // return handleIsSaveButtonEnabled(editedUser);
  };
  const handleSaveEditedDocument = () => {
    // // Wywołaj saveEditedDocument i przekaż funkcję onSuccess
    // saveEditedDocument(isNewUser, editedUser, () => {
    //   setEditId(null); // Aktualizacja stanu po sukcesie
    //   setOriginalUser(editedUser); // Aktualizacja stanu po sukcesie
    // });
  };

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // const currentName = event.target.name as keyof AllDocumentsName;
    // const currentValue: string | number = event.target.value;
    // let errorTextInput = "";
    // if (currentName === "DocumentName") {
    //   if (!currentValue.trim()) {
    //     errorTextInput = "Musisz wypełnić to pole";
    //   }
    //   setInputUserSystemNameError(errorTextInput);
    // }
    // if (currentName === "MainTypeName") {
    //   if (!currentValue.trim() && !editedUser.TypeName) {
    //     errorTextInput = "Musisz wypełnić pole MainTypeName";
    //     setInputUserDisplayNameError(errorTextInput);
    //   } else {
    //     setInputUserDisplayNameError("");
    //   }
    // }
    // if (currentName === "TypeName") {
    //   if (currentValue.trim() && !editedUser.MainTypeName) {
    //     errorTextInput = "Musisz wypełnić pole MainTypeName";
    //     setInputUserDisplayNameError(errorTextInput);
    //   } else if (!currentValue.trim() && editedUser.SubtypeName) {
    //     errorTextInput = "Musisz wypełnić pole TypeName";
    //     setInputTypeNameError(errorTextInput);
    //   } else {
    //     setInputUserDisplayNameError("");
    //     setInputTypeNameError("");
    //   }
    // }
    // if (currentName === "SubtypeName") {
    //   if (currentValue.trim() && !editedUser.TypeName) {
    //     errorTextInput = "Musisz wypełnić pole TypeName";
    //     setInputTypeNameError(errorTextInput);
    //   } else {
    //     setInputTypeNameError("");
    //   }
    // }
    // if (currentName === "Price") {
    //   const isValidPrice = /^\d*\.?\d*$/.test(currentValue); // Dopuszcza liczby zmiennoprzecinkowe
    //   if (!currentValue) {
    //     errorTextInput = "Musisz wypełnić to pole";
    //   } else if (currentValue.includes(",")) {
    //     errorTextInput = "Zamiast przecinka użyj kropki";
    //   } else if (!isValidPrice) {
    //     errorTextInput = "Wprowadź poprawną liczbę";
    //   }
    //   setInputPriceError(errorTextInput);
    // }
    // setEditedUser((prevDokument) => ({
    //   ...prevDokument,
    //   [currentName]: currentValue,
    // }));
    // console.log(
    //   "handleInputChange: ",
    //   currentValue,
    //   editedUser.MainTypeName,
    //   inputUserDisplayNameError
    // );
  };

  return (
    <tr
      key={user.UserId}
      onDoubleClick={() => user.IsDeleted === 0 && handleEditCancelClick()}
      className={scss["row-container"]}
    >
      <td className={`${scss["cell"]} `}>
        {String(index + 1).padStart(3, "0")}.
      </td>
      <td
        className={`${scss["cell"]} ${
          user.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        {editId === String(editedUser.UserId) ? (
          <TextInput
            inputName="UserSystemName"
            singleInputValue={editedUser.UserSystemName ?? ""}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Nazwa dokumentu ..."
            singleInputError={inputUserSystemNameError}
            required={true}
            classNameInputContainer={scss["custom-input-container"]}
          />
        ) : (
          <>{user.UserSystemName}</>
        )}
      </td>

      <td
        className={`${scss["cell"]} ${
          user.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        {editId === String(editedUser.UserId) ? (
          <TextInput
            inputName="UserDisplayName"
            singleInputValue={editedUser.UserDisplayName ?? ""}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Wyświetlana nazwa użytkownika ..."
            singleInputError={inputUserDisplayNameError}
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        ) : (
          <>{user.UserDisplayName}</>
        )}
      </td>

      <td
        className={`${scss["cell"]} ${
          user.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        {editId === String(editedUser.UserId) ? (
          <TextInput
            inputName="UserRole"
            singleInputValue={editedUser.UserRole ?? ""}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Uprawnienia użytkownika ..."
            // singleInputError={inputTypeNameError}
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        ) : (
          <>
            {user.UserRole} {user.IsDeleted}
          </>
        )}
      </td>

      {isNewUser ? (
        !editId ? (
          <td
            colSpan={2}
            className={`${scss["cell"]} ${scss["recover-container"]}`}
          >
            <button
              className={scss["edit-button"]}
              onClick={() => handleEditCancelClick()}
            >
              Dodaj nowy
            </button>
          </td>
        ) : (
          <>
            <td className={scss["cell"]}>
              <button
                className={scss["save-button"]}
                // disabled={isSaveButtonDisabled()}
                onClick={() => handleSaveEditedDocument()}
                data-tooltip-id="toolTipSeparateDocumentButtonSave"
                data-tooltip-html={toolTipSeparateDocumentButtonSave(isNewUser)}
              >
                Zapisz
              </button>
            </td>

            <td className={scss["cell"]}>
              <button
                className={scss["cancel-button"]}
                onClick={() => handleEditCancelClick()}
              >
                Anuluj
              </button>
            </td>
          </>
        )
      ) : user.IsDeleted === 0 ? (
        <>
          <td className={scss["cell"]}>
            {!editId ? (
              <button
                className={scss["edit-button"]}
                onClick={() => handleEditCancelClick()}
              >
                Korekta
              </button>
            ) : (
              <button
                className={scss["save-button"]}
                // disabled={isSaveButtonDisabled()}
                onClick={() => handleSaveEditedDocument()}
                // data-tooltip-id={
                //   isSaveButtonDisabled()
                //     ? "toolTipSeparateDocumentButtonSave"
                //     : undefined
                // }
                data-tooltip-html={toolTipSeparateDocumentButtonSave(isNewUser)}
              >
                Zapisz
              </button>
            )}
          </td>

          <td className={scss["cell"]}>
            {!editId ? (
              <button
                className={scss["delete-button"]}
                // onClick={() => handleDeleteRestoreDocument(user)}
              >
                Usuń
              </button>
            ) : (
              <button
                className={scss["cancel-button"]}
                onClick={() => handleEditCancelClick()}
              >
                Anuluj
              </button>
            )}
          </td>
        </>
      ) : (
        <td
          colSpan={2}
          className={`${scss["cell"]} ${scss["recover-container"]}`}
        >
          <button
            className={scss["delete-button"]}
            // onClick={() => handleDeleteRestoreDocument(user)}
          >
            Przywróć
          </button>
        </td>
      )}
    </tr>
  );
};

function toolTipSeparateDocumentButtonSave(isNewDocument: boolean) {
  const text = `Przycisk zapisu dokumentu zostanie uaktywniony
  po prawidłowym uzupełnieniu pól formularza ${
    !isNewDocument ? " i wykryciu zmian w dokumencie" : ""
  }.`;
  return text.replace(/\n/g, "<br/>");
}
