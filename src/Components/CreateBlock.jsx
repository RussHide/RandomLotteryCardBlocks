import toast from "react-hot-toast";


const CreateBlock = ({ handleGenerate, downloading, isBusy, saveCurrentBoard }) => {
    return (
        <div>
            <div className="rounded-md border border-gray-300 p-2 mt-2">
                <p className='font-semibold text-gray-500 text-xl text-center'>Generar Cartón</p>
                <button onClick={() => handleGenerate(1)} className='block text-center rounded-md bg-green-400 hover:bg-green-500 cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg my-3'>1 Cartón sencillo</button>
                <button onClick={() => handleGenerate(2)} className='block text-center rounded-md bg-blue-400 hover:bg-blue-500 cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg mb-3'>1 Cartón sencillo doble</button>
                <button onClick={() => handleGenerate(3)} className='block text-center rounded-md bg-orange-400 hover:bg-orange-500 cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg mb-3'>4 Cartónes sencillos</button>
                <button onClick={() => handleGenerate(4)} className='block text-center rounded-md bg-red-400 hover:bg-red-500 cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg '>4 Cartónes sencillos dobles</button>
            </div>
            <button onClick={downloading} disabled={isBusy} className={` ${isBusy ? "bg-gray-400 cursor-not-allowed" : "bg-black"} flex my-2 justify-center items-center text-center rounded-md cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg`} >
                {isBusy && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                    </svg>
                )}
                {isBusy ? "Descargando..." : "Descargar cartón"}
            </button>
            <button
                onClick={() => {
                    const name = prompt("Nombre para este cartón:", "");
                    if (!name) {
                        toast.error('El cartón debe tener un nombre', { position: 'top-center', duration: 3000 })
                        return
                    } else {
                        saveCurrentBoard(name);
                    }

                }} className={` ${isBusy ? "bg-gray-400 cursor-not-allowed" : "bg-black"} flex justify-center items-center text-center rounded-md cursor-pointer pulse px-3 w-full py-1 font-semibold text-white text-lg`}>Guardar</button>

        </div>
    )
}

export default CreateBlock