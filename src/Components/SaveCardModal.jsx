import { useState } from "react"
import Modal from 'antd/es/modal'
import toast from "react-hot-toast";

const SaveCardModal = ({ closeModals, modals, getData, action }) => {
    const [isLoading, setIsLoading] = useState(false)

    const btnSubmit = async () => {
        /*   const validateFields = Object.values(category).every(value => value !== '' && value !== undefined && value !== null);
          if (!validateFields && toast.error('Se deben completar los campos', { position: 'top-right', duration: 2500 })) return;
          await controlCategory(setIsLoading, action, category)
          await getData();
          closeModals(); */
    };

    return (
        <Modal footer={[
            <div key={1} className="flex justify-around items-center p-3">
                <button disabled={isLoading} onClick={closeModals} className="pulse mr-1 bg-red-400 hover:bg-red-600 text-white px-8 md:px-14 py-2 rounded-xl font-semibold">Cancelar</button>
                <button className="pulse bg-green-400 hover:bg-green-600 text-white px-8 md:px-14 py-2 rounded-xl font-semibold " onClick={btnSubmit}>Confirmar</button>
            </div>
        ]} className="md:min-w-fit" open={modals} onOk={btnSubmit} onCancel={closeModals}>
            <div className="flex flex-col items-center " >
                <h2 className="text-3xl font-semibold mb-2 text-center text-gray-800 ">Guardar Cartón</h2>
                <div className="h-1 w-40 bg-blue-400 rounded  mb-4"></div>
            </div>
            <div className="flex justify-around items-center w-full ">
                {/*  <CustomInput setData={setCategory} data={category} keyName='label' placeholder='Escriba el nombre de la categoria' label='Nombre' /> */}
            </div>
        </Modal>
    )
}

export default SaveCardModal