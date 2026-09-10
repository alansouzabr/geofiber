export interface CompanyPlan {

  id?: string;

  name?: string;

}

export interface CompanyProfile {

  id?: string;

  name?: string;

  companyName?: string;

  cnpj?: string;

  email?: string;

  phone?: string;

  technicalResponsible?: string;

  crea?: string;

  isActive?: boolean;

  logo?: string;

  plan?: CompanyPlan;

}
