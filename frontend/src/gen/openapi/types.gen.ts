// This file is auto-generated by @hey-api/openapi-ts

export type User = {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role?: 'STUDENT' | 'ADMIN' | 'COMPANY';
    createdAt?: string;
    updatedAt?: string;
};

export type Category = {
    id?: number;
    subCategory?: string;
    type?: 'PLACE' | 'JOB' | 'EVENT' | 'DEAL';
    createdAt?: string;
    createdBy?: User;
};

export type Place = {
    id?: number;
    name?: string;
    description?: string;
    summary?: string;
    category?: Category;
    address?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    createdAt?: string;
    price?: number;
    createdBy?: User;
};

export type Job = {
    id?: number;
    title?: string;
    summary?: string;
    description?: string;
    companyName?: string;
    location?: string;
    category?: Category;
    duration?: string;
    startDate?: string;
    endDate?: string;
    contactEmail?: string;
    createdAt?: string;
    createdBy?: User;
};

export type Event = {
    id?: number;
    title?: string;
    description?: string;
    summary?: string;
    category?: Category;
    date?: string;
    location?: string;
    price?: number;
    createdBy?: User;
    imageUrl?: string;
    createdAt?: string;
};

export type Deal = {
    id?: number;
    title?: string;
    description?: string;
    link?: string;
    old_price?: number;
    new_price?: number;
    date_end?: string;
    company?: string;
    reserve?: string;
    category?: Category;
    createdBy?: User;
    createdAt?: string;
    updatedAt?: string;
};

export type AuthenticationRequest = {
    email: string;
    password: string;
};

export type AuthenticationResponse = {
    token: string;
    user: User;
};

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

export type RegisterUserData = {
    body: RegisterRequest;
    path?: never;
    query?: never;
    url: '/auth/register';
};

export type RegisterUserErrors = {
    /**
     * Invalid request
     */
    400: unknown;
};

export type RegisterUserResponses = {
    /**
     * User registered successfully
     */
    200: AuthenticationResponse;
};

export type RegisterUserResponse = RegisterUserResponses[keyof RegisterUserResponses];

export type AuthenticateUserData = {
    body: AuthenticationRequest;
    path?: never;
    query?: never;
    url: '/auth/login';
};

export type AuthenticateUserErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
};

export type AuthenticateUserResponses = {
    /**
     * Authentication successful
     */
    200: AuthenticationResponse;
};

export type AuthenticateUserResponse = AuthenticateUserResponses[keyof AuthenticateUserResponses];

export type HealthCheckData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/health';
};

export type HealthCheckResponses = {
    /**
     * API is up and running
     */
    200: string;
};

export type HealthCheckResponse = HealthCheckResponses[keyof HealthCheckResponses];

export type UploadImageData = {
    body: {
        file?: Blob | File;
    };
    path?: never;
    query?: never;
    url: '/images';
};

export type UploadImageErrors = {
    /**
     * Invalid request
     */
    400: unknown;
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
    /**
     * Internal server error
     */
    500: unknown;
};

export type UploadImageResponses = {
    /**
     * Image uploaded successfully
     */
    201: unknown;
};

export type ListUsersData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/users';
};

export type ListUsersResponses = {
    /**
     * A list of users.
     */
    200: Array<User>;
};

export type ListUsersResponse = ListUsersResponses[keyof ListUsersResponses];

export type CreateUserData = {
    body: User;
    path?: never;
    query?: never;
    url: '/users';
};

export type CreateUserErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type CreateUserResponses = {
    /**
     * User created
     */
    200: User;
};

export type CreateUserResponse = CreateUserResponses[keyof CreateUserResponses];

export type DeleteUserByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/users/{id}';
};

export type DeleteUserByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type DeleteUserByIdResponses = {
    /**
     * User deleted
     */
    201: unknown;
};

export type GetUserByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/users/{id}';
};

export type GetUserByIdResponses = {
    /**
     * User found
     */
    200: User;
};

export type GetUserByIdResponse = GetUserByIdResponses[keyof GetUserByIdResponses];

export type UpdateUserByIdData = {
    body: User;
    path: {
        id: number;
    };
    query?: never;
    url: '/users/{id}';
};

export type UpdateUserByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type UpdateUserByIdResponses = {
    /**
     * User updated
     */
    200: User;
};

export type UpdateUserByIdResponse = UpdateUserByIdResponses[keyof UpdateUserByIdResponses];

export type ListPlacesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/places';
};

export type ListPlacesResponses = {
    /**
     * A list of places.
     */
    200: Array<Place>;
};

export type ListPlacesResponse = ListPlacesResponses[keyof ListPlacesResponses];

export type CreatePlaceData = {
    body: Place;
    path?: never;
    query?: never;
    url: '/places';
};

export type CreatePlaceErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type CreatePlaceResponses = {
    /**
     * Place created
     */
    200: Place;
};

export type CreatePlaceResponse = CreatePlaceResponses[keyof CreatePlaceResponses];

export type DeletePlaceByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/places/{id}';
};

