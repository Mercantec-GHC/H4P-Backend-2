//Create competition route
import { createCompetition } from "@/app/actions/createCompetition";
export const revalidate = 0;
import { authenticate } from "@/middleware/auth";

export async function POST(req) {
    const authResult = authenticate(req);

    if (authResult instanceof Response) {
        // If authResult is a Response object, it means there was an error and it has already been handled.
        return authResult;
    }

    const user = authResult;

    //Get body from request
    try {
        const formData = await req.formData();

        let ownerId = user.id;
        let title = formData.get("title");
        let description = formData.get("description");
        let targetDistance = formData.get("targetDistance");

        const competitionData = {
            ownerId,
            title,
            description,
            targetDistance,
            startDate: new Date(),
        };

        let res = await createCompetition({ competitionData }).then((data) => {
            return data;
        });
        //Get the status and message from res
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
