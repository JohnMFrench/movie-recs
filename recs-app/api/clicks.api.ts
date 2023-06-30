import { NextApiRequest } from 'next';
import http from "./rest_client";

class ClickDataService {
    postClick(sessionId: string, movieId: number) {

        return http.post('/click', JSON.stringify({ sessionId, movieId }));
    }
}

export default ClickDataService;
