export interface Company {
  id: string;
  name: string;
  fileUrl?: string;
}

export interface CompanyFile {
  id?: string;

  name: string;
  fileUrl?: string;

  category?: string;

  month?: string;

  year?: string;

  type?: string;

  size?: number;

  uploadedBy?: string;

  createdAt?: string;
}
