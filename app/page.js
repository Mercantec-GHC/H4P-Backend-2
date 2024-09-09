import { getCompetitions } from "./actions/getCompetitions";
import { getData } from "./actions/neondb";

export default async function Page() {
    let data = await getData().then((data) => {
        return data;
    });

    return (
        <div className="flex gap-5 mt-5">
            <div className="w-full">
                <h1>My Users</h1>
                <ul>
                    {data?.map((user) => (
                        <li key={user.id}>
                            <div className="mt-5 border p-5">
                                <h2>{user.email}</h2>
                                <p>{user.username}</p>
                                <p>{user.password}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
