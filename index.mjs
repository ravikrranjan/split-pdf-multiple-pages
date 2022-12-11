import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const splitPdf = async (pathToPdf) => {
	console.debug(`splitPdf::pathToPdf: ${pathToPdf}`);
	const folderName = createFolder(pathToPdf);
	const documentAsBytes = await fs.promises.readFile(pathToPdf);

	// Load your PDFDocument
	const pdfDoc = await PDFDocument.load(documentAsBytes);

	const numberOfPages = pdfDoc.getPages().length;
	console.debug(`splitPdf::numberOfPages: ${numberOfPages}`);
	for (let i = 0; i < numberOfPages; i++) {
		// Create a new "sub" document
		const subDocument = await PDFDocument.create();
		// copy the page at current index
		const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
		subDocument.addPage(copiedPage);
		const pdfBytes = await subDocument.save();
		await writePdfBytesToFile(path.join(folderName, `file-${i + 1}.pdf`), pdfBytes);
	}
};
const writePdfBytesToFile = (fileName, pdfBytes) => {
	return fs.promises.writeFile(fileName, pdfBytes);
};

const createFolder = (pathToPdf) => {
	if (!pathToPdf) return;
	const folderName = path.basename(pathToPdf, ".pdf");
	console.debug(`createFolder::FolderName: ${folderName}`);
	fs.mkdirSync(folderName, { recursive: true });
	return folderName;
};

(async () => {
	await splitPdf("./kehs101.pdf");
})();
