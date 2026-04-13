
import styles from './workpage.module.css'
import { workheader } from '../../components/workheader/workheader'
import { emptrl } from '../../components/emptyelement/emptyelement'
// import { fileerror } from '../../components/fileerror/fileerror'
import { useState, useEffect } from 'react'

import { FileReador } from '../../utils/FileReader/FileReader'
import { FileParser } from '../../utils/FileReader/FileParser'
import { chart } from '../../components/chart/chart'

export function Workpage(username: string) {
    const [Load, setLoad] = useState<File | null>(null)
    const [proc, setproc] = useState<any | null>(null)  
    const [prwin, setprwin] = useState(false)

    useEffect(() => {
        if (Load === null) {
            setprwin(false)
            setproc(null)
        } else {
            const parseFile = async () => {
                const result = await FileParser(Load)
                setproc(result)
                // console.log('Результат парсинга:', result)
            }
            parseFile()
        }
    }, [Load])

    useEffect(() => {
        // console.log('proc обновился:', proc)
        
        if (proc && !prwin) {
            setprwin(true)
        }
    }, [proc])

    const asyncFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = await FileReador(e)
        setLoad(file)
    }

    return (
        <>
            {workheader("/work", "/story", `${username}`)}

            <div className={styles.procSpace}>
                <button className={styles.green}>
                    <label htmlFor='file'>
                        Загрузить xlsx/csv
                    </label>
                </button>
                <input
                    type='file'
                    id="file"
                    accept=".csv, .xls, .xlsx" 
                    onChange={asyncFile}
                    hidden
                />

                {!prwin && emptrl()}
                {prwin && proc && chart("Время работы помпы (сек)", proc[0])}  
                {prwin && proc && chart("Виброускорение (g)", proc[1])}  
                {prwin && proc && chart("Температура (°C)", proc[2])}  
                {prwin && proc && chart("КПД (%)", proc[3])}  
            </div>
        </>
    )
}