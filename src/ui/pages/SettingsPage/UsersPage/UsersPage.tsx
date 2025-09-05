import { useState } from "react";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { STATUS } from "../../../../electron/sharedTypes/status";
import { useMainDataContext } from "../../../components/Context/useMainDataContext";
import { useAllUsers } from "../../../hooks/useAllUsers";
import { useAddUser } from "../../../hooks/useAddUser";
import { useUpdateUser } from "../../../hooks/useUpdateUser";
import { useDeleteUser } from "../../../hooks/useDeleteUser";
import { useToggle } from "../../../hooks/useToggle";
import { displayErrorMessage } from "../../../components/GlobalFunctions/GlobalFunctions";
import { ConditionalWrapper } from "../../../components/ConditionalWrapper/ConditionalWrapper";
import { IconInfo } from "../../../components/IconInfo/IconInfo";
import { SeparateUser } from "./SeparateUser/SeparateUser";
import { ModalSelectionWindow } from "../../../components/ModalSelectionWindow/ModalSelectionWindow";
import scss from "./UsersPage.module.scss";

const UsersPage: React.FC = () => {
  const { options } = useMainDataContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Hook do modala
  const {
    isOpenModal: isModalDeleteConfirmOpen,
    openModal: openModalDeleteConfirm,
    closeModal: closeModalDeleteConfirm,
  } = useToggle();

  // Hook do pobierania wszystkich użytkowników
  const { data: dataUsers, loading: loadingUsers, getAllUsers } = useAllUsers();

  //Hook do edytowania użytkowników
  const { addUser } = useAddUser();

  // Hook do edytowania użytkowników
  const { updateUser } = useUpdateUser();

  // Hook do usuwania użytkowników
  const { deleteUser } = useDeleteUser();

  const handleIsSaveButtonEnabled = (isNewUser: boolean, editUser: User) => {
    if (!dataUsers || !Array.isArray(dataUsers)) {
      return false; // Zwraca false, jeśli dataUsers jest undefined, null lub nie jest tablicą
    }
    return dataUsers.some((user) => {
      // Sprawdzanie UserSystemName
      const userSystemName = user.UserSystemName?.trim().toLowerCase() ?? "";
      const editUserSystemName =
        editUser.UserSystemName?.trim().toLowerCase() ?? "";

      // Sprawdzanie UserDisplayName
      const userDisplayName = user.UserDisplayName?.trim().toLowerCase();
      const editUserDisplayName =
        editUser.UserDisplayName?.trim().toLowerCase();

      // Sprawdzanie TypeName
      const userPassword = user.UserPassword?.trim().toLowerCase() || null; // Konwersja "" na null
      const editUserPassword =
        editUser.UserPassword?.trim().toLowerCase() || null; // Konwersja "" na null

      // Sprawdzanie SubtypeName
      const userRole = !isNewUser ? user.UserRole?.trim().toLowerCase() : "";
      const editUserRole = !isNewUser
        ? editUser.UserRole?.trim().toLowerCase()
        : "";

      return (
        userSystemName == editUserSystemName &&
        userDisplayName == editUserDisplayName &&
        userPassword == editUserPassword &&
        userRole == editUserRole
      );
    });
  };

  // Zapisanie edytowanego dokumentu
  const handleSaveEditedUser = async (
    isNewUser: boolean,
    user: User,
    onSuccess: () => void
  ) => {
    if (user.UserSystemName === "konrad.konik") return;
    const successText = `${isNewUser ? "Nowy" : "Edytowany"} użytkownik ${
      user.UserDisplayName
    } został pomyślnie zapisany.`;
    const errorText = `Nie udało się zapisać ${
      isNewUser ? "nowego" : "edytowanego"
    } użytkownika ${user.UserDisplayName}.`;

    try {
      const result = await (isNewUser ? addUser(user) : updateUser(user));
      if (result.status === STATUS.Success) {
        getAllUsers(); // Odśwież listę użytkowników
        toast.success(`${successText}`);
        onSuccess(); // Wywołaj funkcję zwrotną po sukcesie
      } else {
        displayErrorMessage(
          "UsersPage",
          "handleSaveEditedUser",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage("UsersPage", "handleSaveEditedUser", err);
    }
  };

  const handleSetSelectedUser = (user: User) => {
    setSelectedUser(user);
    openModalDeleteConfirm();
  };

  const handleDeleteUser = async () => {
    closeModalDeleteConfirm();
    if (!selectedUser?.UserId) return;
    if (selectedUser.UserSystemName === "konrad.konik") return;
    const successText = `Użytkownik ${selectedUser.UserDisplayName} został pomyślnie usunięty!`;
    const errorText = `Nie udało się usunąć użytkownika ${selectedUser.UserDisplayName}.`;

    try {
      const result = await deleteUser(selectedUser.UserId);

      if (result.status === STATUS.Success) {
        getAllUsers(); // Odśwież listę użytkowników
        toast.success(successText);
      } else {
        displayErrorMessage(
          "DocumentsPage",
          "handleDeleteUser",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage("DocumentsPage", "handleDeleteUser", err);
    }
  };

  return (
    <div className={scss["usersPage-main-container"]}>
      <IconInfo
        tooltipId="tooltip-usersPage"
        tooltipInfoTextHtml={tooltipInfoUsersPage()}
      />
      <ConditionalWrapper isLoading={loadingUsers}>
        <div>
          <table
            className={`${scss["table"]} ${
              scss[`${options.fontSize.en}-font`]
            }`}
          >
            <thead>
              <tr>
                <th>Lp.</th>
                <th>Nazwa systemowa użytkownika</th>
                <th>Wyświetlana nazwa użytkownika</th>
                <th>Rola użytkownika</th>
                <th colSpan={2}>Akcje</th>
              </tr>
            </thead>
            <tbody>
              <SeparateUser
                isNewUser={true}
                index={-1}
                saveEditedUser={handleSaveEditedUser}
                handleDeleteUser={handleDeleteUser}
                handleIsSaveButtonEnabled={handleIsSaveButtonEnabled}
              />
              {dataUsers &&
                dataUsers.length > 0 &&
                dataUsers.map((user, index) => {
                  return (
                    <SeparateUser
                      key={user.UserId}
                      user={user}
                      index={index}
                      saveEditedUser={handleSaveEditedUser}
                      handleDeleteUser={handleSetSelectedUser}
                      handleIsSaveButtonEnabled={handleIsSaveButtonEnabled}
                    />
                  );
                })}
            </tbody>
          </table>
          <div className={scss["maintable-footer-container"]}></div>
        </div>
      </ConditionalWrapper>
      <ModalSelectionWindow
        closeModalSelectionWindow={closeModalDeleteConfirm}
        closeModalAddInvoice={() => {}}
        resetFormAddInvoice={() => {}}
        isModalSelectionWindowOpen={isModalDeleteConfirmOpen}
        confirmDeleteFunction={handleDeleteUser}
        titleModalSelectionWindow={`Czy na pewno chcesz usunąć użytkownika\n ${selectedUser?.UserDisplayName}?`}
      />
      <Tooltip
        id="toolTipSeparateDocumentButtonSave"
        className={scss["tooltip"]}
      />
    </div>
  );
};
export default UsersPage;

function tooltipInfoUsersPage() {
  const text = `Strona użytkowników.
  Przycisk "Dodaj nowy" umożliwia dodanie nowego użytkownika.
  Przycisk "Edytuj" umożliwia edycję istniejącego użytkownika.
  Przycisk "Usuń" umożliwia usunięcie użytkownika.
  Przycisk "Zapisz" umożliwia zapisanie nowego lub edytowanego użytkownika.
  UWAGA! Nazwy systemowe użytkowników nie mogą się powtarzać.`;

  return text.replace(/\n/g, "<br/>");
}
