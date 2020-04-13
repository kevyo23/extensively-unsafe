import * as React from "react"
import * as ReactDOM from "react-dom"

import "../styles/popup.css"
import { getExtensionListString } from "../app/background"

class Hello extends React.Component {
    render() {
        return (
            <div className="popup-padded">
                <h1>{ chrome.i18n.getMessage("l10nHello") }</h1>
                    <a href= { getExtensionListString() } 
                        target="_blank" rel="noopener noreferrer"> 
                        View Extensions 
                    </a>
            </div>
        )
    }
}

// --------------

ReactDOM.render(
    <Hello />,
    document.getElementById('root')
)