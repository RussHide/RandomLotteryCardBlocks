import { useMemo, useRef, useState } from "react"
import { toPng, toJpeg } from "html-to-image";
import toast, { Toaster } from "react-hot-toast";
import distinctColors from "distinct-colors";
import { SaveCardModal } from "./Components";
import Select from 'antd/es/select'
import CreateBlock from "./Components/CreateBlock";
import PlayBlock from "./Components/PlayBlock";
const { Option } = Select


export const DECK = Object.entries(import.meta.glob("./Images/*.jpg", { eager: true })).map(([path, module]) => {
  const filename = path.split("/").pop().replace(".jpg", "");
  return { id: filename, img: module.default };
});

// Fisher–Yates
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 16 únicas (4x4)
const pick16 = (deck) => {
  if (deck.length < 16) throw new Error("La baraja debe tener al menos 16 cartas.");
  return shuffle(deck).slice(0, 16);
};

// 4x4 doble (duplica índices 5 y 6)
const makeDouble4x4 = (deck) => {
  const b = pick16(deck);
  b[6] = b[5];
  return b;
};

const toGrid4 = (flat16) => {
  const arr = flat16.flat ? flat16.flat() : flat16; // aplana por si acaso
  return [0, 1, 2, 3].map(r => arr.slice(r * 4, r * 4 + 4));
};

// Une 4 cartones (A,B,C,D) en un 8x8
const join8x8 = ([A, B, C, D]) => {
  const gA = toGrid4(A), gB = toGrid4(B), gC = toGrid4(C), gD = toGrid4(D);
  const top = gA.map((row, r) => [...row, ...gB[r]]);
  const bottom = gC.map((row, r) => [...row, ...gD[r]]);
  return [...top, ...bottom];
};

/** 1=simple 4x4, 2=doble 4x4, 3=4 simples (8x8), 4=4 dobles (8x8) */
const generateBoard = (option, deck = DECK) => {
  console.log(option);
  const opt = Number(option);
  switch (opt) {
    case 1: return pick16(deck);
    case 2: return makeDouble4x4(deck);
    case 3: return join8x8([pick16(deck), pick16(deck), pick16(deck), pick16(deck)]);
    case 4: return join8x8([makeDouble4x4(deck), makeDouble4x4(deck), makeDouble4x4(deck), makeDouble4x4(deck)]);
    default: return pick16(deck);
  }
};

