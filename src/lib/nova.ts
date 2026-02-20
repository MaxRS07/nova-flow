import { ActMetadata } from "@/types/nova";

export async function startNovaActJob(data: any): Promise<ActSocket> {
    const response = await fetch("/api/aws", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const resData = await response.json();

    if (response.ok && resData.data && resData.data.run_id) {
        const { data } = resData;
        const socket = new ActSocket(data.run_id);
        return socket;
    } else {
        throw new Error(resData.error || "Failed to start Nova Act job");
    }
}

class ActSocket {
    private socket: WebSocket;

    constructor(run_id: string) {
        this.socket = new WebSocket(`${process.env.NOVACORE_WS_URL}${run_id}`);

        this.socket.onopen = () => {
            console.log("WebSocket connection established for run:", run_id);
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed for run:", run_id);
            this.socket.close();
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'user_input':
                    this.onApprovalRequest(data.input);
                    break;
                case 'act_update':
                    const metadata: ActMetadata = data.metadata || {};
                    console.log("Received act update:", data.update);
                    break;
                default:
                    console.log("Received message:", data);
            }
        };
    }

    send(data: any) {
        this.socket.send(JSON.stringify(data));
    }

    async onApprovalRequest(callback: (input: string) => boolean) {
        this.socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'user_input') {
                const approved = await callback(data.input);
                this.send({ approved: approved, input: data.input });
            }
        }
    }
}