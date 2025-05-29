import prettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/*", "src/**/*.d.ts", "*.js", "*.ts"],
  },

  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  prettierRecommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
