import style from './emptyelement.module.css'
import gost from '../../assets/gost.gif'

export const emptrl = () => {

    return (
        <div className={style.cont}>
            <h2>Загрузите файл</h2>
            <h2>Здесь пока ничего нет</h2>
            <img src={gost}/>
        </div>
    )
}