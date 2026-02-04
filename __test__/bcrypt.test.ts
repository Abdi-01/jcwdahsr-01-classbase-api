import bcrypt from "bcrypt";
import { hashPassword } from "../src/utils/hashPassword";

jest.mock("bcrypt");

describe("Hashing Test", () => {
  it("Should return sample-hash", async () => {
    (bcrypt.hash as jest.Mock).mockReturnValue("sample-hash");

    const newPassword = await hashPassword("321");
    expect(newPassword).toBe("sample-hash");
  });
});
