import { defineConfig } from "@hey-api/openapi-ts";

// https://heyapi.dev

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "./api/openapi/strapi-spec.json",
  output: {
    indexFile: false,
    path: "./api/backend",
    format: "prettier",
    lint: "eslint",
  },
  plugins: [
    {
      name: "@hey-api/typescript",
      // Generate JavaScript enums for runtime usage
      enums: "javascript",

      // Use 'unknown' for better type safety (default)
      topType: "unknown",

      // Explicitly configure error type generation
      errors: {
        name: "{{name}}Errors", // Plural: all errors by status code
        error: "{{name}}Error", // Singular: union type
      },

      // Match naming convention across types
      requests: "{{name}}Request",
      responses: {
        name: "{{name}}Responses",
        response: "{{name}}Response",
      },
    },
    {
      name: "zod",
      // Target Zod v3
      compatibilityVersion: 3,

      // Use camelCase for schema names (z prefix added automatically)
      // e.g., zCreateCertificateRequest, zCertificateResponse
      case: "camelCase",

      // Generate Zod schemas for request data
      requests: {
        name: "z{{name}}Request", // zCreateCertificateRequest
      },

      // Generate Zod schemas for response data
      responses: {
        name: "z{{name}}Response", // zCreateCertificateResponse
      },

      // Generate Zod schemas for reusable definitions
      definitions: {
        name: "z{{name}}", // zCertificate, zCourseCategory
      },

      // Don't export from index
      exportFromIndex: false,
    },
    {
      name: "@hey-api/sdk",
      // TREE-SHAKING: Keep asClass false for flat SDK (supports tree-shaking)
      asClass: false,

      // Use the fetch client (no deps)
      client: "@hey-api/client-fetch",

      // Return data directly and throw on error (cleaner API)
      responseStyle: "data",

      // This uses the generated Zod schemas automatically!
      // Copied from backend repo
      validator: {
        request: "zod", // Validate outgoing requests
        //response: 'zod', // Validate incoming responses (disabled to avoid strict validation)
      },

      // Use operationId for consistent naming
      operationId: true,

      // Disable auth in generated code (handle globally in client config)
      auth: false,

      // Don't export from index
      exportFromIndex: false,
    },
  ],
});
