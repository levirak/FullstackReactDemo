import { SearchPage } from "./components/SearchPage";
import { UserManagement } from "./components/UserManagement";

export default [
  {
    index: true,
    element: <SearchPage />
  },
  {
    path: "/manage-users",
    element: <UserManagement />,
  },
] as const;
