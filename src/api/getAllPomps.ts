import { backendhost } from "./api-list";

export async function getAllPomps() {
    try {

        const response = await fetch(`${backendhost}/pomps/all`, {
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