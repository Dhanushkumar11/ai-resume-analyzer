import { api } from "./client.js";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("upload_file", file);

  const { data } = await api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function getResumeHistory() {
  const { data } = await api.get("/resume/my-resumes");
  return data;
}

export async function getResumeDetail(id) {
  const { data } = await api.get(`/resume/resumes/${id}`);
  return data;
}

export async function deleteResume(id) {
  const { data } = await api.delete(`/resume/resumes/${id}`);
  return data;
}
