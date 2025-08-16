import { useEffect, useState } from "react";
import Select from "react-select";
import {
  customStylesComboBox,
  ComboBoxOption,
} from "../../../../components/ComboBox/ComboBox";
import { TextInput } from "../../../../components/TextInput/TextInput";
import scss from "./SeparateUser.module.scss";

const comboBoxOptions: ComboBoxOption[] = [
  { label: "użytkownik", value: "user" },
  { label: "administrator", value: "admin" },
];

interface SeparateUserProps {
  isNewUser?: boolean;
  user?: User;
  index: number;
  saveEditedUser: (
    isNewUser: boolean,
    user: User,
    onSuccess: () => void
  ) => void;
  handleDeleteUser: (user: User) => void;
  handleIsSaveButtonEnabled: (isNewUser: boolean, user: User) => boolean;
}

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
  saveEditedUser,
  handleDeleteUser,
  handleIsSaveButtonEnabled,
}) => {
  // Domyślny stan
  const [editId, setEditId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [originalUser, setOriginalUser] = useState<User>(user);
  const [selectedUserComboBox, setSelectedUserComboBox] =
    useState<ComboBoxOption | null>(getRoleLabel(editedUser.UserRole) || null);
  //input errors
  const [inputUserSystemNameError, setInputUserSystemNameError] =
    useState<string>("");
  const [inputUserDisplayNameError, setInputUserDisplayNameError] =
    useState<string>("");

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
      setSelectedUserComboBox(getRoleLabel(originalUser.UserRole) || null);
      setInputUserSystemNameError("");
      setInputUserDisplayNameError("");
    }
  };
  const isSaveButtonDisabled = () => {
    if (
      !editedUser.UserSystemName.trim() ||
      !editedUser.UserDisplayName.trim() ||
      inputUserSystemNameError ||
      inputUserDisplayNameError
    )
      return true;
    return handleIsSaveButtonEnabled(isNewUser, editedUser);
  };
  const handleSaveEditedDocument = () => {
    console.log("handleSaveEditedDocument: ", editedUser);
    // Wywołaj saveEditedDocument i przekaż funkcję onSuccess
    saveEditedUser(isNewUser, editedUser, () => {
      setEditId(null); // Aktualizacja stanu po sukcesie
      setOriginalUser(editedUser); // Aktualizacja stanu po sukcesie
    });
  };

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentName = event.target.name as keyof User;
    const currentValue: string | number = event.target.value;
    let errorTextInput = "";
    if (currentName === "UserSystemName") {
      if (!currentValue.trim()) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      setInputUserSystemNameError(errorTextInput);
    }
    if (currentName === "UserDisplayName") {
      if (!currentValue.trim()) {
        errorTextInput = "Musisz wypełnić to pole";
        setInputUserDisplayNameError(errorTextInput);
      } else {
        setInputUserDisplayNameError("");
      }
    }

    setEditedUser((prevDokument) => ({
      ...prevDokument,
      [currentName]: currentValue,
    }));
    console.log(
      "handleInputChange: ",
      currentValue,
      editedUser.UserDisplayName,
      inputUserDisplayNameError
    );
  };
  const handleUserComboBoxChange = (option: ComboBoxOption | null) => {
    if (option) {
      setSelectedUserComboBox(option);
      setEditedUser((prevUser) => ({
        ...prevUser,
        UserRole: option.value as "admin" | "user",
      }));
    }
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
            inputPlaceholder="Nazwa systemowa użytkownika ..."
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
          <Select<ComboBoxOption>
            value={selectedUserComboBox} // <-- zamiast tylko defaultValue
            onChange={(option) =>
              handleUserComboBoxChange(option as ComboBoxOption)
            }
            options={comboBoxOptions} // Użyj danych z hooka
            isSearchable={true}
            placeholder="Wybierz..."
            styles={customStylesComboBox}
            menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
            menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
            menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
            className={scss["select-document-container"]}
            classNamePrefix={scss["select-document"]}
          />
        ) : (
          <>{!isNewUser ? getRoleLabel(user.UserRole)?.label : null}</>
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
                disabled={isSaveButtonDisabled()}
                onClick={() => handleSaveEditedDocument()}
                data-tooltip-id={
                  isSaveButtonDisabled()
                    ? "toolTipSeparateDocumentButtonSave"
                    : undefined
                }
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
                disabled={isSaveButtonDisabled()}
                onClick={() => handleSaveEditedDocument()}
                data-tooltip-id={
                  isSaveButtonDisabled()
                    ? "toolTipSeparateDocumentButtonSave"
                    : undefined
                }
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
                onClick={() => handleDeleteUser(user)}
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
            onClick={() => handleDeleteUser(user)}
          >
            Przywróć
          </button>
        </td>
      )}
    </tr>
  );
};

const getRoleLabel = (role: string | undefined): ComboBoxOption | null => {
  if (!role) return null;
  const option = comboBoxOptions.find((opt) => opt.value === role);
  return option || null;
};

function toolTipSeparateDocumentButtonSave(isNewDocument: boolean) {
  const text = `Przycisk zapisu użytkownika zostanie uaktywniony
  po prawidłowym uzupełnieniu pól formularza ${
    !isNewDocument ? " i wykryciu zmian w użytkowniku" : ""
  }.`;
  return text.replace(/\n/g, "<br/>");
}
