export const revalidate = 0;
import { getInvitations } from "@/app/actions/getInvitations";
import { authenticate } from "@/middleware/auth";

export async function GET(req) {
    //Get body from request
    try {
        console.log("Getting invitations");
        const authResult = authenticate(req);

        if (authResult instanceof Response) {
            // If authResult is a Response object, it means there was an error and it has already been handled.
            return authResult;
        }

        const user = authResult;

        let userId = user.id;

        let res = await getInvitations({ userId }).then((data) => {
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

//Get inviations from owned by a user by id
