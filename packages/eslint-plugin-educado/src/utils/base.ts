import { TSESTree } from "@typescript-eslint/types";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

const getStaticStringFromExpression = (
  expression: TSESTree.Expression | TSESTree.JSXEmptyExpression,
): string | null => {
  switch (expression.type) {
    case AST_NODE_TYPES.Literal:
      return typeof expression.value === "string" ? expression.value : "";
    case AST_NODE_TYPES.TemplateLiteral:
      return expression.quasis.map((q) => q.value.cooked).join(" ");
    case AST_NODE_TYPES.BinaryExpression: {
      if (expression.operator !== "+") {
        return "";
      }

      const left = getStaticStringFromExpression(expression.left);
      const right = getStaticStringFromExpression(expression.right);

      if (!left || !right) {
        return null;
      }

      return left + " " + right.trim();
    }
    default:
      return "";
  }
};

export const extractClassString = (
  node: TSESTree.JSXAttribute,
): string | null => {
  const value = node.value;

  if (
    value?.type === AST_NODE_TYPES.Literal &&
    typeof value.value === "string"
  ) {
    return value.value;
  }

  if (value?.type === AST_NODE_TYPES.JSXExpressionContainer) {
    return getStaticStringFromExpression(value.expression);
  }

  return null;
};
