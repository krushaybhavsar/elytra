export default interface DataSource {
  getSupportedDatabases(): Promise<string[]>;
}
