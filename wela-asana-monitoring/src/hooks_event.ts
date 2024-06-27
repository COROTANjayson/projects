import type { RequestEvent } from "@sveltejs/kit";


export const logoutUser = (event: RequestEvent)=>{
    const { cookies } = event;

    for(let cookie of cookies.getAll()){
        cookies.delete(cookie.name,{"path": "/"});
    }

    return null
}