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
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(120,102,168,0.18)",
            color: "#322b3d",
            fontFamily: "Manrope, sans-serif",
            fontSize: "13px",
            borderRadius: "14px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 18px 44px -16px rgba(97,84,140,0.25)",
          },
        }}
      />
    </div>
  );
}

export default App;
