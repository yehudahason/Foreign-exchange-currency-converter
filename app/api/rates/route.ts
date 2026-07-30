export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const base = searchParams.get("base");
  const quote = searchParams.get("quote");
  const from = searchParams.get("from");

  const res = await fetch(
    `https://api.frankfurter.dev/v2/rates?from=${from}&base=${base}&quotes=${quote}`,
    { cache: "no-store" },
  );

  const contentType = res.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await res.text();

    console.error("Unexpected response:", {
      status: res.status,
      contentType,
      body: text,
    });

    return Response.json(
      { error: "Upstream API returned invalid response" },
      { status: 502 },
    );
  }

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  return Response.json(data);
}
