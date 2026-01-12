const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function parseJson(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });
  return parseJson(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  return parseJson(res);
}

export async function apiPatch(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  return parseJson(res);
}

export async function apiPostForm(path, formData) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return parseJson(res);
}
