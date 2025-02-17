import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster
        position="top-center"
        toastOptions={{
          success: {
            theme:{
              primary: "",
            },
          },
        }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
//arey merse nahi hora ab mera dimag  kzhasraoo soojao mai pagal hogayam hum! soojao ek