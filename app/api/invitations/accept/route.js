export const revalidate = 0;
import { authenticate } from "@/middleware/auth";
import { acceptInvite } from "@/app/actions/acceptInvite";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const authResult = authenticate(req);

        if (authResult instanceof Response) {
            return authResult;
        }

        const user = authResult;

        let res = await acceptInvite({
            userId: user.id,
            invitationId: formData.get("invitationId"),
        });

        console.log(res);

        return new Response(JSON.stringify({ status: res.status, message: res.statusText }), {
            status: res.status,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
