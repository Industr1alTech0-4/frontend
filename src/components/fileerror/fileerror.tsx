import style from './fileerror.module.css'
import gost2 from '../../assets/gost2.gif'

export const fileerror = () => {
    return (
        <div className={style.cont}>
            <h2>Ошибка при загрузке</h2>
            <img src={gost2}/>
        </div>
    )
}