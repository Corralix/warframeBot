// let allIconsList = [];

// const iconAssetsPath = ('assets/icons');
// fs.readdir(iconAssetsPath, (err, files) => {
//     if (err) {
//         console.error('Error reading the folder:', err);
//         return;
//     }

//     // Filter only files (exclude directories)
//     const fileNames = files.filter(file => {
//         const filePath = path.join(iconAssetsPath, file);
//         return fs.statSync(filePath).isFile();
//     });

//     fileNames.forEach(fileName => {
//         let tempAttachment = new AttachmentBuilder(`assets/icons/${fileName}`);
//         allIconsList.push(tempAttachment);

//     })
// });