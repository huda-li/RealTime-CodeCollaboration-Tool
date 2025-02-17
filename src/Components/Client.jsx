import React from 'react'

const Client = ({username}) => {
  return (
    <div  className="user-card d-flex align-items-center">
        <div className="avatar">C</div>
        <span className="ms-3 fw-bold">{username}</span>
    </div>
  )
}

export default Client
