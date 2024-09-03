import { getCompetitions } from "./actions/getCompetitions";
import { getData } from "./actions/neondb";

export default async function Page() {
    let data = await getData().then((data) => {
        return data;
    });
    let competitions = await getCompetitions()
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return [];
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
                                <p>{user.password}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full">
                <h1 className="">My Competitions</h1>
                <ul>
                    {competitions.length > 0 &&
                        competitions?.map((competition) => (
                            <li key={competition.id}>
                                <div className="mt-5 border p-5">
                                    <h2>{competition.title}</h2>
                                    <p>{competition.description}</p>
                                    <p>{competition.targetDistance}</p>
                                    <p>{competition.ownerId}</p>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
