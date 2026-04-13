import './workheader.module.css'
import prc from '../../assets/profile-circle.svg'
import { useNavigate } from 'react-router-dom'

export const workheader = (firstLink: string, secondLink: string, username: string) => {
    const navigate = useNavigate()

    return (
        <header>
            <nav>
                <button
                    onClick={() => { navigate(`${firstLink}`) }}
                >
                    Обработка
                </button>

                <button
                    onClick={() => { navigate(`${secondLink}`) }}
                >
                    История
                </button>
            </nav>

            <div>
                <h3>
                    {username}
                </h3>
                <img src={prc} />
            </div>

        </header>
    )
}