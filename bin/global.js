#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const { convertFile } = require('../index');
const args = process.argv.slice(2);

if(args.indexOf('--bulk') >= 0){
  let newArgs = args.filter(arg => arg !== '--bulk');
  let sourcePath = newArgs[0];
  let destPath = newArgs[1];
  processFolder(path.resolve(process.cwd(), sourcePath), path.resolve(process.cwd(), destPath));
}
else{
  let sourceFile = args[0];
  let destFile = args[1];
  processFile(sourceFile, destFile);
}

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath , file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });
  return arrayOfFiles;
}

async function processFolder(sourcePath, destPath){
  let allFiles = getAllFiles(path.resolve(process.cwd(), sourcePath));
  for(let i = 0; i < allFiles.length; i++){
    let destFile = allFiles[i].replace(sourcePath, '');
    let destFileParts = destFile.split(/[\\/]/);
    destFileParts.pop();
    mkdirp.sync(path.join(destPath, destFileParts.join('/')));
    await processFile(allFiles[i], path.join(destPath, destFileParts.join('/'), destFile.pop().replace('.svg', '.json')));
    print('\n');
  }
}

function processFile(sourceFile, destFile){
  print('Processing - ' + sourceFile);
  return convertFile(sourceFile, destFile)
  .then(() => {
    clearLine();
    print('Success - ', 'GREEN');
    print(sourceFile + ' -> ' + destFile);
  })
  .catch(err => {
    clearLine();
    print('Failed - ', 'RED');
    print(sourceFile + ' -> ' + destFile);
  });
}

function clearLine(){
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}

function print(content, color){
  if(!color){
    process.stdout.write(content);
  }
  else if(color === 'GREEN'){
    process.stdout.write(['\033[', 92, 'm', content, '\033[0m'].join(''));
  }
  else if(color === 'RED'){
    process.stdout.write(['\033[', 91, 'm', content, '\033[0m'].join(''));
  }
}