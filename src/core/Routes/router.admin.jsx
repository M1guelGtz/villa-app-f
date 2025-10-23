export function AppRoutesAdmin() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Routes>
  )
}
