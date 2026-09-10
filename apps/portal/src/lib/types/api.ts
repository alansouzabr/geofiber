export interface Company {
  id?: string;
  companyId?: string;
  name: string;
  cnpj?: string;
}

export interface NewCompanyResponse {
  data: {
    company: {
      name: string;
    };
  };
}

export interface ApiCompaniesResponse {
  items: Company[];
}

export interface RootCompaniesResponse {
  result: unknown;
}

export interface Project { id: string; name: string; }
export interface Station { id: string; name: string; }
export interface Rack { id: string; name: string; }
