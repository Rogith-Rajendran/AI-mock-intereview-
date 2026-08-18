/*
========================================
CAREERAI CODING PROBLEMS
========================================

Coding problems and test cases used
by the CareerAI platform.

Each problem now contains multiple
test cases so the backend can later
evaluate submitted solutions.
========================================
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
      "olleh",

    testCases: [

      {
        input: "hello",
        expectedOutput: "olleh"
      },

      {
        input: "career",
        expectedOutput: "reerac"
      },

      {
        input: "abc",
        expectedOutput: "cba"
      },

      {
        input: "CareerAI",
        expectedOutput: "IAreeraC"
      }

    ]

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
      "40",

    testCases: [

      {
        input: "[10, 25, 7, 40, 15]",
        expectedOutput: "40"
      },

      {
        input: "[5, 2, 9, 1]",
        expectedOutput: "9"
      },

      {
        input: "[100, 50, 25]",
        expectedOutput: "100"
      },

      {
        input: "[-5, -2, -10]",
        expectedOutput: "-2"
      }

    ]

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
      "olleh",

    testCases: [

      {
        input: "hello",
        expectedOutput: "olleh"
      },

      {
        input: "career",
        expectedOutput: "reerac"
      },

      {
        input: "python",
        expectedOutput: "nohtyp"
      },

      {
        input: "abc",
        expectedOutput: "cba"
      }

    ]

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
      "40",

    testCases: [

      {
        input: "[10, 25, 7, 40, 15]",
        expectedOutput: "40"
      },

      {
        input: "[1, 5, 3, 9]",
        expectedOutput: "9"
      },

      {
        input: "[100, 200, 50]",
        expectedOutput: "200"
      },

      {
        input: "[-10, -5, -20]",
        expectedOutput: "-5"
      }

    ]

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
      "olleh",

    testCases: [

      {
        input: "hello",
        expectedOutput: "olleh"
      },

      {
        input: "career",
        expectedOutput: "reerac"
      },

      {
        input: "java",
        expectedOutput: "avaj"
      },

      {
        input: "abc",
        expectedOutput: "cba"
      }

    ]

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
      "40",

    testCases: [

      {
        input: "[10, 25, 7, 40, 15]",
        expectedOutput: "40"
      },

      {
        input: "[5, 20, 3, 8]",
        expectedOutput: "20"
      },

      {
        input: "[100, 75, 50]",
        expectedOutput: "100"
      },

      {
        input: "[-8, -3, -10]",
        expectedOutput: "-3"
      }

    ]

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
      "SELECT * FROM employees;",

    testCases: [

      {
        input:
          "SELECT * FROM employees;",
        expectedOutput:
          "SELECT * FROM employees;"
      }

    ]

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
      "SELECT * FROM employees WHERE salary > 50000;",

    testCases: [

      {
        input:
          "SELECT * FROM employees WHERE salary > 50000;",
        expectedOutput:
          "SELECT * FROM employees WHERE salary > 50000;"
      }

    ]

  }

];


module.exports = problems;