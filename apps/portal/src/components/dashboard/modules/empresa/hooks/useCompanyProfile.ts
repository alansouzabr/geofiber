"use client";

import {

  useEffect,

  useState

} from "react";

import {

  getCompanyProfile

} from "../services/company.service";

import type {

  CompanyProfile

} from "../types/company";

export function useCompanyProfile(){

  const [

    company,

    setCompany

  ]=useState<CompanyProfile>();

  const [

    loading,

    setLoading

  ]=useState(true);

  async function refresh(){

    setLoading(true);

    try{

      const data=await getCompanyProfile();

      setCompany(data);

    }

    finally{

      setLoading(false);

    }

  }

  useEffect(()=>{

    refresh();

  },[]);

  return{

    company,

    loading,

    refresh

  };

}
