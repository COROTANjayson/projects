import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import axios from 'axios';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, SECRET_REDIRECT_URI } from '$env/static/private';

export const POST: RequestHandler = async ({cookies}) => {
    const refresh_token = cookies.get('refresh_token') ?? '';
    
    if(refresh_token){
        try{
            const form = new FormData()
            form.append('client_id', SECRET_CLIENT_ID);
            form.append('client_secret', SECRET_CLIENT_SECRET);
            form.append('token', refresh_token ?? '')
    
            let axios_res = await axios(`https://app.asana.com/-/oauth_revoke`,{
                method:"post",
                data: form
            });
    
            axios_res = axios_res.data
            // throw redirect(303, '/login')
            return new Response(JSON.stringify(axios_res));
        }catch(e){
            console.log(e)
        }
    }
    
    return new Response(JSON.stringify(""));
};