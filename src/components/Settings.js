import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"

const Settings = () => {
  return (
    <div className="d-flex justify-content-center w-100 p-3">

      <div className="d-flex flex-column w-100">
      <h3>Settings (Coming Soon)</h3>
      <div className="d-flex justify-content-center bg-white border border-1" 
      style={{width:"100%", height: "80%"}}>
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Apps</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Workflows</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Integrations</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Users</a>
            </li>
          </ul>
          <div>

          </div>
        </div>

      </div>
        
    </div>
  )
}

export default Settings