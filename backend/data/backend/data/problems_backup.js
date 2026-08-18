/*
========================================
CAREERAI CODING PROBLEMS
========================================

This file stores the coding questions
used by our CareerAI platform.

Later we can move these questions
to MongoDB/PostgreSQL.

For now, we keep them in JavaScript
so the backend is easy to understand.
*/


const problems = [

  /*
  ========================================
  JAVASCRIPT
  ========================================
  */

  {
    id: 1,

    language: "javascript",

    title: "Reverse a String",

    difficulty: "Easy",

    topic: "Strings",

    description:
      "Write a program to reverse a given string.",

    input:
      "hello",

    expectedOutput:
      "olleh"
  },


  {
    id: 2,

    language: "javascript",

    title: "Find Largest Number",

    difficulty: "Easy",

    topic: "Arrays",

    description:
      "Find the largest number in an array.",

    input:
      "[10, 25, 7, 40, 15]",

    expectedOutput:
      "40"
  },


  /*
  ========================================
  PYTHON
  ========================================
  */

  {
    id: 3,

    language: "python",

    title: "Reverse a String",

    difficulty: "Easy",

    topic: "Strings",

    description:
      "Write a Python program to reverse a string.",

    input:
      "hello",

    expectedOutput:
      "olleh"
  },


  {
    id: 4,

    language: "python",

    title: "Find Maximum",

    difficulty: "Easy",

    topic: "Lists",

    description:
      "Find the largest number in a list.",

    input:
      "[10, 25, 7, 40, 15]",

    expectedOutput:
      "40"
  },


  /*
  ========================================
  JAVA
  ========================================
  */

  {
    id: 5,

    language: "java",

    title: "Reverse a String",

    difficulty: "Easy",

    topic: "Strings",

    description:
      "Write a Java program to reverse a string.",

    input:
      "hello",

    expectedOutput:
      "olleh"
  },


  {
    id: 6,

    language: "java",

    title: "Find Largest Number",

    difficulty: "Easy",

    topic: "Arrays",

    description:
      "Find the largest number in an integer array.",

    input:
      "[10, 25, 7, 40, 15]",

    expectedOutput:
      "40"
  },


  /*
  ========================================
  SQL
  ========================================
  */

  {
    id: 7,

    language: "sql",

    title: "Select All Employees",

    difficulty: "Easy",

    topic: "SELECT",

    description:
      "Display all records from the employees table.",

    input:
      "employees(id, name, department, salary)",

    expectedOutput:
      "SELECT * FROM employees;"
  },


  {
    id: 8,

    language: "sql",

    title: "Find High Salary Employees",

    difficulty: "Easy",

    topic: "WHERE",

    description:
      "Find employees whose salary is greater than 50000.",

    input:
      "employees(id, name, department, salary)",

    expectedOutput:
      "SELECT * FROM employees WHERE salary > 50000;"
  }

];


module.exports = problems;