export interface FormUIProps {
  title?: string;
  formData?: any;
  type: string;
  [props: string]: any;
}

export interface FormDataProps {
  name?: string;
  value: string;
  description?: string;
  phone?: string;
  buttons?: any[];
  buttonIds?: any[];
  [props: string]: any;
}
