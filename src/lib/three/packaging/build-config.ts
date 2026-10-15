export const passes = [
  "blockout",
  "structural-pass",
  "form-refinement",
  "material-pass",
  "surface-pass",
  "lighting-pass",
  "interaction-pass",
  "optimization-pass",
];
export let buildPass = "optimization-pass";
export function setBuildPass(pass: string) {
  buildPass = passes.includes(pass) ? pass : "optimization-pass";
}
export const at = (pass: string) =>
  passes.indexOf(buildPass) >= passes.indexOf(pass);