const App = () => {
  const [marked, setMarked] = useState([]);

  const toggleMark = (i) => {
    setMarked((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    );
  };

  const [board, setBoard] = useState([]);
  const nodeRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [modals, setModals] = useState(false)
  const [mode, setMode] = useState(1)

  const handleGenerate = (opt) => {
    const board = generateBoard(opt);
    setBoard(board);
  };
  const is8x8 = Array.isArray(board?.[0]);
  const flat = useMemo(() => (is8x8 ? board.flat() : board), [board, is8x8]);

  // 4 colores: TL, TR, BL, BR (top-left, top-right, bottom-left, bottom-right)
  const quadColors = useMemo(() => {
    if (!is8x8) return [];
    const palette = distinctColors({
      count: 4,
      lightMin: 70,
      lightMax: 90,
      chromaMin: 0.2,
    });
    return palette.map(c => c.hex());
  }, [is8x8]);

  // Devuelve el color según el índice i en la grilla 8x8
  const getQuadBg = (i) => {
    if (!is8x8 || quadColors.length < 4) return undefined;
    const row = Math.floor(i / 8);
    const col = i % 8;
    // 0: TL, 1: TR, 2: BL, 3: BR
    const q = (row < 4 ? 0 : 2) + (col < 4 ? 0 : 1);
    return quadColors[q];
  };


  const downloading = async () => {
    if (!nodeRef.current) {
      toast.error('Debes tener un carton generado', { position: 'top-center', duration: 3000 })
      return
    };
    try {
      setStatus("rendering");
      const dataUrl = await toPng(nodeRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fff",
      });
      setStatus("downloading");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "carton.png";
      a.click();
    } catch (e) {
      console.error(e);
      // opcional: muestra un toast/error
    } finally {
      setStatus(null);
    }
  };
  const isBusy = status !== null;





  // --- Helpers para serializar / deserializar ---
  // Convierte el board actual (4x4 o 8x8) a "1,4,5,6|2,3,11,23|..."
  const serializeBoard = (board) => {
    const rows = Array.isArray(board?.[0]) ? board : toGrid4(board);
    return rows.map(row => row.map(cell => cell.id).join(',')).join('|');
  };

  // Para reconstruir más tarde: de "..." -> array 4x4 u 8x8 de objetos del DECK
  const idMap = Object.fromEntries(DECK.map(c => [c.id, c]));
  const parseOrder = (orderStr) => {
    const rows = orderStr.split('|').map(r => r.split(',').map(id => idMap[id]).filter(Boolean));
    // si tiene 8 filas es 8x8, si tiene 4 es 4x4
    return rows;
  };

  const changeToPlay = (mode) => {
    setMode(mode)
    setBoard([])
    setMarked([])
  }

  // Guarda en localStorage bajo la clave "cartones" como [{name, order}]
  const saveCurrentBoard = (name = "Cartón sin nombre") => {
    if (!board?.length) {
      toast.error('Genera un cartón primero', { position: 'top-center', duration: 3000 });
      return;
    }
    const currentBoards = JSON.parse(localStorage.getItem('cartones') || '[]')
    const boardWithNameExists = currentBoards.filter(brd => brd.label === name)
    console.log(boardWithNameExists);
    if (boardWithNameExists.length !== 0) {
      toast.error('Ya hay un cartón guardado con ese nombre', { position: 'top-center', duration: 3000 });
      return;
    }
    const order = serializeBoard(board);
    const prev = JSON.parse(localStorage.getItem('cartones') || '[]');
    prev.push({ label: name, value: order });
    localStorage.setItem('cartones', JSON.stringify(prev));
    toast.success('Cartón guardado', { position: 'top-center' });
  };

  return (
    <div className={`p-3 ${is8x8 ? "min-h-screen" : "h-screen"} max-h-fit`}>
      <Toaster />
      {modals && (<SaveCardModal closeModals={() => setModals(false)} modals={modals} />)}
      <div className='bg-white rounded-md shadow-md h-full flex justify-center items-center p-3 space-x-4'>
        <div className="w-[80%] h-full border rounded-md border-gray-300 flex items-center justify-center py-2">
          {!board.length ? (
            <p className="font-semibold text-gray-500 text-2xl">Selecciona una opción para generar el cartón</p>
          ) : (
            <div ref={nodeRef} className={`grid rounded-md overflow-hidden ${!is8x8 && "gap-1"}`} style={{ gridTemplateColumns: `repeat(${is8x8 ? 8 : 4}, minmax(0, 1fr))`, width: is8x8 ? 800 : 400, }}>
              {flat.map((cell, i) => (
                <div key={i} onClick={() => toggleMark(i)} className="aspect-auto relative flex items-center justify-center p-1 cursor-pointer" style={{ backgroundColor: getQuadBg(i) }}>
                  <img src={cell.img} alt={cell.id} className="w-full h-full object-contain " draggable={false} />
                  {marked.includes(i) && (
                    <span className="absolute text-red-700 text-7xl font-bold select-none border-white">X</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='w-[20%] h-fit '>
          <div className="w-full flex justify-center items-center gap-4">
            <div onClick={() => changeToPlay(1)} className={`${mode === 1 && 'bg-green-500'} bg-green-300 text-white h-32 w-1/2 rounded-md shadow-md border border-gray-100 hover:bg-green-500 pulse cursor-pointer flex justify-center items-center font-semibold text-2xl `}>Crear</div>
            <div onClick={() => changeToPlay(2)} className={`${mode === 2 && 'bg-blue-500'} bg-blue-300 text-white h-32 w-1/2 rounded-md shadow-md border border-gray-100 hover:bg-blue-500 pulse cursor-pointer flex justify-center items-center font-semibold text-2xl`}>Jugar</div>
          </div>
          {mode === 1 ? <CreateBlock handleGenerate={handleGenerate} downloading={downloading} isBusy={isBusy} saveCurrentBoard={saveCurrentBoard} /> : <PlayBlock setBoard={setBoard} parseOrder={parseOrder} />}
        </div>
      </div>
    </div>
  )
}

export default App