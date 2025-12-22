import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBatches } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const StudentDetail = () => {
  const { batchId, studentId } = useParams();
  const navigate = useNavigate();
  const batch = mockBatches.find((b) => b.id === batchId);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate]);

  if (!batch) {
    return <div>Batch not found</div>;
  }

  // Mock student data - in real app, this would come from database
  const student = {
    id: studentId,
    name: `Student ${studentId?.split('-')[1]}`,
    scheduleStatus: Math.random() > 0.5 ? (Math.random() > 0.5 ? "On Schedule" : "Behind Schedule") : "Advanced",
    attendance: {
      present: Math.floor(Math.random() * 20) + 50,
      absent: Math.floor(Math.random() * 10),
      percentage: Math.floor(Math.random() * 20) + 75,
    },
    scores: {
      qualifier: batch.qualifierScores ? Math.floor(Math.random() * 30) + 70 : null,
      interim: batch.milestones.interim.completed ? Math.floor(Math.random() * 30) + 70 : null,
      final: batch.milestones.final.completed ? Math.floor(Math.random() * 30) + 70 : null,
    },
    recentAttendance: [
      { date: "2024-03-15", status: "present" },
      { date: "2024-03-14", status: "present" },
      { date: "2024-03-13", status: "absent" },
      { date: "2024-03-12", status: "present" },
      { date: "2024-03-11", status: "present" },
    ],
  };

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case "On Schedule": return "bg-success";
      case "Behind Schedule": return "bg-warning";
      case "Advanced": return "bg-info";
      default: return "bg-muted";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/batch/${batchId}`)} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Batch
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
              <p className="text-muted-foreground">{batch.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Schedule Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${getScheduleStatusColor(student.scheduleStatus)} text-white`}>
                {student.scheduleStatus}
              </Badge>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{student.attendance.percentage}%</p>
              <Progress value={student.attendance.percentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Present</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{student.attendance.present}</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{student.attendance.absent}</p>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Scores */}
        <Card className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Evaluation Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Qualifier Score</p>
                {student.scores.qualifier ? (
                  <>
                    <p className={`text-3xl font-bold ${getScoreColor(student.scores.qualifier)}`}>
                      {student.scores.qualifier}%
                    </p>
                    <Progress value={student.scores.qualifier} className="mt-2" />
                  </>
                ) : (
                  <p className="text-muted-foreground">Not completed</p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Interim Evaluation</p>
                {student.scores.interim ? (
                  <>
                    <p className={`text-3xl font-bold ${getScoreColor(student.scores.interim)}`}>
                      {student.scores.interim}%
                    </p>
                    <Progress value={student.scores.interim} className="mt-2" />
                  </>
                ) : (
                  <p className="text-muted-foreground">Not completed</p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Final Evaluation</p>
                {student.scores.final ? (
                  <>
                    <p className={`text-3xl font-bold ${getScoreColor(student.scores.final)}`}>
                      {student.scores.final}%
                    </p>
                    <Progress value={student.scores.final} className="mt-2" />
                  </>
                ) : (
                  <p className="text-muted-foreground">Not completed</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance History */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Attendance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {student.recentAttendance.map((record) => (
                <div key={record.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{record.date}</span>
                  <Badge variant={record.status === "present" ? "default" : "destructive"}>
                    {record.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDetail;
