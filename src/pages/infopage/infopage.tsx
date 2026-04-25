

import style from './infopage.module.css'
import content from './content.docx.md?raw'
import { marked } from 'marked'

export function Infopage () {
    const html = marked(content)
    
    return (
        <div className={style.page}>
            <div 
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: html }} 
        />
        </div>
        
    )
}