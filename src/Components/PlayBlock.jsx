import React, { useState } from 'react'
import Select from 'antd/es/select'
const { Option } = Select

const PlayBlock = () => {
    const [boardOptions, setBoardOptions] = useState(JSON.parse(localStorage.getItem('cartones') || '[]'))

    return (
        <div>
            <div>
                <label className="text-gray-700 font-semibold px-1 text-sm">Selecciona el cartón a usar</label>
                <Select placeholder='Selecciona una opción'>
                    {boardOptions.map((item, index) => (<Option key={index} value={item.value}>{item.label}</Option>))}
                </Select>
            </div>
        </div>
    )
}

export default PlayBlock