import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { IUsersRepository } from "../../users/interfaces/user.interface";
import { AuthService } from "../auth.service";
import { ConflictError } from "../../../shared/errors/conflict.error";
import {
  generateFakeUser,
  generateNewUser,
} from "../../../tests/helpers/auth.helper";

describe("AuthService UNIT", () => {
  const mockUsersRepository: Mocked<IUsersRepository> = {
    create: vi.fn(),
    findByKey: vi.fn(),
  };

  const service = new AuthService(mockUsersRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create new user and return user data", async () => {
    const newUser = generateNewUser();
    const fakeUser = generateFakeUser({
      email: newUser.email,
      name: newUser.name,
    });
    mockUsersRepository.findByKey.mockResolvedValue(null);
    mockUsersRepository.create.mockResolvedValue(fakeUser);
    const result = await service.create(newUser);

    expect(mockUsersRepository.findByKey).toHaveBeenCalledWith(
      "email",
      newUser.email,
    );
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

    mockUsersRepository.findByKey.mockResolvedValue(fakeUser);

    await expect(service.create(newUser)).rejects.toThrow(ConflictError);
    expect(mockUsersRepository.findByKey).toHaveBeenCalledWith(
      "email",
      newUser.email,
    );
  });
});
