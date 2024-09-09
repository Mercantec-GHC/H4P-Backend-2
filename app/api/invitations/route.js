/* export const revalidate = 0;
import { authenticate } from "@/middleware/auth";

export async function POST(req) {
    //Get body from request
    try {
        console.log(req);
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

        const invitationData = {
            ownerId,
            username,
            competitionId,
        };

        console.log(invitationData);

        return new Response(JSON.stringify({ status: 200, data: invitationData }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
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
 */

//Get inviations from owned by a user by id
