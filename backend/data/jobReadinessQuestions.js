const jobReadinessQuestions = [

  // ========================================
  // JAVASCRIPT
  // ========================================

  {
    id: 1,
    category: "JavaScript",
    difficulty: "Easy",

    question:
      "Which keyword is used to declare a variable that cannot be reassigned?",

    options: [
      "var",
      "let",
      "const",
      "function"
    ],

    correctAnswer: "const"
  },


  {
    id: 2,
    category: "JavaScript",
    difficulty: "Medium",

    question:
      "Which method is commonly used to create a new array by transforming every element of an existing array?",

    options: [
      "filter()",
      "map()",
      "reduce()",
      "find()"
    ],

    correctAnswer: "map()"
  },


  // ========================================
  // REACT
  // ========================================

  {
    id: 3,
    category: "React",
    difficulty: "Easy",

    question:
      "Which React Hook is commonly used to manage state in a functional component?",

    options: [
      "useState",
      "useRoute",
      "useClass",
      "useComponent"
    ],

    correctAnswer: "useState"
  },


  {
    id: 4,
    category: "React",
    difficulty: "Medium",

    question:
      "Which Hook is commonly used to perform side effects in a React component?",

    options: [
      "useState",
      "useEffect",
      "useStyle",
      "useRender"
    ],

    correctAnswer: "useEffect"
  },


  // ========================================
  // NODE.JS
  // ========================================

  {
    id: 5,
    category: "Node.js",
    difficulty: "Easy",

    question:
      "What is Node.js primarily used for?",

    options: [
      "Running JavaScript outside the browser",
      "Creating HTML only",
      "Designing images",
      "Managing CSS styles"
    ],

    correctAnswer:
      "Running JavaScript outside the browser"
  },


  {
    id: 6,
    category: "Node.js",
    difficulty: "Medium",

    question:
      "Which package is commonly used to create web servers and APIs with Node.js?",

    options: [
      "Express",
      "React",
      "MongoDB",
      "HTML"
    ],

    correctAnswer: "Express"
  },


  // ========================================
  // DATABASE
  // ========================================

  {
    id: 7,
    category: "Database",
    difficulty: "Easy",

    question:
      "Which SQL command is used to retrieve data from a database table?",

    options: [
      "INSERT",
      "UPDATE",
      "SELECT",
      "DELETE"
    ],

    correctAnswer: "SELECT"
  },


  {
    id: 8,
    category: "Database",
    difficulty: "Medium",

    question:
      "What is the main purpose of a primary key?",

    options: [
      "To store duplicate rows",
      "To uniquely identify each row",
      "To delete a table",
      "To sort every column"
    ],

    correctAnswer:
      "To uniquely identify each row"
  },


  // ========================================
  // PROBLEM SOLVING
  // ========================================

  {
    id: 9,
    category: "Problem Solving",
    difficulty: "Easy",

    question:
      "What is the time complexity of accessing an element by index in an array?",

    options: [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)"
    ],

    correctAnswer: "O(1)"
  },


  {
    id: 10,
    category: "Problem Solving",
    difficulty: "Medium",

    question:
      "Which data structure follows the Last In First Out principle?",

    options: [
      "Queue",
      "Stack",
      "Array",
      "Graph"
    ],

    correctAnswer: "Stack"
  }

];


module.exports = jobReadinessQuestions;