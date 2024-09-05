import { getCompetitions } from "@/app/actions/getCompetitions";
export const revalidate = 0;
import { authenticate } from "@/middleware/auth";

export async function GET(req) {
    try {
        const authResult = authenticate(req);

        if (authResult instanceof Response) {
            // If authResult is a Response object, it means there was an error and it has already been handled.
            return authResult;
        }

        const user = authResult;

        console.log("Getting competitions");
        //Get ownerId from request

        let userId = user.id;
        console.log("Getting competitions for user", userId);
        //Get all competitions and return them

        let res = await getCompetitions({ userId }).then((data) => {
            return data;
        });

        //If res then return the data with status 200

        if (res) {
            return new Response(JSON.stringify({ data: res }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            //If no res then return the error with status 500
            return new Response(JSON.stringify({ error: "Error fetching competitions" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
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
