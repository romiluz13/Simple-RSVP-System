import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

// Mock user data
export const mockUser = {
  sub: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'https://example.com/picture.jpg',
};

// Wrapper with Auth0 provider
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}

// Custom render with providers
function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { render };

// Mock fetch response
export const mockFetchResponse = (data: any) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
};

// Mock error fetch response
export const mockFetchError = (status = 500, message = 'Internal Server Error') => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ error: message }),
    })
  );
};

// Reset all mocks
export const resetMocks = () => {
  jest.clearAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
};

// Mock MongoDB response
export const mockMongoResponse = (data: any) => {
  const mockCollection = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockResolvedValue(data),
    insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => Promise.resolve({
      connection: {
        db: {
          collection: jest.fn().mockReturnValue(mockCollection),
        },
      },
    })),
  }));

  return mockCollection;
}; 