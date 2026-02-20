// start a nova act job

const NOVA_ACT_API_URL = process.env.NOVA_ACT_API_URL;
const NOVA_ACT_API_KEY = process.env.NOVA_ACT_API_KEY;

if (!NOVA_ACT_API_URL || !NOVA_ACT_API_KEY) {
    throw new Error("Nova Act configuration is missing");
}

export async function POST(request: Request) {
    const res = await fetch(`${NOVA_ACT_API_URL}/start-act`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${NOVA_ACT_API_KEY}`
        },
        body: JSON.stringify(await request.json())
    });
    if (res.ok) {
        const data = await res.json();
        // { run_id: string }
        return new Response(JSON.stringify({ message: "Job started successfully", data }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    return new Response(JSON.stringify({ error: "Failed to start job" }), {
        status: 500,
        headers: {
            "Content-Type": "application/json"
        }
    });
}