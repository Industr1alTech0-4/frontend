// downloadCSV.ts
export function downloadCSV(csvData: string, fileName: string = 'data.csv'): void {
    try {
        // Добавляем BOM для поддержки UTF-8
        const blob = new Blob(["\uFEFF" + csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Очищаем URL объект и удаляем ссылку
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        }, 100);
    } catch (error) {
        console.error('Ошибка при скачивании CSV:', error);
    }
}