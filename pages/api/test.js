// const chai = require("chai");
// const sinonChai = require("sinon-chai");
// const MochaClass = require("mocha");
// const mocha = new MochaClass();
// mocha.suite.emit("pre-require", this, "solution", mocha);

// /**
//  * Two strings are said to be anagrams of one another if you can turn the first string into the second by rearranging its letters. For example, “table” and “bleat” are anagrams, as are “tear” and “rate”. Write a function that takes in two strings as input and determines whether they're anagrams of one another.
//  *
//  * In this case we expect the solution to be case sensitive. So, for example, "table" and "Table" wouldn't be anagrams.
//  *
//  * You can debug your code with console.log() and also write your own test cases below.
//  */

// /**
//  * @param {string} wordA The first word, contains only uppercase and lowercase letters.
//  * @param {string} wordB The second word, contains only uppercase and lowercase letters.
//  * @return {boolean} 'true' if the two words are anagrams, 'false' otherwise.
//  */

// const getCharsObject = (word) => {
//   const out = {};
//   word.split("").forEach((char) => {
//     if (!out[char]) {
//       out[char] = 1;
//     } else {
//       out[char] = +1;
//     }
//   });
//   return out;
// };
// //
// const isAnagram = (wordA, wordB) => {
//   if (wordA.length != wordB.length) return false;

//   const worda = getCharsObject(wordA);
//   const wordb = getCharsObject(wordB);

//   for (char in worda) {
//     if (worda[char] != wordb[char]) return false;
//   }
//   return true;
// };

// describe("TEST SUITE - YOU CAN ADD YOUR OWN TESTS", function () {
//   it("Anagram (table, bleat)", function () {
//     chai.expect(isAnagram("table", "bleat")).to.be.true;
//   });

//   it("No anagram (table, chair)", function () {
//     chai.expect(isAnagram("table", "chair")).to.be.false;
//   });

//   it("Anagram (tables, bleat)", function () {
//     chai.expect(isAnagram("tables", "bleat")).to.be.false;
//   });

//   it("Anagram (Tables, bLeat)", function () {
//     chai.expect(isAnagram("Table", "bLeat")).to.be.false;
//   });

//   // Add your test cases here
// });
