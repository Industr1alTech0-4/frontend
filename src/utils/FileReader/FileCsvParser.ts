import Papa from 'papaparse';

export async function FileCsvParser(file: File) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as string[][];
                
                if (data.length === 0) {
                    reject(new Error('CSV файл пуст'));
                    return;
                }
                
                const columnCount = data[0].length;
                const dataByColumns: any[][] = Array(columnCount).fill(null).map(() => []);
                
                // Транспонируем данные (строки в колонки)
                for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
                    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                        const value = data[rowIndex][colIndex];
                        
                        if (value && value.trim() !== '') {
                            dataByColumns[colIndex].push({
                                row: rowIndex + 1,
                                value: value.trim()
                            });
                        }
                    }
                }
                
                resolve(dataByColumns);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}