const API =
  process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
}

export async function getCompanies() {

  const res =
    await fetch(
      API + "/admin/companies",
      {
        headers: authHeaders()
      }
    );

  return res.json();
}

export async function getCompanyFiles(
  companyId: string,
  month?: string,
  category?: string
) {

  let url =
    API + "/company-files/" + companyId;

  const params =
    new URLSearchParams();

  if (month) {
    params.append("month", month);
  }

  if (category) {
    params.append("category", category);
  }

  if (params.toString()) {
    url += "?" + params.toString();
  }

  const res =
    await fetch(
      url,
      {
        headers: authHeaders()
      }
    );

  return res.json();
}

export async function uploadDocuments(
  form: FormData
) {

  const res =
    await fetch(
      API + "/upload",
      {
        method: "POST",
        headers: authHeaders(),
        body: form
      }
    );

  return res;
}

export async function deleteDocument(
  id: string
) {

  return fetch(
    API + "/company-files/" + id,
    {
      method: "DELETE",
      headers: authHeaders()
    }
  );
}
