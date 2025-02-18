export interface InputFieldProps {
  name: string;
  placeholder: string;
  type: string;
  required?: boolean;
}

export interface ContactFormProps {
  onSubmit: (formData: FormData) => void;
}
