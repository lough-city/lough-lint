import fs from 'fs';

/**
 * 删除目录或文件
 * @param removePath 删除路径
 */
export const removeDirOrFileSync = (removePath: string) => {
  if (!fs.existsSync(removePath)) return false;

  fs.rmSync(removePath);

  return true;
};

/**
 * 复制文件
 * @param fromPath 源文件路径
 * @param toPath 复制到路径
 * @param transform 可选 - 处理转换内容函数
 */
export const copyFileSync = (fromPath: string, toPath: string, transform?: (v: string) => string) => {
  if (!fs.existsSync(fromPath)) return false;

  let writeContent = fs.readFileSync(fromPath, { encoding: 'utf8' });

  if (transform) writeContent = transform(writeContent);

  if (fs.existsSync(toPath)) removeDirOrFileSync(toPath);

  fs.writeFileSync(toPath, writeContent, 'utf8');

  return true;
};
