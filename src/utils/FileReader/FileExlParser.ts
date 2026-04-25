import ExcelJS from 'exceljs'

export async function FileExlParser(file: File) {
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    
    const worksheet = workbook.worksheets[0];
    
    if (!worksheet) {
        console.error('Worksheet не найден');
        return;
    }
    
    const columnCount = worksheet.columnCount;
    const dataByColumns: any[][] = [];
    

    for (let col = 1; col <= columnCount; col++) {
        const columnData: any[] = [];
        
        for (let row = 1; row <= worksheet.rowCount; row++) {
            const cell = worksheet.getCell(row, col);
            const value = cell.value;
            
            if (value !== null && value !== undefined) {
                columnData.push({
                    row,
                    value: value.toString()
                });
            }
        }
        
        dataByColumns.push(columnData);
    }
    

    return dataByColumns;
}