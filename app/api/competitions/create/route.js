//Create competition route
import { createCompetition } from "@/app/actions/createCompetition";
export const revalidate = 0;

export async function POST(req) {
    //Get body from request
    try {
        const formData = await req.formData();

        let ownerId = formData.get("ownerId");
        let title = formData.get("title");
        let description = formData.get("description");
        let targetDistance = formData.get("targetDistance");

        console.log({
            ownerId,
            title,
            description,
            targetDistance,
        });

        const competitionData = {
            ownerId,
            title,
            description,
            targetDistance,
        };

        let res = await createCompetition({ competitionData }).then((data) => {
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
