
import styles from './workpage.module.css'
import { emptrl } from '../../components/emptyelement/emptyelement'
import { useState, useEffect } from 'react'
import { FileReador } from '../../utils/FileReader/FileReader'
import { chart } from '../../components/chart/chart'
import { modelFetch } from '../../api/modelFetch'
import { toast } from 'sonner'
import { createPomp } from '../../api/createpomp'
import { getAllPomps } from '../../api/getAllPomps'
import { createCSV } from '../../utils/createFile/createCsv'
import { Mdres } from '../../components/mdres/mdres'
import { parseLastValue } from '../../utils/parseJSON/parsejson'
import { createRecord } from '../../api/createRecord'
import { createCSVforDB } from '../../utils/createFile/createCSVforDB'

interface Pomp {
    pompId: number,
    name: string
}

export function Workpage() {
    
    const [proc, setProc] = useState<any[][] | null>(null)
    const [rawResponse, setRawResponse] = useState<any>(null)
    const [isModelLoading, setIsModelLoading] = useState(false)

    const [pomp, setPomp] = useState("")
    const [pomplist, setPomplist] = useState<Pomp[]>([])
    const [selectedPompId, setSelectedPompId] = useState<number | null>(null)

    const getList = async () => {
        try {
            let res = await getAllPomps()
            setPomplist(res || [])
            if (res && res.length > 0) {
                setSelectedPompId(res[0].pompId)
            }
        } catch (err) {
            setPomplist([])
        }
    }
    useEffect(() => { getList() }, [])

    const asyncFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const fileData = await FileReador(e) as any[][]
        setProc(fileData)

        setIsModelLoading(true)
        setRawResponse(null)
        try {
            const csvfile = createCSV(fileData)
            const response = await modelFetch(csvfile)

            setRawResponse(response)
        } catch (err) {
            console.error(err)
            toast.error("Ошибка при вызове модели")
            setRawResponse({ error: "Не удалось получить ответ от модели" })
        } finally {
            setIsModelLoading(false)
        }
    }

    const handleSaveToDB = async () => {
        //console.log(selectedPompId)


        if (!selectedPompId) {
            toast.error("Выберите помпу")
            return
        }
        if (!proc) {
            toast.error("Нет данных файла")
            return
        }
        if (!rawResponse) {
            toast.error("Нет ответа от модели")
            return
        }

        toast.loading("Сохранение записи в БД...", { id: "save-record" })

        try {
            // Получаем CSV данные
            const csvfile = createCSVforDB(proc)
            const csvData = await csvfile.text()
           
            console.log(csvData)


            // Парсим ответ модели
            const resultStatus = parseLastValue(rawResponse.machine_status)
            const timeToBreakdown = parseLastValue(rawResponse.time_to_failure_hours)

            //console.log(resultStatus)
            //console.log(timeToBreakdown)

            const recordData = {
                PompId: selectedPompId,
                CsvData: csvData,
                ResultStatus: resultStatus,
                TimeToBreakdown: timeToBreakdown
            };

            console.log("=== ОТПРАВКА ДАННЫХ ===");
            console.log("Данные:", recordData);
            console.log("JSON:", JSON.stringify(recordData));
            console.log("Длина CSV:", recordData.CsvData.length);

            const result = await createRecord(recordData);

            toast.success(`Запись сохранена! StorageId: ${result.storageId}`, {
                id: "save-record",
                duration: 4000
            })
        } catch (err: any) {
            console.error("Ошибка при сохранении:", err)
            toast.error(err.message || "Ошибка при сохранении в БД", {
                id: "save-record",
                duration: 5000
            })
        }
    }

    return (
        <div className={styles.procSpace}>
            <div className={styles.createPomp}>
                <h2>Добавить помпу в бд</h2>
                <input
                    placeholder='Введите название'
                    onChange={(e) => setPomp(e.target.value)}
                />
                <button
                    onClick={async () => {
                        try {
                            let res = await createPomp(pomp)
                            toast.success("Помпа добавлена в бд\n" + JSON.stringify(res))
                            getList()
                        } catch (err) {
                            toast.error("Ошибка при создании")
                        }
                    }}
                >
                    Создать
                </button>
            </div>

            <div className={styles.chosenPomp}>
                <h2>Выбрать помпу из списка</h2>
                <select
                    onChange={(e) => setSelectedPompId(parseInt(e.target.value))}
                    value={selectedPompId || undefined}
                >
                    {pomplist.map(pomp => (
                        <option key={pomp.pompId} value={pomp.pompId}>
                            {pomp.pompId}. {pomp.name}
                        </option>
                    ))}
                </select>

                <button className={styles.green}>
                    <label htmlFor='file'>Загрузить xlsx/csv</label>
                </button>
                <input
                    type='file'
                    id="file"
                    accept=".csv, .xls, .xlsx"
                    onChange={asyncFile}
                    hidden
                />

                {!proc && emptrl()}

                {proc && chart("Виброускорение (g)", proc[0])}
                {proc && chart("Температура (°C)", proc[1])}
                {proc && chart("КПД (%)", proc[2])}

                {rawResponse && <Mdres data={rawResponse} />}

                {rawResponse && (
                    <div className={styles.saveBtnBlock}>
                        <button onClick={handleSaveToDB}>
                            Сохранить в бд
                        </button>
                    </div>
                )}

                {isModelLoading && <div>Обработка модели...</div>}
            </div>
        </div>
    )
}