import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import {
  ICreateUserInput,
  IUsersRepository,
} from "../../users/interfaces/user.interface";
import { AuthService } from "../auth.service";
import { User } from "../../../database/generated/prisma";
import { ConflictError } from "../../../shared/errors/conflict.error";

function generateNewUser(override?: Record<string, unknown>): ICreateUserInput {
  return {
    email: "fake@test.com",
    name: "Fake User",
    password: "12345678",
    confirmPassword: "12345678",
    ...override,
  };
}

function generateFakeUser(override?: Record<string, unknown>): User {
  return {
    id: "UUID",
    email: "fake@test.com",
    name: "Fake User",
    role: "USER",
    passwordHash: "1234",
    ...override,
  };
}

describe("AuthService UNIT", () => {
  const mockUsersRepository: Mocked<IUsersRepository> = {
    create: vi.fn(),
    findByEmail: vi.fn(),
  };

  const service = new AuthService(mockUsersRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create new user and return user data", async () => {
    const newUser = generateNewUser();
    const fakeUser: User = {
      id: "UUID",
      email: newUser.email,
      name: newUser.name,
      role: "USER",
      passwordHash: "1234",
    };
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.create.mockResolvedValue(fakeUser);
    const result = await service.create(newUser);

    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(newUser.email);
    expect(mockUsersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: newUser.email,
        name: newUser.name,
        passwordHash: expect.any(String),
      }),
    );
    expect(result.email).toBe(newUser.email);
    expect(result.name).toBe(newUser.name);
    expect(result).not.toHaveProperty("passwordHash");
    expect(result).not.toHaveProperty("id");
  });

  it("should throw ConflictError when email already exist", async () => {
    const newUser = generateNewUser();
    const fakeUser = generateFakeUser();

    mockUsersRepository.findByEmail.mockResolvedValue(fakeUser);

    await expect(service.create(newUser)).rejects.toThrow(ConflictError);
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(newUser.email);
  });
});
