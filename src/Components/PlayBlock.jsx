import React, { useState } from 'react'
import Select from 'antd/es/select'
import toast from 'react-hot-toast'
const { Option } = Select

const PlayBlock = ({ setBoard, parseOrder }) => {
    const [boardOptions, setBoardOptions] = useState(JSON.parse(localStorage.getItem('cartones') || '[]'))
    const [selectedBoard, setSelectedBoard] = useState(null)
    console.log(boardOptions);
    console.log(selectedBoard);


    // Ejemplo de cómo restaurar el primero guardado:
    const restoreDeck = () => {
        if (!boardOptions.length) return;
        if (!selectedBoard) {
            toast.error('Debes seleccionar un carton', { position: 'top-center', duration: 3000 })
            return
        }
        const rows = parseOrder(selectedBoard); // 4 o 8 filas
        console.log(rows);

        setBoard(rows.length === 8 ? rows : rows.flat()); 
    };

    return (

        <div>
            <div className='w-full mb-4'>
                <label className="text-gray-700 font-semibold px-1 text-sm text-center block mt-2">Selecciona el cartón a usar</label>
                <Select placeholder='Selecciona una opción' className='w-full' onChange={(value) => setSelectedBoard(value)}>
                    {boardOptions.map((item, index) => (<Option key={index} value={item.value}>{item.label}</Option>))}
                </Select>
            </div>
            <button onClick={restoreDeck} className={`bg-black flex justify-center items-center text-center rounded-md cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg`} >Usar</button >
        </div>
    )
}

export default PlayBlock