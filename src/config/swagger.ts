import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yamljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specPath = path.join(__dirname, "../docs/openapi.yaml");

export function loadOpenApiSpec(): object {
  return YAML.load(specPath) as object;
}
