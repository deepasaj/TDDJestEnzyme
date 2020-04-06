import React from 'react'
import { useHistory } from 'react-router-dom'
import { useFeaturePermission } from './hooks'

const NavBarLinks = () => {
  const history = useHistory()
  const [hasReadAccess, hasWriteAccess] = useFeaturePermission()

  const clickHandler = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href')
    if (href) history.push(href);
  }

  return hasReadAccess && (
    <>
      <div className="dropdown" style={{ paddingRight: '2px' }}>
        <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          Deployments&nbsp;
        </button>
        <div className="dropdown-menu" aria-labelledby="userDropDown">
          {
            hasWriteAccess && (
              <div>
                <a className="dropdown-item" href="/workflow/deploy/group/create" onClick={clickHandler}>Create Deployment Group</a>
                <div className="dropdown-divider"></div>
              </div>
            )
          }
          <a className="dropdown-item" href="/workflow/deploy/deployment_groups" onClick={clickHandler}>
            {hasWriteAccess ? "Manage Deployment Groups" : "View Deployment Groups"}
          </a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="/workflow/job" onClick={clickHandler}>
            {hasWriteAccess ? 'View/Manage Jobs' : 'View/Manage Jobs'}
          </a>
        </div>
      </div>
      <div className="dropdown" style={{ paddingRight: '2px' }}>
        <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          Validation&nbsp;
        </button>
        <div className="dropdown-menu" aria-labelledby="userDropDown">
          {
            hasWriteAccess && (
              <div>
                <a className="dropdown-item" href="/workflow/validation" onClick={clickHandler}>Request Device Report</a>
                <div className="dropdown-divider"></div>
              </div>
            )
          }
          <a className="dropdown-item" href="/workflow/job?workflow_type=DA+Validation" onClick={clickHandler}>
            {hasWriteAccess ? 'View/Manage Device Reports' : 'View Device Reports'}
          </a>
        </div>
      </div>
    </>
  )
}

export default NavBarLinks