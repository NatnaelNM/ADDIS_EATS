import { scryptSync, timingSafeEqual } from "node:crypto";

// Demo-only accounts for the Day 42 classroom exercise. Passwords are stored as
// scrypt hashes, not as plain text. Replace this in-memory list with a database
// and a production authentication library for a real application.
const SALT = "addis-eats-day42-demo-salt";
const users = [
  { id: "usr_customer_01", name: "Nati Customer", email: "customer@addiseats.test", role: "customer", passwordHash: "7393e1e99726857f60030fa8cdb60e767933ce661f2dc272e4ab2fdb5abe23fbb12f8db992b4bf0f59bf68d101ccef1a92b94212f19156b34d5396978716e8d7" },
  { id: "usr_staff_01", name: "Addis Eats Staff", email: "staff@addiseats.test", role: "staff", passwordHash: "cd2afde697ff4ef228c07281bc0d09584eb198990086fc7fc6abda1f45ed4018df1ce71f2ae3e9a5f80604d6d2d47bdefc2d055ec238c3620302b1c35265db6f" },
  { id: "usr_admin_01", name: "Addis Eats Admin", email: "admin@addiseats.test", role: "admin", passwordHash: "690def7be5cbe2f30534ddb8e5a58c927d572701b7bd25c71436f3988d56b168d451244ab16562b27b98c54a9012e1fac6b68992d77a3697c8053d505fb320c5" },
];

const usernameAliases = {
  customer: "customer@addiseats.test",
  staff: "staff@addiseats.test",
  admin: "admin@addiseats.test",
};

export function verifyCredentials(emailOrUsername, password) {
  const login = String(emailOrUsername || "").trim().toLowerCase();
  const email = usernameAliases[login] || login;
  const user = users.find((item) => item.email.toLowerCase() === email);
  if (!user || typeof password !== "string") return null;
  const candidate = scryptSync(password, SALT, 64);
  const stored = Buffer.from(user.passwordHash, "hex");
  if (candidate.length !== stored.length || !timingSafeEqual(candidate, stored)) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