export type DeletePlaceByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type DeletePlaceByIdResponses = {
    /**
     * Place deleted
     */
    201: unknown;
};

export type GetPlaceByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/places/{id}';
};

export type GetPlaceByIdResponses = {
    /**
     * Place found
     */
    200: Place;
};

export type GetPlaceByIdResponse = GetPlaceByIdResponses[keyof GetPlaceByIdResponses];

export type UpdatePlaceByIdData = {
    body: Place;
    path: {
        id: number;
    };
    query?: never;
    url: '/places/{id}';
};

export type UpdatePlaceByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type UpdatePlaceByIdResponses = {
    /**
     * Place updated
     */
    200: Place;
};

export type UpdatePlaceByIdResponse = UpdatePlaceByIdResponses[keyof UpdatePlaceByIdResponses];

export type ListJobsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/jobs';
};

export type ListJobsResponses = {
    /**
     * A list of jobs.
     */
    200: Array<Job>;
};

export type ListJobsResponse = ListJobsResponses[keyof ListJobsResponses];

export type CreateJobData = {
    body: Job;
    path?: never;
    query?: never;
    url: '/jobs';
};

export type CreateJobErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type CreateJobResponses = {
    /**
     * Job created
     */
    200: Job;
};

export type CreateJobResponse = CreateJobResponses[keyof CreateJobResponses];

export type DeleteJobByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/jobs/{id}';
};

export type DeleteJobByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type DeleteJobByIdResponses = {
    /**
     * Job deleted
     */
    201: unknown;
};

export type GetJobByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/jobs/{id}';
};

export type GetJobByIdResponses = {
    /**
     * Job found
     */
    200: Job;
};

export type GetJobByIdResponse = GetJobByIdResponses[keyof GetJobByIdResponses];

export type UpdateJobByIdData = {
    body: Job;
    path: {
        id: number;
    };
    query?: never;
    url: '/jobs/{id}';
};

export type UpdateJobByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type UpdateJobByIdResponses = {
    /**
     * Job updated
     */
    200: Job;
};

export type UpdateJobByIdResponse = UpdateJobByIdResponses[keyof UpdateJobByIdResponses];

export type ListEventsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/events';
};

export type ListEventsResponses = {
    /**
     * A list of events.
     */
    200: Array<Event>;
};

export type ListEventsResponse = ListEventsResponses[keyof ListEventsResponses];

export type CreateEventData = {
    body: Event;
    path?: never;
    query?: never;
    url: '/events';
};

export type CreateEventErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type CreateEventResponses = {
    /**
     * Event created
     */
    200: Event;
};

export type CreateEventResponse = CreateEventResponses[keyof CreateEventResponses];

export type DeleteEventByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/events/{id}';
};

export type DeleteEventByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type DeleteEventByIdResponses = {
    /**
     * Event deleted
     */
    201: unknown;
};

export type GetEventByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/events/{id}';
};

export type GetEventByIdResponses = {
    /**
     * Event found
     */
    200: Event;
};

export type GetEventByIdResponse = GetEventByIdResponses[keyof GetEventByIdResponses];

export type UpdateEventByIdData = {
    body: Event;
    path: {
        id: number;
    };
    query?: never;
    url: '/events/{id}';
};

export type UpdateEventByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type UpdateEventByIdResponses = {
    /**
     * Event updated
     */
    200: Event;
};

export type UpdateEventByIdResponse = UpdateEventByIdResponses[keyof UpdateEventByIdResponses];

export type ListDealsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/deals';
};

export type ListDealsResponses = {
    /**
     * A list of deals.
     */
    200: Array<Deal>;
};

export type ListDealsResponse = ListDealsResponses[keyof ListDealsResponses];

export type CreateDealData = {
    body: Deal;
    path?: never;
    query?: never;
    url: '/deals';
};

export type CreateDealErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type CreateDealResponses = {
    /**
     * Deal created
     */
    200: Deal;
};

export type CreateDealResponse = CreateDealResponses[keyof CreateDealResponses];

export type DeleteDealByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/deals/{id}';
};

export type DeleteDealByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type DeleteDealByIdResponses = {
    /**
     * Deal deleted
     */
    201: unknown;
};

export type GetDealByIdData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/deals/{id}';
};

export type GetDealByIdResponses = {
    /**
     * Deal found
     */
    200: Deal;
};

export type GetDealByIdResponse = GetDealByIdResponses[keyof GetDealByIdResponses];

export type UpdateDealByIdData = {
    body: Deal;
    path: {
        id: number;
    };
    query?: never;
    url: '/deals/{id}';
};

export type UpdateDealByIdErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
    /**
     * Forbidden
     */
    403: unknown;
};

export type UpdateDealByIdResponses = {
    /**
     * Deal updated
     */
    200: Deal;
};

export type UpdateDealByIdResponse = UpdateDealByIdResponses[keyof UpdateDealByIdResponses];

export type ClientOptions = {
    baseUrl: 'http://localhost:8080/api' | (string & {});
};