import UserList from "./UserList";

export default function CustomerList() {
  return (
    <UserList
      title="Quan ly Customer"
      icon="bi-person"
      roles={["customer"]}
      defaultRole="customer"
      roleOptions={["customer"]}
      createLabel="Them customer"
    />
  );
}
