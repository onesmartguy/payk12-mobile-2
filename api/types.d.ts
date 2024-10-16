export type ErrorResponse = {
    statusCode: number;
    message: string;
    errors?: {
        generalErrors?: string[];
    }
}