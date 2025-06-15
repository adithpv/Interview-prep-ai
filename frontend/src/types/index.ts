// Question related types
export interface IQuestion {
  _id: string;
  session: string;
  user: string;
  question: string;
  answer: string;
  note?: string;
  isPinned: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Session related types
export interface ISession {
  _id: string;
  user: string;
  role: string;
  experience: string;
  topicsToFocus: string;
  description?: string;
  questions: IQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}

// AI Response types
export interface IAIExplanation {
  title: string;
  explanation: string;
}

// Form types
export interface ICreateSessionForm {
  role: string;
  experience: string;
  topicsToFocus: string;
  description: string;
}

// API Response types
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Error types
export interface IApiError {
  message: string;
  status?: number;
}

// Component Props types
export interface IQuestionCardProps {
  question: string;
  answer: string;
  isPinned: boolean;
  onLearnMore: () => void;
  onTogglePin: () => void;
}

export interface IRoleInfoHeaderProps {
  role: string;
  topicsToFocus: string;
  experience: string;
  questions: number;
  descriptions: string;
  lastUpdated: string;
}
