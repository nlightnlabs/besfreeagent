import React from 'react'

const NavigationElements = () => {

    const elements = [
        {id: "backButton", name: "backButton", label:"Back", className:"btn btn-outline-secondary", onClick: "handleSubmit"},
        {id: "nextButton", name: "nextButton", label:"Next", className:"btn btn-primary", onClick: "handleSubmit"}
    ]

  return (
    <div className="btn-group">
        {elements.map((item,index)=>(
            <button
                id={item.id}
                name={item.name}
                className={item.className}
            >
                {item.label}
            </button>
        ))}
    </div>
  )
}

export default NavigationElements