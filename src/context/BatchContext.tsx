import { createContext, useContext, useState, ReactNode } from "react";
import { mockBatches } from "@/lib/mockData";

export interface Trainee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  scheduleAdherence: string;
  learningStatus: string;
  interimStatus: string;
  finalStatus: string;
  qualifierScore: number | null;
  eligibility: string;
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  totalTrainees: number;
  trainer: string;
  behavioralTrainer: string;
  mentor: string;
  startDate: string;
  endDate: string;
  status: string;
  currentWeek?: number;
  totalWeeks?: number;
  scheduleStatus: {
    onSchedule: number;
    behind: number;
    advanced: number;
  };
  milestones: {
    qualifier: { completed: boolean; date: string };
    interim: { completed: boolean; date: string };
    final: { completed: boolean; date: string };
  };
  roomDetails?: {
    building: string;
    floor: number;
    odcNumber: string;
  };
  stakeholders?: {
    trainer: { name: string; hours: number; hourlyRate: number };
    behavioralTrainer: { name: string; hours: number; hourlyRate: number };
    mentor: { name: string; hours: number; hourlyRate: number };
  };
  qualifierScores?: {
    average: number;
    highest: number;
    lowest: number;
    passRate: number;
  };
  trainees?: Trainee[];
}

interface BatchContextType {
  batches: Batch[];
  setBatches: (batches: Batch[]) => void;
  updateBatch: (batchId: string, updates: Partial<Batch>) => void;
  getBatchById: (batchId: string) => Batch | undefined;
  addTrainee: (batchId: string, trainee: Trainee) => void;
  updateTrainee: (batchId: string, traineeId: string, updates: Partial<Trainee>) => void;
  deleteTrainee: (batchId: string, traineeId: string) => void;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider = ({ children }: { children: ReactNode }) => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches as Batch[]);

  const updateBatch = (batchId: string, updates: Partial<Batch>) => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id === batchId ? { ...batch, ...updates } : batch
      )
    );
  };

  const getBatchById = (batchId: string) => {
    return batches.find((batch) => batch.id === batchId);
  };

  const addTrainee = (batchId: string, trainee: Trainee) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          const trainees = batch.trainees || [];
          return {
            ...batch,
            trainees: [...trainees, trainee],
            totalTrainees: batch.totalTrainees + 1,
          };
        }
        return batch;
      })
    );
  };

  const updateTrainee = (batchId: string, traineeId: string, updates: Partial<Trainee>) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId && batch.trainees) {
          return {
            ...batch,
            trainees: batch.trainees.map((t) =>
              t.id === traineeId ? { ...t, ...updates } : t
            ),
          };
        }
        return batch;
      })
    );
  };

  const deleteTrainee = (batchId: string, traineeId: string) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId && batch.trainees) {
          return {
            ...batch,
            trainees: batch.trainees.filter((t) => t.id !== traineeId),
            totalTrainees: batch.totalTrainees - 1,
          };
        }
        return batch;
      })
    );
  };

  return (
    <BatchContext.Provider
      value={{
        batches,
        setBatches,
        updateBatch,
        getBatchById,
        addTrainee,
        updateTrainee,
        deleteTrainee,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatches = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error("useBatches must be used within a BatchProvider");
  }
  return context;
};
