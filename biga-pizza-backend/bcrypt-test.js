import bcrypt from "bcrypt";

// const test = async () => {
//   const password = "test123";
//   const hash = "$2b$10$uOuKgLEO9zFWh8XnKwqleOVz9CVl0rp1asK6vGUKHf0rxiMx7BP1O"; // hash of "test123"

//   try {
//     const result = await bcrypt.compare(password, hash);
//     console.log("Match result:", result);
//   } catch (err) {
//     console.error("Error comparing:", err);
//   }
// };

// test();

// const test2 = async () => {
//   const enteredPassword = "test123";
//   const storedHash = "$2b$10$uOuKgLEO9zFWh8XnKwqleOVz9CVl0rp1asK6vGUKHf0rxiMx7BP1O"; // hash of "test123"

// bcrypt.compare(enteredPassword, storedHash, (err, result) => {
//   if (err) throw err;
//   if (result) {
//     console.log('Password is correct!');
//   } else {
//     console.log('Password is incorrect.');
//   }
// });
// }

// test2();

const run = async () => {
  const password = 'test9123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const isMatch = await bcrypt.compare('test9123', hash);
  console.log('Password match:', isMatch);
};

run();