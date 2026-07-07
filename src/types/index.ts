export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  state: string;
  occupation: string;
  income_range: string;
  age: number;
  gender: string;
  language: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  location: string | null;
  priority: string;
  ticket_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  status: string;
  message: string;
  created_at: string;
}

export interface SavedScheme {
  id: string;
  user_id: string;
  scheme_id: string;
  scheme_name: string;
  scheme_category: string;
  scheme_description: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface Scheme {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string;
  benefits: string;
  ministry: string;
  state?: string;
  link?: string;
  tags: string[];
}

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}
