import { Timestamp } from "firebase/firestore";

export type Application = {
  id: string;
  errorDesc: string;
  name: string;
  status: APPLICATION_STATUS;
  faculty: string;
  department: string;
  dob: string;
  track_no: string;
  sex: string;
  approvedAt: string;
  yoa: string;
  isSoftCopy: boolean;
  degreeAwarded: string;
  classOfPass: string;
  graduatedAt: string;
  semesters: Semester[];
  timestamp: Timestamp;
};

export type Semester = {
  session: string;
  semester: string;
  results: Result[];
};
export type Result = {
  code: string;
  title: string;
  unit: number;
  grade: number;
};
export enum APPLICATION_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  FILLED = "FILLED",
  APPROVED = "APPROVED",
  SENT = "SENT",
  ERROR = "ERROR",
}
