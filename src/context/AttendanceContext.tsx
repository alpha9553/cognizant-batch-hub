import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent";
}

export interface TraineeAttendance {
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  records: AttendanceRecord[];
}

interface AttendanceContextType {
  attendanceData: Map<string, TraineeAttendance>;
  saveAttendance: (batchId: string, date: string, presentIds: string[], absentIds: string[], trainees: { id: string; name: string; email: string }[]) => void;
  getTraineeAttendance: (traineeId: string) => AttendanceRecord[];
  hasAttendanceData: (traineeId: string) => boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceData, setAttendanceData] = useState<Map<string, TraineeAttendance>>(new Map());

  const saveAttendance = (
    batchId: string,
    date: string,
    presentIds: string[],
    absentIds: string[],
    trainees: { id: string; name: string; email: string }[]
  ) => {
    setAttendanceData((prev) => {
      const newData = new Map(prev);

      trainees.forEach((trainee) => {
        const existing = newData.get(trainee.id) || {
          traineeId: trainee.id,
          traineeName: trainee.name,
          traineeEmail: trainee.email,
          records: [],
        };

        // Remove existing record for this date if any
        const filteredRecords = existing.records.filter((r) => r.date !== date);

        // Add new record
        const newRecord: AttendanceRecord = {
          date,
          status: absentIds.includes(trainee.id) ? "absent" : "present",
        };

        newData.set(trainee.id, {
          ...existing,
          records: [...filteredRecords, newRecord].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        });
      });

      return newData;
    });
  };

  const getTraineeAttendance = (traineeId: string): AttendanceRecord[] => {
    const data = attendanceData.get(traineeId);
    return data?.records || [];
  };

  const hasAttendanceData = (traineeId: string): boolean => {
    const data = attendanceData.get(traineeId);
    return (data?.records.length || 0) > 0;
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceData,
        saveAttendance,
        getTraineeAttendance,
        hasAttendanceData,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
