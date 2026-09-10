export type Id = string;

export type Company = {
  id: Id;
  name?: string;
  tradeName?: string;
  cnpj?: string;
  createdAt?: string;
  [k: string]: unknown;
};

export type Project = {
  id: Id;
  name: string;
  kind?: string;
  createdAt?: string;
  [k: string]: unknown;
};
