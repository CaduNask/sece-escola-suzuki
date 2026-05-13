export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxhXt6q76QN0gfzqhiHBig2DB4GdVicW4cnGjwqDRymHIU0MtUqol8Vp2VJZ19B-z9B/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
      const data = await response.json();
  
      return Response.json({
        success: true,
        data,
      });
    } catch (error) {
      return Response.json(
        {
          success: false,
          error,
        },
        {
          status: 500,
        }
      );
    }
  }