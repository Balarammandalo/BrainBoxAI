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
  const res = await fetch(path, {
    method: "GET",
    credentials: "include",
  });
  return parseJson(res);
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  return parseJson(res);
}

export async function apiPatch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  return parseJson(res);
}
