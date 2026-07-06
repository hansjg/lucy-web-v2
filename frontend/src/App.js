import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(10,10,12,0.92)",
            border: "1px solid rgba(217,22,54,0.3)",
            color: "#ededed",
            fontFamily: "Manrope, sans-serif",
            fontSize: "13px",
            borderRadius: "14px",
            backdropFilter: "blur(16px)",
          },
        }}
      />
    </div>
  );
}

export default App;
