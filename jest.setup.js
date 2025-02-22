// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock crypto for Auth0
const cryptoMock = {
  randomBytes: (size) => Buffer.alloc(size),
  createHash: () => ({
    update: () => ({
      digest: () => 'mocked-hash'
    })
  })
};
global.crypto = cryptoMock;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Auth0
jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser() {
    return {
      user: {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/picture.jpg',
      },
      error: null,
      isLoading: false,
    };
  },
  UserProvider: ({ children }) => children,
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  headers() {
    return new Headers();
  },
  cookies() {
    return new Map();
  },
}));

// Mock MongoDB
jest.mock('@/lib/database', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => Promise.resolve({
    connection: {
      db: {
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
          updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
          deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        }),
      },
    },
  })),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}; 