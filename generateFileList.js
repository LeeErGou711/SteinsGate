const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/files');
const outputPath = path.join(__dirname, 'public', 'files.json');

function getFiles(dirPath, parent = null) {
  const files = fs.readdirSync(dirPath);

  return files.flatMap((file) => {
    const fullPath = path.join(dirPath, file);
    const isDirectory = fs.lstatSync(fullPath).isDirectory();

    const fileInfo = {
      id: fullPath,
      name: file,
      description: 'Description for ' + file,
      image: '/path/to/default/image.png',
      category: isDirectory ? 'folder' : 'file',
      parent: parent,
    };

    if (isDirectory) {
      return [fileInfo, ...getFiles(fullPath, file)];
    } else {
      return [fileInfo];
    }
  });
}

const fileList = getFiles(directoryPath);

fs.writeFile(outputPath, JSON.stringify(fileList, null, 2), (err) => {
  if (err) {
    return console.error('Unable to write JSON file: ' + err);
  }
  console.log('File list has been generated.');
});
