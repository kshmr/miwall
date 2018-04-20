const sharp = require('sharp');
const fs = require('fs');
const path = require('path')

console.log('------------------------------------------');
console.log('            Image resizing                ');
console.log('------------------------------------------');

const getAllFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    let name = path.join(dir, file);
	name = name.replace(/\\/g , "/");
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
  
  
function run() {
	let allimages = getAllFiles('./assets');
	let newFiles = [];
	allimages.forEach((image) => {
		if(!image.includes("thumb")){
			resizeImage(image);
		}
	});
}


function resizeImage(filePath) {
	const extension = path.extname(filePath);
	const fileWithoutExt = path.basename(filePath, extension);
	const dir = path.dirname(filePath);
    const fileName = "./"+dir+"/"+fileWithoutExt+"_thumb"+extension;
	if(!fs.existsSync(fileName)){
		try {
			sharp(filePath)
				.resize(200, 320, {
					kernel: sharp.kernel.lanczos2,
					interpolator: sharp.interpolator.nohalo
				})
				.crop()
				.toFile(fileName)
				.then(() => {
					console.log('Resized image: ' + fileName);
				})
				.catch((error) => {
					console.log('ERROR (' + fileName + '): ' + error);
				});

		} catch (error) {
			console.log('ERROR: ' + error);
		}
	}else{
		console.log("thumb already exist");
	}
}


run();