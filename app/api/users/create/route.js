import { createUser } from "@/app/actions/createUser";

export const revalidate = 0;

export async function POST(req) {
    //Get body from request
    try {
        console.log(req);
        const formData = await req.formData();

        let email = formData.get("email");
        let password = formData.get("password");

        let res = await createUser({ email, password }).then((data) => {
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
