import { NextApiRequest } from 'next';
import http from "./rest_client";

class ClickDataService {
    postClick(sessionId: string, movieId: number) {
        console.log('api/clicks.api.ts method called');
        return http.post('/', JSON.stringify({ sessionId, movieId }));
    }
}

export default ClickDataService;
