export const revalidate = 0;

export async function POST(req) {
    //Get body from request
    try {
        console.log(req);
        const formData = await req.formData();

        //Edit user

        res = { status: 200, message: "User edited successfully" };

        return Response.json({ res });
    } catch (error) {
        console.log(error);
        return Response.error({ error });
    }
}
