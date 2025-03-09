export interface FormUIProps {
  title?: string;
  formData?: any;
  type: string;
  [props: string]: any;
}

export interface FormDataProps {
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  roles?: any[];
  roleIds?: any[];
  status?: any;
  [props: string]: any;
}
