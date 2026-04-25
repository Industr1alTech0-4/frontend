import { backendhost } from "./api-list";

export async function modelFetch(file: File) {

    const formData = new FormData();
    formData.append('file', file);

    try {

        const response = await fetch(`${backendhost}/model`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    }
    catch (err) {
        throw err;
    }

}