export async function getSuzukiData() {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxhXt6q76QN0gfzqhiHBig2DB4GdVicW4cnGjwqDRymHIU0MtUqol8Vp2VJZ19B-z9B/exec",
      {
        cache: "no-store",
      }
    );
  
    if (!response.ok) {
      throw new Error("Erro ao buscar dados da API");
    }
  
    return response.json();
  }