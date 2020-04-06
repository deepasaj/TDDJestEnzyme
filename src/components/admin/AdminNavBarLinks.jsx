import React from 'react'
import { useHistory } from 'react-router-dom';
import { useIsAdmin } from 'store/store'

const AdminNavBarLinks = () => {
  const isAdmin = useIsAdmin()
  const history = useHistory()

  const clickHandler = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href')
    if (href) history.push(href);
  }

  return isAdmin && (
    <div className="dropdown" style={{ paddingRight: '2px' }}>
      <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Admin&nbsp;
      </button>
      <div className="dropdown-menu" aria-labelledby="userDropDown">
        <a className="dropdown-item" href="/admin/role_management" onClick={clickHandler}>Role Management</a>
      </div>
    </div>
  )
}

export default AdminNavBarLinks