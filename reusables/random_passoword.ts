import { generate } from "generate-password";

function randomPassword(length: number) {
  return generate({
    length,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
}

export default randomPassword;
