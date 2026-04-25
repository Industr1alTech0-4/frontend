import { backendhost } from "./api-list";

export async function createPomp(name: string) {

    if (name == "") {
        throw new Error("Name is required");
    }

    let mess = {
        Name: name
    }
    let messStr = JSON.stringify(mess);

    try {

        const response = await fetch(`${backendhost}/pomps/register`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: messStr
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