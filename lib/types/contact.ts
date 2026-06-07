export type ContactSubmissionInput = {
  name: string;
  email?: string;
  phone_number: string;
  subject?: string;
  message: string;
};

export type ContactSubmission = ContactSubmissionInput & {
  id: string | number;
  created_at: string;
  updated_at: string;
};
