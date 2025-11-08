export const splitSqlStatements = (sql: string): string[] => {
  const statements: string[] = [];
  let currentStatement = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    const prevChar = sql[i - 1];

    // line comments
    if (!inSingleQuote && !inDoubleQuote && !inBlockComment && char === '-' && nextChar === '-') {
      inLineComment = true;
      currentStatement += char;
      continue;
    }

    if (inLineComment) {
      currentStatement += char;
      if (char === '\n' || char === '\r') {
        inLineComment = false;
      }
      continue;
    }

    // block comments
    if (!inSingleQuote && !inDoubleQuote && !inLineComment && char === '/' && nextChar === '*') {
      inBlockComment = true;
      currentStatement += char;
      i++;
      currentStatement += nextChar;
      continue;
    }

    if (inBlockComment) {
      currentStatement += char;
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        i++;
        currentStatement += nextChar;
      }
      continue;
    }

    // single quotes
    if (char === "'" && !inDoubleQuote && !inLineComment && !inBlockComment) {
      if (inSingleQuote && nextChar === "'") {
        currentStatement += char;
        i++;
        currentStatement += nextChar;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      currentStatement += char;
      continue;
    }

    // double quotes
    if (char === '"' && !inSingleQuote && !inLineComment && !inBlockComment) {
      inDoubleQuote = !inDoubleQuote;
      currentStatement += char;
      continue;
    }

    // semicolons
    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inLineComment && !inBlockComment) {
      currentStatement += char;
      const trimmed = currentStatement.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      currentStatement = '';
      continue;
    }

    currentStatement += char;
  }

  // last statement if it doesn't end with a semicolon
  const trimmed = currentStatement.trim();
  if (trimmed.length > 0) {
    statements.push(trimmed);
  }

  return statements;
};

export const trimStatement = (str: string, maxLength: number, ellipsis: boolean): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + (ellipsis ? '...' : '');
};
