
import styles from './workpage.module.css'

import { emptrl } from '../../components/emptyelement/emptyelement'
import { useState, useEffect } from 'react'

// ======================================================
import { FileReador } from '../../utils/FileReader/FileReader'
import { chart } from '../../components/chart/chart'
import { createCSV } from '../../utils/createFile/createCsv'
//=======================================================

import { toast } from 'sonner'

// =========================================================
import { createPomp } from '../../api/createpomp'
import { getAllPomps } from '../../api/getAllPomps'
import { modelFetch } from '../../api/modelFetch'

// =========================================================

interface Pomp {
    pompId: number,
    name: String
}

export function Workpage(username: { username: string }) {
    const [Load, setLoad] = useState(false)
    const [proc, setproc] = useState<any | null>(null)
    const [prwin, setprwin] = useState(false)


    const asyncFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const res = await FileReador(e) as any[][];
        const file :File = createCSV(res); 
        const modres =  await modelFetch(file); 

        setproc(res)
        setLoad(true)
    }

    useEffect(() => {
        // console.log('proc обновился:', proc)

        if (proc && !prwin) {
            setprwin(true)
        }
    }, [proc])


    const [pomp, setpomp] = useState("");
    const [pomplist, setpomplist] = useState<Pomp[]>([]);
    const getList = async () => {
        try {
            let res = await getAllPomps();
            setpomplist(res || []);
        }
        catch (err) {
            setpomplist([]);
        }
    }
    useEffect(() => { getList() }, []);



    return (
        <>
            <div className={styles.procSpace}>

                <div className={styles.createPomp}>
                    <h2> Добавить помпу в бд</h2>

                    <input
                        placeholder='Введите название'
                        onChange={(e) => { setpomp(e.target.value) }}
                    />

                    <button
                        onClick={async () => {
                            try {
                                let res = await createPomp(pomp)
                                toast.success("Помпа добавлена в бд\n" + JSON.stringify(res));
                                getList();
                            }
                            catch (err) {
                                toast.error("Ошибка при создании");
                            }
                        }}
                    >
                        Создать
                    </button>
                </div>

                <div className={styles.chosenPomp}>
                    <h2>Выбрать помпу из списка</h2>

                    <select>
                        {pomplist.map(pomp => (
                            <option key={pomp.pompId}>{pomp.pompId}. {pomp.name}</option>
                        ))}
                    </select>

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
                    {prwin && proc && chart("Виброускорение (g)", proc[0])}
                    {prwin && proc && chart("Температура (°C)", proc[1])}
                    {prwin && proc && chart("КПД (%)", proc[2])}

                </div>

            </div>
        </>
    )
}