import './header.module.css'
import { useNavigate } from 'react-router-dom'

export function Header ({firstLink, secondLink, thirdLink} : { 
    firstLink: string; 
    secondLink: string; 
    thirdLink: string;
})  {
    const navigate = useNavigate()

    return (
        <header>
            <nav>
                <button
                    onClick={() => { navigate(`${firstLink}`) }}
                >
                    Информация
                </button>

                <button
                    onClick={() => { navigate(`${secondLink}`) }}
                >
                    Обработка
                </button>

                <button
                    onClick={() => { navigate(`${thirdLink}`) }}
                >
                    История
                </button>

            </nav>
        </header>
    )
}