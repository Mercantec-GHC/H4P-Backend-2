export const revalidate = 0;
import { authenticate } from "@/middleware/auth";
import { createInvitation } from "@/app/actions/createInvitation";

export async function POST(req) {
    //Get body from request
    try {
        const formData = await req.formData();

        const authResult = authenticate(req);

        if (authResult instanceof Response) {
            // If authResult is a Response object, it means there was an error and it has already been handled.
            return authResult;
        }

        const user = authResult;

        let ownerId = user.id;
        let username = formData.get("username");
        let competitionId = formData.get("competitionId");

        //Get the userId of the user being invited

        const invitationData = {
            ownerId,
            username,
            competitionId,
        };

        console.log(invitationData);

        let res = await createInvitation(invitationData).then((data) => {
            console.log(data);
            return data;
        });

        //Get the status from res

        return new Response(JSON.stringify({ status: res.status, data: res.data }), {
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
