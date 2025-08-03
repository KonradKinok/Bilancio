import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import scss from "./UsersPage.module.scss";
import { useUsers } from "../../../hooks/useUsers";
import { useMainDataContext } from "../../../components/Context/useOptionsImage";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<FieldInfo[]>([]);
  const { data: dataUsers, getUsers } = useUsers();
  const { auth } = useMainDataContext();
  const {
    windowsUserName,
    userDb,
    loading,
    error,
    autoLogin,
    loginFunction,
    logoutFunction,
    windowsUserNameFunction,
  } = auth;
  useEffect(() => {
    const usersTable = displayUsers(dataUsers);
    setUsers(usersTable);
  }, [dataUsers]);

  return (
    <div className={scss[""]}>
      <p>
        UsersPage {windowsUserName?.username} {windowsUserName?.hostname}
      </p>
      <p>User z context: {userDb?.UserDisplayName}</p>
      {dataUsers &&
        dataUsers.length > 0 &&
        dataUsers.map((user, index) => {
          return (
            <div>
              <p>UserSystemName: {user.UserSystemName}</p>
              <p>UserDisplayName: {user.UserDisplayName}</p>
              <p>typeof {typeof user.UserPassword}</p>
            </div>
          );
        })}
      {users &&
        users.length > 0 &&
        users.map((user, index) => {
          return (
            <div>
              <p>
                {user.name}:{" "}
                {user.value != null ? String(user.value) : "brak wartości"}:{" "}
                {user.type}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default UsersPage;
interface FieldInfo {
  name: string;
  value: unknown;
  type: string;
}
function displayUsers(users: User[] | null): FieldInfo[] | [] {
  if (!users || users.length === 0) return [];

  const result: FieldInfo[] = [];
  for (const user of users) {
    for (const [name, value] of Object.entries(user)) {
      result.push({
        name,
        value,
        type: value === null ? "null" : typeof value,
      });
    }
  }
  return result;
}
