export function validString(s: any): boolean {
  return typeof s === "string" && s.trim() !== "";
}
