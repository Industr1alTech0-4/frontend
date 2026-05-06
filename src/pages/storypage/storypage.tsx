import styles from './storypage.module.css'
import { useState, useEffect } from 'react'
import { chart } from '../../components/chart/chart'
import { getAllPomps } from '../../api/getAllPomps'
import { getStoryByID } from '../../api/getStoryById'
import { downloadCSV } from '../../utils/download/downloadCSV'
import { FileReador } from '../../utils/FileReader/FileReader'

interface Pomp {
    pompId: number,
    name: string
}

interface Story {
    storageId: number;
    pompId: number;
    csvData: string;
    resultStatus: string;
    timeToBreakdown: string;
}

export function Storypage() {
    
    const [proc, setProc] = useState<any[][] | null>(null)
    const [isModelLoading, setIsModelLoading] = useState(false)

    const [pomplist, setPomplist] = useState<Pomp[]>([])
    const [selectedPompId, setSelectedPompId] = useState<number | null>(null)
    
    // Состояния для второго селектора
    const [stories, setStories] = useState<Story[]>([])
    const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null)
    const [selectedStoryData, setSelectedStoryData] = useState<Story | null>(null)
    const [isStoriesLoading, setIsStoriesLoading] = useState(false)

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

    // Загрузка историй при изменении выбранной помпы
    useEffect(() => {
        if (selectedPompId) {
            loadStories(selectedPompId)
        }
    }, [selectedPompId])

    const loadStories = async (pompId: number) => {
        setIsStoriesLoading(true)
        try {
            const response = await getStoryByID(pompId)
            setStories(response || [])
            if (response && response.length > 0) {
                setSelectedStoryId(response[0].storageId)
                setSelectedStoryData(response[0])
                // Вызываем функцию для загрузки данных в графики
                await loadCSVDataToGraph(response[0].csvData)
            } else {
                setSelectedStoryId(null)
                setSelectedStoryData(null)
                setProc(null)
            }
        } catch (err) {
            console.error("Ошибка загрузки историй:", err)
            setStories([])
            setSelectedStoryId(null)
            setSelectedStoryData(null)
        } finally {
            setIsStoriesLoading(false)
        }
    }

    // Функция для преобразования CSV строки в формат для графиков
    const loadCSVDataToGraph = async (csvData: string) => {
        setIsModelLoading(true)
        try {
            // Создаем файл из строки CSV
            const blob = new Blob([csvData], { type: 'text/csv' })
            const file = new File([blob], 'data.csv', { type: 'text/csv' })
            
            // Создаем событие как от input
            const fakeEvent = {
                target: {
                    files: [file]
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>
            
            // Вызываем функцию как при загрузке файла
            await asyncFile(fakeEvent)
        } catch (err) {
            console.error("Ошибка загрузки CSV данных:", err)
            setProc(null)
        } finally {
            setIsModelLoading(false)
        }
    }

    // Функция обработки файла (как в вашем примере)
    const asyncFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const fileData = await FileReador(e) as any[][]
        setProc(fileData) 
    }

    // Обработчик изменения выбранной истории
    const handleStoryChange = async (storageId: number) => {
        const selectedStory = stories.find(story => story.storageId === storageId)
        if (selectedStory) {
            setSelectedStoryId(storageId)
            setSelectedStoryData(selectedStory)
            // Загружаем данные в графики при смене истории
            await loadCSVDataToGraph(selectedStory.csvData)
        }
    }

    // Обработчик скачивания CSV
    const handleDownloadCSV = () => {
        if (selectedStoryData && selectedStoryData.csvData) {
            const fileName = `data_${selectedStoryData.storageId}.csv`
            downloadCSV(selectedStoryData.csvData, fileName)
        } else {
            console.warn('Нет данных для скачивания')
        }
    }

    // Функция для получения цвета статуса
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'CRITICAL': return '🔴';
            default: return '🟢';
        }
    }

    return (
        <div className={styles.procSpace}>
           
           <h1>История</h1>

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

                {/* Второй селектор для выбора истории */}
                <h2>Выбрать историю</h2>
                <select
                    onChange={(e) => handleStoryChange(parseInt(e.target.value))}
                    value={selectedStoryId || undefined}
                    disabled={isStoriesLoading || stories.length === 0}
                >
                    {isStoriesLoading ? (
                        <option disabled>Загрузка историй...</option>
                    ) : stories.length === 0 ? (
                        <option disabled>Нет доступных историй</option>
                    ) : (
                        stories.map(story => (
                            <option key={story.storageId} value={story.storageId}>
                                {getStatusColor(story.resultStatus)} История #{story.storageId} - {story.resultStatus} - Время до разрушения: {Math.round(parseFloat(story.timeToBreakdown))} ч.
                            </option>
                        ))
                    )}
                </select>

                {/* Отображение дополнительной информации о выбранной истории */}
                {selectedStoryData && (
                    <div className={styles.storyInfo}>
                        <h3>Информация о состоянии:</h3>
                        <p>Статус: {getStatusColor(selectedStoryData.resultStatus)} {selectedStoryData.resultStatus}</p>
                        <p>Время до разрушения: {Math.round(parseFloat(selectedStoryData.timeToBreakdown))} часов</p>
                    </div>
                )}

                {/* Графики */}
                {proc && proc[0] && chart("Виброускорение (g)", proc[0])}
                {proc && proc[1] && chart("Температура (°C)", proc[1])}
                {proc && proc[2] && chart("КПД (%)", proc[2])}

                {isModelLoading && <div>Загрузка данных...</div>}

                {/* Кнопка скачивания CSV */}
                {selectedStoryData && (
                    <div className={styles.downloadButtonContainer}>
                        <button 
                            onClick={handleDownloadCSV}
                            className={styles.downloadButton}
                        >
                            Скачать CSV
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}