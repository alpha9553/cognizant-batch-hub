import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BatchProvider } from "./context/BatchContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BatchDetail from "./pages/BatchDetail";
import StudentDetail from "./pages/StudentDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BatchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/batch/:id" element={<BatchDetail />} />
            <Route path="/batch/:batchId/student/:studentId" element={<StudentDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
