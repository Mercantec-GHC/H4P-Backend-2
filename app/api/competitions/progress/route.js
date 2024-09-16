import { getCompetitions } from "@/app/actions/getCompetitions";
import { updateProgress } from "@/app/actions/updateProgress";
export const revalidate = 0;
import { authenticate } from "@/middleware/auth";

export async function POST(req) {
    try {
        const formData = await req.formData();

        let progress = formData.get("progress");
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

        updateProgress({ userId, progress });

        return new Response(JSON.stringify({ data: "Progress updated" }), {
            status: 200,
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
