import { backendhost } from "./api-list";

interface CreateRecordData {
    PompId: number;
    CsvData: string;
    ResultStatus: string;
    TimeToBreakdown: string;
}

export async function createRecord(data: CreateRecordData) {
    if (!data.PompId) throw new Error("PompId is required");
    if (!data.CsvData) throw new Error("CsvData is required");
    if (!data.ResultStatus) throw new Error("ResultStatus is required");
    if (!data.TimeToBreakdown) throw new Error("TimeToBreakdown is required");

    const messStr = JSON.stringify(data);

    try {
        const response = await fetch(`${backendhost}/story/add`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: messStr
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json()
    }
    catch (err) {
        throw err;
    }
}