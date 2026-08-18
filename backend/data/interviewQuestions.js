const interviewQuestions = [

  // ========================================
  // JAVASCRIPT
  // ========================================

  {
    id: 1,
    role: "Full Stack Developer",
    category: "JavaScript",
    difficulty: "Easy",

    question:
      "What is the difference between var, let, and const in JavaScript?",

    answer:
      "var is function-scoped, while let and const are block-scoped. A let variable can be reassigned, but a const variable cannot be reassigned.",

    topic: "JavaScript Basics"
  },


  {
    id: 2,
    role: "Full Stack Developer",
    category: "JavaScript",
    difficulty: "Easy",

    question:
      "What is a JavaScript function?",

    answer:
      "A function is a reusable block of code designed to perform a particular task. It can receive inputs called parameters and can return a result.",

    topic: "Functions"
  },


  {
    id: 3,
    role: "Full Stack Developer",
    category: "JavaScript",
    difficulty: "Medium",

    question:
      "What is the difference between == and === in JavaScript?",

    answer:
      "The == operator compares values after type conversion, while === compares both value and data type without performing type conversion.",

    topic: "Operators"
  },


  // ========================================
  // PYTHON
  // ========================================

  {
    id: 4,
    role: "Python Developer",
    category: "Python",
    difficulty: "Easy",

    question:
      "What is a list in Python?",

    answer:
      "A list is an ordered and mutable collection that can contain multiple values. Lists are created using square brackets.",

    topic: "Python Basics"
  },


  {
    id: 5,
    role: "Python Developer",
    category: "Python",
    difficulty: "Easy",

    question:
      "What is the difference between a list and a tuple in Python?",

    answer:
      "A list is mutable, meaning its elements can be changed. A tuple is immutable, meaning its elements cannot be changed after creation.",

    topic: "Data Structures"
  },


  {
    id: 6,
    role: "Python Developer",
    category: "Python",
    difficulty: "Medium",

    question:
      "What is a dictionary in Python?",

    answer:
      "A dictionary is a collection of key-value pairs. It is commonly used when data needs to be accessed using unique keys.",

    topic: "Data Structures"
  },


  // ========================================
  // JAVA
  // ========================================

  {
    id: 7,
    role: "Java Developer",
    category: "Java",
    difficulty: "Easy",

    question:
      "What is Java?",

    answer:
      "Java is a high-level, object-oriented programming language designed to be platform independent through the Java Virtual Machine.",

    topic: "Java Basics"
  },


  {
    id: 8,
    role: "Java Developer",
    category: "Java",
    difficulty: "Easy",

    question:
      "What is a class in Java?",

    answer:
      "A class is a blueprint for creating objects. It defines the data and behavior that objects created from the class can have.",

    topic: "OOP"
  },


  {
    id: 9,
    role: "Java Developer",
    category: "Java",
    difficulty: "Medium",

    question:
      "What is inheritance in Java?",

    answer:
      "Inheritance allows one class to acquire properties and methods from another class. It promotes code reuse and represents an IS-A relationship.",

    topic: "OOP"
  },


  // ========================================
  // SQL
  // ========================================

  {
    id: 10,
    role: "Backend Developer",
    category: "SQL",
    difficulty: "Easy",

    question:
      "What is SQL?",

    answer:
      "SQL stands for Structured Query Language. It is used to create, read, update, and delete data in relational databases.",

    topic: "SQL Basics"
  },


  {
    id: 11,
    role: "Backend Developer",
    category: "SQL",
    difficulty: "Easy",

    question:
      "What is the difference between WHERE and HAVING?",

    answer:
      "WHERE filters rows before grouping, while HAVING filters groups after GROUP BY is applied.",

    topic: "SQL Queries"
  },


  {
    id: 12,
    role: "Backend Developer",
    category: "SQL",
    difficulty: "Medium",

    question:
      "What is a primary key?",

    answer:
      "A primary key uniquely identifies each row in a database table. It cannot contain duplicate values and normally cannot contain NULL values.",

    topic: "Database"
  }

];


module.exports = interviewQuestions;