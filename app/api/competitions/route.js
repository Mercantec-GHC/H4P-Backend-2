import { getCompetitions } from "@/app/actions/getCompetitions";
export const revalidate = 0;

export async function GET(req) {
    //Get all competitions and return them
    let res = await getCompetitions().then((data) => {
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
}
