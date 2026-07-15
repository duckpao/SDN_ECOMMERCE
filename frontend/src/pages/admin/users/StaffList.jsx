import UserList from "./UserList";

export default function StaffList() {
  return (
    <UserList
      title="Quan ly Nhan vien"
      icon="bi-person-badge"
      roles={["staff", "admin"]}
      defaultRole="staff"
      roleOptions={["staff", "admin"]}
      createLabel="Them nhan vien"
    />
  );
}
