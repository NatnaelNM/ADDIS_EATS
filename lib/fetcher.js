// Shared fetcher for every SWR request. Non-2xx responses become errors
// so SWR can expose them through its error state.
export default async function fetcher(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const message = `Request failed (${response.status})`;
    throw new Error(message);
  }
  return response.json();
}
