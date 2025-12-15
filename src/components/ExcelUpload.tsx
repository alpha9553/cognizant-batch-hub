import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

interface ExcelUploadProps {
  onDataParsed: (batches: any[]) => void;
}

const ExcelUpload = ({ onDataParsed }: ExcelUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        
        // Parse all sheets - each sheet is a cohort/batch
        const parsedBatches: any[] = [];
        
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          const batch = parseCoachReportSheet(jsonData, sheetName);
          if (batch) {
            parsedBatches.push(batch);
          }
        });

        if (parsedBatches.length > 0) {
          onDataParsed(parsedBatches);
          toast({
            title: "Upload Successful",
            description: `${parsedBatches.length} batches loaded from ${file.name}`,
          });
        } else {
          toast({
            title: "No Data Found",
            description: "Could not find valid batch data in the Excel file.",
            variant: "destructive",
          });
        }
        setIsUploading(false);
      } catch (error) {
        console.error("Excel parsing error:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive",
        });
        setIsUploading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const parseCoachReportSheet = (data: any[][], sheetName: string): any | null => {
    if (data.length < 20) return null;

    // Extract metadata from the header section
    const getMetaValue = (searchKey: string): string => {
      for (let i = 0; i < Math.min(15, data.length); i++) {
        const row = data[i];
        if (!row) continue;
        for (let j = 0; j < row.length; j++) {
          const cell = String(row[j] || "").trim();
          if (cell.toLowerCase().includes(searchKey.toLowerCase())) {
            // Check next cell or same row for value
            if (row[j + 1] !== undefined && row[j + 1] !== "") {
              return String(row[j + 1]).trim();
            }
            // Sometimes value is in same cell after colon
            if (cell.includes(":")) {
              return cell.split(":")[1]?.trim() || "";
            }
          }
        }
      }
      return "";
    };

    const cohortName = getMetaValue("Cohort Name") || sheetName;
    const cohortMembersCount = parseInt(getMetaValue("Cohort members count")) || 0;
    const learningPath = getMetaValue("Learning Path");
    const startDate = getMetaValue("Cohort Start Date");
    const graduationDate = getMetaValue("Graduation Date");
    const qualifierDate = getMetaValue("Qualifier Date");
    const currentWeek = getMetaValue("Current Week");
    const totalWeeks = getMetaValue("Total Weeks");

    // Find the header row (contains "Name", "Email", "Schedule Adherence")
    let headerRowIndex = -1;
    let headers: string[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      const rowStr = row.map(c => String(c || "").toLowerCase()).join(",");
      if (rowStr.includes("name") && rowStr.includes("email") && rowStr.includes("schedule adherence")) {
        headerRowIndex = i;
        headers = row.map(c => String(c || "").trim());
        break;
      }
    }

    if (headerRowIndex === -1) return null;

    // Parse trainee data
    const trainees: any[] = [];
    const scheduleStatus = { onSchedule: 0, behind: 0, advanced: 0 };
    let qualifierScoresSum = 0;
    let qualifierCount = 0;
    let qualifierHighest = 0;
    let qualifierLowest = 100;
    let passCount = 0;

    // Column indices
    const nameIdx = headers.findIndex(h => h.toLowerCase() === "name");
    const emailIdx = headers.findIndex(h => h.toLowerCase() === "email");
    const empIdIdx = headers.findIndex(h => h.toLowerCase().includes("emp id"));
    const scheduleIdx = headers.findIndex(h => h.toLowerCase().includes("schedule adherence"));
    const learningStatusIdx = headers.findIndex(h => h.toLowerCase().includes("learning status"));
    const interimIdx = headers.findIndex(h => h.toLowerCase().includes("interim evaluation"));
    const finalIdx = headers.findIndex(h => h.toLowerCase().includes("final evaluation") && !h.toLowerCase().includes("re-attempt"));
    const finalReAttemptIdx = headers.findIndex(h => h.toLowerCase().includes("final evaluation re-attempt"));
    const finalStatusIdx = headers.findIndex(h => h.toLowerCase().includes("final status"));
    const qualifierScoreIdx = headers.findIndex(h => h.toLowerCase().includes("qualifier score"));
    const qualifierEligibilityIdx = headers.findIndex(h => h.toLowerCase().includes("qualifier eligibility"));

    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[nameIdx]) continue;

      const name = String(row[nameIdx] || "").trim();
      if (!name || name.toLowerCase() === "name") continue;

      const email = String(row[emailIdx] || "").trim();
      const empId = String(row[empIdIdx] || "").trim();
      const scheduleAdherence = String(row[scheduleIdx] || "").trim();
      const learningStatus = String(row[learningStatusIdx] || "").trim();
      const interimEval = String(row[interimIdx] || "").trim();
      const finalEval = String(row[finalIdx] || "").trim();
      const finalReAttempt = String(row[finalReAttemptIdx] || "").trim();
      const finalStatus = String(row[finalStatusIdx] || "").trim();
      const qualifierScore = parseFloat(String(row[qualifierScoreIdx] || "")) || 0;
      const qualifierEligibility = String(row[qualifierEligibilityIdx] || "").trim();

      // Count schedule status
      if (scheduleAdherence.toLowerCase().includes("behind")) {
        scheduleStatus.behind++;
      } else if (scheduleAdherence.toLowerCase().includes("advanced")) {
        scheduleStatus.advanced++;
      } else if (scheduleAdherence.toLowerCase().includes("on schedule")) {
        scheduleStatus.onSchedule++;
      }

      // Track qualifier scores
      if (qualifierScore > 0) {
        qualifierScoresSum += qualifierScore;
        qualifierCount++;
        qualifierHighest = Math.max(qualifierHighest, qualifierScore);
        qualifierLowest = Math.min(qualifierLowest, qualifierScore);
        if (qualifierScore >= 60) passCount++;
      }

      trainees.push({
        id: empId || `trainee-${i}`,
        name,
        email,
        employeeId: empId,
        scheduleAdherence,
        learningStatus,
        interimStatus: interimEval,
        finalStatus: finalEval || finalStatus,
        qualifierScore: qualifierScore > 0 ? qualifierScore : null,
        eligibility: qualifierEligibility || "Eligible",
      });
    }

    if (trainees.length === 0) return null;

    // Determine batch status
    const isProgramOver = currentWeek.toLowerCase().includes("program over") || 
                          currentWeek.toLowerCase().includes("over");
    const status = isProgramOver ? "graduated" : "active";

    // Calculate qualifier stats
    const qualifierAvg = qualifierCount > 0 ? Math.round(qualifierScoresSum / qualifierCount) : 0;
    const passRate = qualifierCount > 0 ? Math.round((passCount / qualifierCount) * 100) : 0;

    return {
      id: cohortName.replace(/\s+/g, "-").toLowerCase(),
      name: cohortName,
      description: learningPath || "Training Program",
      totalTrainees: trainees.length,
      trainer: "N/A", // Not in this Excel format
      behavioralTrainer: "N/A",
      mentor: "N/A",
      startDate: startDate,
      endDate: graduationDate,
      status: status,
      currentWeek: currentWeek,
      totalWeeks: totalWeeks,
      scheduleStatus: scheduleStatus,
      milestones: {
        qualifier: { 
          completed: qualifierDate && !qualifierDate.toLowerCase().includes("not provided"), 
          date: qualifierDate 
        },
        interim: { 
          completed: trainees.some(t => t.interimEval && t.interimEval !== "NA"), 
          date: "" 
        },
        final: { 
          completed: trainees.some(t => t.finalStatus && t.finalStatus !== "NA" && t.finalStatus !== ""), 
          date: "" 
        },
      },
      roomDetails: null,
      stakeholders: {
        trainer: { name: "N/A", hours: 0, hourlyRate: 0 },
        behavioralTrainer: { name: "N/A", hours: 0, hourlyRate: 0 },
        mentor: { name: "N/A", hours: 0, hourlyRate: 0 },
      },
      qualifierScores: {
        average: qualifierAvg,
        highest: qualifierHighest > 0 ? qualifierHighest : 0,
        lowest: qualifierLowest < 100 ? qualifierLowest : 0,
        passRate: passRate,
      },
      trainees: trainees,
    };
  };

  return (
    <Card className="mb-6 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Upload Coach Report
        </CardTitle>
        <CardDescription>
          Upload your weekly Coach Report Excel file to update all batch dashboards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="relative overflow-hidden"
            disabled={isUploading}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Processing..." : "Choose Excel File"}
          </Button>
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{fileName}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelUpload;
