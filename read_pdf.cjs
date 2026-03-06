const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('./public/resume.pdf');
let parseFunc = typeof pdf === 'function' ? pdf : (pdf.default || pdf.pdfParse);

if (typeof parseFunc !== 'function') {
    console.log("Exported keys:", Object.keys(pdf));
} else {
    parseFunc(dataBuffer).then(function (data) {
        console.log(data.text);
    }).catch(function (error) {
        console.error(error);
    });
}
