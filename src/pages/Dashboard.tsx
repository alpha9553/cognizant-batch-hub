import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles } from "lucide-react";
import BatchCard from "@/components/BatchCard";
import ExcelUpload from "@/components/ExcelUpload";
import { useBatches, Batch } from "@/context/BatchContext";
import cognizantLogo from "@/assets/cognizant-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { batches, saveBatchesToDatabase, isLoading } = useBatches();
=======
  const { batches, setBatches } = useBatches();
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("coachEmail");
    navigate("/");
  };

  const coachEmail = localStorage.getItem("coachEmail");

<<<<<<< HEAD
  const handleDataParsed = async (newBatches: Batch[]) => {
    await saveBatchesToDatabase(newBatches);
=======
  const handleDataParsed = (newBatches: Batch[]) => {
    setBatches(newBatches);
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7
  };

  return (
    <div className="min-h-screen bg-background page-transition gradient-bg-animated">
      {/* Header */}
      <header className="border-b bg-card/90 backdrop-blur-md shadow-lg animate-fade-in sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={cognizantLogo} alt="Cognizant" className="h-8 floating" />
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Coach Dashboard
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </h1>
              <p className="text-sm text-muted-foreground">{coachEmail}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all card-hover">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading batches...</span>
          </div>
        ) : (
          <>
            <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-3xl font-bold text-foreground mb-2 gradient-text">Your Batches</h2>
              <p className="text-muted-foreground">
                Manage and monitor all your assigned training batches
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <ExcelUpload onDataParsed={handleDataParsed} />
            </div>

            {/* Ongoing Training Batches */}
            <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow" />
                Ongoing Training
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.filter(b => b.status !== "graduated").map((batch, index) => (
                  <BatchCard key={batch.id} batch={batch} index={index} />
                ))}
              </div>
              {batches.filter(b => b.status !== "graduated").length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-dashed border-border">
                  <p>No ongoing training batches</p>
                </div>
              )}
            </div>

            {/* Graduated Batches */}
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-info" />
                Graduated Batches
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.filter(b => b.status === "graduated").map((batch, index) => (
                  <BatchCard key={batch.id} batch={batch} index={index} />
                ))}
              </div>
              {batches.filter(b => b.status === "graduated").length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-dashed border-border">
                  <p>No graduated batches yet</p>
                </div>
              )}
            </div>
          </>
        )}
=======
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-3xl font-bold text-foreground mb-2 gradient-text">Your Batches</h2>
          <p className="text-muted-foreground">
            Manage and monitor all your assigned training batches
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ExcelUpload onDataParsed={handleDataParsed} />
        </div>

        {/* Ongoing Training Batches */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow" />
            Ongoing Training
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.filter(b => b.status !== "graduated").map((batch, index) => (
              <BatchCard key={batch.id} batch={batch} index={index} />
            ))}
          </div>
          {batches.filter(b => b.status !== "graduated").length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-dashed border-border">
              <p>No ongoing training batches</p>
            </div>
          )}
        </div>

        {/* Graduated Batches */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-info" />
            Graduated Batches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.filter(b => b.status === "graduated").map((batch, index) => (
              <BatchCard key={batch.id} batch={batch} index={index} />
            ))}
          </div>
          {batches.filter(b => b.status === "graduated").length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-dashed border-border">
              <p>No graduated batches yet</p>
            </div>
          )}
        </div>
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7
      </main>
    </div>
  );
};

export default Dashboard;
