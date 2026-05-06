import { backendhost } from "./api-list";

export async function getStoryByID(id: number) {
    try {

        const response = await fetch(`${backendhost}/story/all/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json()
    }
    catch (err) {
        throw err;
    }

}