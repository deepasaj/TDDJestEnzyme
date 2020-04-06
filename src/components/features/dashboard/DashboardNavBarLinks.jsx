import React from 'react'
import { useHistory } from 'react-router-dom'
import { useFeaturePermission } from './hooks'

const DashboardNavBarLinks = () => {
    const history = useHistory()
    const [hasReadAccess] = useFeaturePermission()

    const clickHandler = (e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href')
        if (href) history.push(href);
    }

    return hasReadAccess && (
        <div id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a className="nav-link" href="/dashboard" onClick={clickHandler}>Dashboard</a>
                </li>
            </ul>
        </div>
    )
}

export default DashboardNavBarLinks