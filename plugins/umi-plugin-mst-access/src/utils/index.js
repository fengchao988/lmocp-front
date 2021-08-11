import fs from 'fs';

export function getScriptPath(filepath) {
  let realFilePath = '';
  if (fs.existsSync(`${filepath}.ts`)) {
    realFilePath = `${filepath}.ts`;
  } else if (fs.existsSync(`${filepath}.js`)) {
    realFilePath = `${filepath}.js`;
  }
  return realFilePath;
}

export function checkIfHasDefaultExporting(filepath) {
  const scriptPath = getScriptPath(filepath);
  if (!scriptPath) {
    return false;
  }

  const fileContent = fs.readFileSync(scriptPath, 'utf8');
  const validationRegExp = /(export\s*default)|(exports\.default)|(module.exports[\s\S]*default)|(module.exports[\s\n]*=)/m;

  return validationRegExp.test(fileContent);
}
