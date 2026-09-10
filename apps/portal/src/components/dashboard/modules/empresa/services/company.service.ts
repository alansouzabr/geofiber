import type { CompanyProfile } from "../types/company";

const API = process.env.NEXT_PUBLIC_API_URL;

function token() {

  if (typeof window === "undefined") {

    return "";

  }

  return localStorage.getItem("token") || "";

}

export async function getCompanyProfile():Promise<CompanyProfile>{

  const res = await fetch(

    API + "/company",

    {

      headers:{

        Authorization:"Bearer " + token()

      },

      cache:"no-store"

    }

  );

  if(!res.ok){

    throw new Error("Erro ao carregar empresa");

  }

  return res.json();

}
