import React from 'react'
import { useHistory } from 'react-router-dom'
import { useFeaturePermission } from './hooks'

const InventoryNavBarLinks = () => {
  const history = useHistory()
  const [hasReadAccess, hasWriteAccess] = useFeaturePermission()

  const clickHandler = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href')
    if (href) history.push(href);
  }

  return hasReadAccess && (
    <div className="dropdown" style={{ paddingRight: '2px' }}>
      <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Inventory&nbsp;
      </button>
      <div className="dropdown-menu" aria-labelledby="userDropDown">
        {
          hasWriteAccess && (
            <div>
              <a className="dropdown-item" href="/inventory/bulk" onClick={clickHandler}>Bulk Add Devices</a>
              <div className="dropdown-divider"></div>
            </div>
          )
        }
        <a className="dropdown-item" href="/inventory/manage" onClick={clickHandler}>
          {hasWriteAccess ? 'View/Manage Inventory' : 'View Inventory'}
        </a>
      </div>
    </div>
  )
}

export default InventoryNavBarLinks