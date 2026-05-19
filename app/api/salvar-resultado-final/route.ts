export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxmjax5-tdnffzObFxSkv-ZPGFhZjP5pYvIf9YUsUWGuuPa9axxXew6SKl7iVwZU5_D/exec",
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