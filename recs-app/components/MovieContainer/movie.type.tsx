export default interface Movie {
    movie_id: string;
    name: string;
    substituted_name: string;
    substituted_desc: string;
    avgRating: number;
    rating: number;
    ranking: number;
    count: number;
    visible: boolean;
    closing: boolean;
    // not all movies will have similar movies...for now
    similar_to: number[] | null;
}