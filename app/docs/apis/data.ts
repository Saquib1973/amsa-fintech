export interface APIResponseBody {
  token?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  users?: Array<{
    id: string;
    email: string;
    name: string;
  }>;
}

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  response: {
    status: number;
    body: APIResponseBody;
  };
}

export interface APISection {
  id: string;
  title: string;
  description: string;
  category: string;
  endpoints: APIEndpoint[];
}

export const apiEndpoints: APISection[] = [
  {
    id: 'authentication',
    title: 'Authentication',
    description: 'User authentication and authorization endpoints',
    category: 'Auth',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'User login endpoint',
        response: {
          status: 200,
          body: {
            token: 'string',
            user: {
              id: 'string',
              email: 'string',
              name: 'string'
            }
          }
        }
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'User registration endpoint',
        response: {
          status: 201,
          body: {
            message: 'User created successfully',
            user: {
              id: 'string',
              email: 'string',
              name: 'string'
            }
          }
        }
      }
    ]
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'User profile and settings management',
    category: 'User',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        response: {
          status: 200,
          body: {
            users: [
              {
                id: 'string',
                email: 'string',
                name: 'string'
              }
            ]
          }
        }
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get user by ID',
        response: {
          status: 200,
          body: {
            user: {
              id: 'string',
              email: 'string',
              name: 'string'
            }
          }
        }
      }
    ]
  }
];