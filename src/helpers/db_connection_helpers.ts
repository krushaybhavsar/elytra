export async function getDbConnectionURL() {
  return await window.dbConnectionAPI.getDbConnectionURL();
}
export async function deleteDbConnection() {
  await window.dbConnectionAPI.deleteDbConnection();
}
export async function hasDbConnection() {
  return await window.dbConnectionAPI.hasDbConnection();
}
