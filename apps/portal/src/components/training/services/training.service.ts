const API =
  process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {

  const token =
    localStorage.getItem("token");

  return {

    Authorization:
      `Bearer ${token}`

  };

}

export async function getCompanies() {

  return [

    {

      id: "global",

      name: "Biblioteca Global"

    }

  ];

}

export async function getCompanyFiles(

  companyId?: string,

  month?: string,

  category?: string

) {

  let url =
    API + "/global-library";

  if(category){

    url +=
      "?category=" +
      encodeURIComponent(category);

  }

  const res =
    await fetch(

      url,

      {

        headers:
          authHeaders()

      }

    );

  return res.json();

}

export async function uploadDocuments(
  form:FormData
){

  return fetch(

    API+"/upload",

    {

      method:"POST",

      headers:authHeaders(),

      body:form

    }

  );

}

export async function deleteDocument(
  id:string
){

  return fetch(

    API+
    "/global-library/"+id,

    {

      method:"DELETE",

      headers:authHeaders()

    }

  );

}
