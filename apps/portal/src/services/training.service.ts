const API =
process.env.NEXT_PUBLIC_API_URL;

export async function getCourses(){

  const token=
  localStorage.getItem("token");

  const res=
  await fetch(
    API+"/training/courses",
    {
      headers:{
        Authorization:
        "Bearer "+token
      }
    }
  );

  return res.json();

}
