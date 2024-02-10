import fs from 'fs'
import * as pdfjs from 'pdfjs-dist'

export const loadPDF = async (pdfPath, startPage, endPage) => {
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdfDocument = await pdfjs.getDocument(data).promise;

    let content = '';

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      const pdfPage = await pdfDocument.getPage(pageNum);
      const textContent = await pdfPage.getTextContent();
      content = '\n' + content + textContent.items.map(item => item.str).join(' ');
    }

    console.log(content);
    return content;
  } catch (error) {
    console.error(error);
  }
};