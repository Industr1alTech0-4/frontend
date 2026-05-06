// api/modelFetch.ts
import { backendhost } from "./api-list";

export async function modelFetch(file: File) {
    const formData = new FormData();
    formData.append('file', file); // Ключ должен быть 'file' - как ожидает бэкенд
    
    try {
        const response = await fetch(`${backendhost}/model`, { // URL должен соответствовать маршруту на бэкенде
            method: 'POST',
            body: formData,
            // НЕ ставьте Content-Type! Браузер установит его автоматически с boundary
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Ошибка при отправке файла:', err);
        throw err;
    }
}