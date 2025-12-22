<<<<<<< HEAD
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { mockBatches } from "@/lib/mockData";
import { saveBatchesToAPI, loadBatchesFromAPI } from "@/lib/api";
import { saveBatchesToStorage, loadBatchesFromStorage } from "@/lib/localStorage";
=======
import { createContext, useContext, useState, ReactNode } from "react";
import { mockBatches } from "@/lib/mockData";
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7

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
    trainer: { name: string; hours: number };
    behavioralTrainer: { name: string; hours: number };
    mentor: { name: string; hours: number };
    buddyMentor?: { name: string; hours: number };
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
<<<<<<< HEAD
  saveBatchesToDatabase: (batches: Batch[]) => Promise<void>;
  isLoading: boolean;
=======
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7
  updateBatch: (batchId: string, updates: Partial<Batch>) => void;
  getBatchById: (batchId: string) => Batch | undefined;
  addTrainee: (batchId: string, trainee: Trainee) => void;
  updateTrainee: (batchId: string, traineeId: string, updates: Partial<Trainee>) => void;
  deleteTrainee: (batchId: string, traineeId: string) => void;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        // Try to load from database first
        const dbBatches = await loadBatchesFromAPI();
        if (dbBatches.length > 0) {
          setBatches(dbBatches);
        } else {
          // Fallback to localStorage
          const storedBatches = loadBatchesFromStorage();
          if (storedBatches.length > 0) {
            setBatches(storedBatches);
          } else {
            setBatches(mockBatches as Batch[]);
          }
        }
      } catch (error) {
        console.error('Database not available, trying localStorage:', error);
        try {
          const storedBatches = loadBatchesFromStorage();
          if (storedBatches.length > 0) {
            setBatches(storedBatches);
          } else {
            setBatches(mockBatches as Batch[]);
          }
        } catch (storageError) {
          console.error('Storage also failed, using mock data:', storageError);
          setBatches(mockBatches as Batch[]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const saveBatchesToDatabase = async (newBatches: Batch[]) => {
    try {
      // Try to save to database first
      await saveBatchesToAPI(newBatches);
      // After saving, reload all batches from database to show merged data
      const allBatches = await loadBatchesFromAPI();
      setBatches(allBatches);
    } catch (error) {
      console.error('Database save failed, saving to localStorage:', error);
      try {
        saveBatchesToStorage(newBatches);
        // After saving to localStorage, reload all batches
        const allBatches = loadBatchesFromStorage();
        setBatches(allBatches);
      } catch (storageError) {
        console.error('Storage save also failed:', storageError);
        setBatches(newBatches); // Still update UI even if both fail
      }
    }
  };
=======
  const [batches, setBatches] = useState<Batch[]>(mockBatches as Batch[]);
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7

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
<<<<<<< HEAD
        saveBatchesToDatabase,
        isLoading,
=======
>>>>>>> 6cabe94d540bb7a887e3f2d54a60383c4ada14d7
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
