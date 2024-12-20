import React from 'react'

const InputField = ({label,type}) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type}/>
    </div>
  )
}

export default InputField;