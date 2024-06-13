const fs = require('fs');
const path = require('path');

const sourceDirectoryPath = path.join(__dirname, 'src/files');
const outputDirectoryPath = path.join(__dirname, 'public');
const outputPath = path.join(outputDirectoryPath, 'files.json');

// 确保目标目录存在
if (!fs.existsSync(sourceDirectoryPath)) {
  console.error(`Source directory ${sourceDirectoryPath} does not exist.`);
  process.exit(1);
}

if (!fs.existsSync(outputDirectoryPath)) {
  fs.mkdirSync(outputDirectoryPath);
}

function getFiles(dirPath, parent = '') {
  const files = fs.readdirSync(dirPath);

  return files.flatMap((file) => {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(parent, file);
    const isDirectory = fs.lstatSync(fullPath).isDirectory();

    const fileInfo = {
      id: relativePath,
      name: file,
      description: 'Description for ' + file,
      image: '/path/to/default/image.png',
      category: isDirectory ? 'folder' : 'file',
      path: relativePath,
      parent: parent === '' ? null : parent,
    };

    if (isDirectory) {
      return [fileInfo, ...getFiles(fullPath, relativePath)];
    } else {
      return [fileInfo];
    }
  });
}

const fileList = getFiles(sourceDirectoryPath);

fs.writeFile(outputPath, JSON.stringify(fileList, null, 2), (err) => {
  if (err) {
    return console.error('Unable to write JSON file: ' + err);
  }
  console.log('File list has been generated.');
});
