import RoleList from "./RoleList"; // split your list into this if needed
import Permissions from "./Permissions/Permissions";
interface Props {
  // Add any props if needed
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
  searchParams: URLSearchParams;
}
const Roles: React.FC<Props> = ({ setSearchParams, searchParams }) => {
  const activeSubTab = searchParams.get("subtab");
  const id = searchParams.get("id");
  if (activeSubTab) return <Permissions id={id} />;

  return <RoleList setSearchParams={setSearchParams} />;
};

export default Roles;
