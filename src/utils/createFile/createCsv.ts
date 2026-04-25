export function createCSV(dataByColumns: any[][], 
    headers: string[] = ["vibration_g"	,"temperature_c"	,"power_factor"],
     fileName: string = 'data.csv'): File
{
    // Транспонируем данные
    const rows: any[][] = [headers];
    const maxRows = Math.max(...dataByColumns.map(col => col.length));
    
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const row: any[] = [];
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
            const columnData = dataByColumns[colIndex];
            const cellData = columnData.find(cell => cell.row === rowIndex + 1);
            row.push(cellData ? cellData.value : '');
        }
        rows.push(row);
    }
    
    // Конвертируем в CSV строку
    const csvContent = rows.map(row => 
        row.map(cell => {
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
        }).join(',')
    ).join('\n');
    
    // Создаём File объект
    console.log(csvContent)

    return new File(["\uFEFF" + csvContent], fileName, { 
        type: 'text/csv;charset=utf-8;' 
    });
}