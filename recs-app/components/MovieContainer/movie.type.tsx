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
    similar_movie_ids: any;
    similar_movie_tags: any;
}