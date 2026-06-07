export function adminHeaders(): Record<string, string> {
  const token = localStorage.getItem("adminToken") ?? "";
  return { "x-admin-token": token };
}
