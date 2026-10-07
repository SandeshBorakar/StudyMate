/**
 * StudyMate - Mock Data & Knowledge Base
 * 
 * Provides mock responses for college academic topics without needing an external API.
 * Includes curated topics (Operating Systems, Photosynthesis, Data Structures, etc.)
 * and a dynamic fallback generator for any custom topic entered by the student.
 */

const CURATED_TOPICS = {
  "operating systems": {
    title: "Operating Systems",
    standardExplanation: "An Operating System (OS) is core system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between the user applications and the physical hardware (CPU, memory, storage, and I/O devices), handling process scheduling, memory allocation, and file systems.",
    beginnerExplanation: "Think of an Operating System like a manager at a busy restaurant. The hardware (kitchen, ovens, tables) can't coordinate itself. The OS takes your orders (applications), tells the chefs what to cook first (CPU scheduling), reserves tables (RAM memory allocation), and keeps customer receipts organized in file cabinets (storage). Without the manager, there would be total chaos!",
    keyTakeaways: [
      "Acts as a bridge between user software and raw hardware.",
      "Primary functions: Process management, Memory management, File systems, Device I/O.",
      "Common examples: Linux, Windows, macOS, Android."
    ],
    notes: {
      overview: "An Operating System (OS) is the essential layer of software that coordinates all system resources and provides a stable environment for user applications.",
      sections: [
        {
          heading: "1. Core Responsibilities",
          points: [
            "**Process Management:** Controls creation, scheduling, and termination of processes (CPU scheduling algorithms: FIFO, Round Robin, SJF).",
            "**Memory Management:** Tracks every byte of RAM, allocates memory dynamically, and implements Virtual Memory via paging.",
            "**Storage & File Systems:** Organizes data hierarchically (e.g., ext4, NTFS) and manages read/write permissions.",
            "**Device Management:** Communicates with peripherals via device drivers."
          ]
        },
        {
          heading: "2. Dual-Mode Operation",
          points: [
            "**User Mode:** Applications run with restricted privileges to prevent hardware corruption.",
            "**Kernel Mode:** Privileged mode where the OS core executes privileged CPU instructions.",
            "**System Calls:** The mechanism by which user programs request services from the OS kernel."
          ]
        },
        {
          heading: "3. Key Concepts to Remember",
          points: [
            "**Deadlock:** A situation where two or more processes are unable to proceed because each is waiting for the other to release resources.",
            "**Virtual Memory:** Extends available RAM onto secondary storage through paging, giving programs the illusion of large contiguous memory."
          ]
        }
      ]
    },
    quiz: [
      {
        question: "Which component of the operating system manages CPU scheduling and process execution?",
        options: [
          "File Allocation Table",
          "Kernel",
          "Compiler",
          "BIOS"
        ],
        answer: 1,
        explanation: "The Kernel is the core component of an OS responsible for process scheduling, memory management, and hardware communication."
      },
      {
        question: "What is the primary purpose of 'Virtual Memory' in an operating system?",
        options: [
          "To speed up internet connectivity",
          "To allow programs to use more memory than physically available in RAM",
          "To permanently store user files without saving",
          "To run graphics processing units concurrently"
        ],
        answer: 1,
        explanation: "Virtual memory uses secondary storage (like SSD/HDD) as an extension of physical RAM, allowing systems to run large applications seamlessly."
      },
      {
        question: "What occurs during a 'Deadlock' state?",
        options: [
          "The CPU overheats and shuts down immediately",
          "Two or more processes are blocked indefinitely waiting for each other's resources",
          "The hard drive runs completely out of storage space",
          "A process finishes its execution earlier than scheduled"
        ],
        answer: 1,
        explanation: "Deadlock happens when a set of processes are blocked because each process is holding a resource and waiting for another resource held by someone else."
      },
      {
        question: "Which of the following transitions is caused by a System Call?",
        options: [
          "User Mode to Kernel Mode",
          "Kernel Mode to Hardware Shutdown",
          "Sleep Mode to Hibernate Mode",
          "Read-Only to Write-Only memory"
        ],
        answer: 0,
        explanation: "System calls trigger a software interrupt that switches CPU execution from restricted User Mode to privileged Kernel Mode."
      },
      {
        question: "Which CPU scheduling algorithm gives each process a fixed slice of time in cyclic order?",
        options: [
          "Shortest Job First (SJF)",
          "Round Robin (RR)",
          "First-Come, First-Served (FCFS)",
          "Priority Inversion"
        ],
        answer: 1,
        explanation: "Round Robin scheduling assigns a fixed time quantum to each ready process in a circular queue, ensuring fair CPU time distribution."
      }
    ]
  },

  "photosynthesis": {
    title: "Photosynthesis",
    standardExplanation: "Photosynthesis is the biochemical process by which green plants, algae, and certain cyanobacteria convert radiant light energy into chemical energy stored in glucose molecules. Taking place in cellular chloroplasts, the overall reaction uses sunlight, carbon dioxide (CO₂), and water (H₂O) to produce glucose (C₆H₁₂O₆) and oxygen gas (O₂) as a byproduct.",
    beginnerExplanation: "Imagine plants as solar-powered food factories! The plant's leaves are like solar panels capturing sunlight. The roots drink water from the soil, and tiny leaf pores (stomata) breathe in carbon dioxide from the air. Using sunlight as the power source, the factory bakes sweet sugar (food for the plant to grow) and releases fresh oxygen into the air for humans and animals to breathe.",
    keyTakeaways: [
      "Chemical Equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂",
      "Occurs in the chloroplasts containing green chlorophyll pigments.",
      "Consists of two stages: Light-Dependent Reactions and the Light-Independent (Calvin) Cycle."
    ],
    notes: {
      overview: "Photosynthesis is the fundamental biological reaction powering almost all life on Earth by converting solar radiation into bioavailable chemical energy.",
      sections: [
        {
          heading: "1. The Chemical Equation",
          points: [
            "**Inputs (Reactants):** 6 molecules of Carbon Dioxide (6CO₂) + 6 molecules of Water (6H₂O) + Solar Photons.",
            "**Outputs (Products):** 1 molecule of Glucose (C₆H₁₂O₆) + 6 molecules of Oxygen gas (6O₂)."
          ]
        },
        {
          heading: "2. The Two Stages",
          points: [
            "**Stage 1: Light-Dependent Reactions (Thylakoid Membrane):** Chlorophyll absorbs photons, splits water molecules (photolysis), releases O₂, and generates ATP and NADPH energy carriers.",
            "**Stage 2: Calvin Cycle / Light-Independent (Stroma):** Uses ATP and NADPH to fix atmospheric carbon dioxide into high-energy sugars (glucose)."
          ]
        },
        {
          heading: "3. Limiting Factors",
          points: [
            "**Light Intensity:** Increases rate until light-saturation point is reached.",
            "**Carbon Dioxide Concentration:** Higher CO₂ accelerates Calvin cycle synthesis up to a plateau.",
            "**Temperature:** Optimum enzymatic activity around 25-35°C; extreme heat denatures Rubisco enzymes."
          ]
        }
      ]
    },
    quiz: [
      {
        question: "In which cell organelle does photosynthesis primarily occur in plant cells?",
        options: [
          "Mitochondria",
          "Ribosome",
          "Chloroplast",
          "Endoplasmic Reticulum"
        ],
        answer: 2,
        explanation: "Chloroplasts contain chlorophyll pigments and the necessary molecular machinery to carry out photosynthesis."
      },
      {
        question: "What is the primary gaseous byproduct released into the atmosphere during photosynthesis?",
        options: [
          "Nitrogen (N₂)",
          "Oxygen (O₂)",
          "Carbon Monoxide (CO)",
          "Methane (CH₄)"
        ],
        answer: 1,
        explanation: "Water molecules are split during light-dependent reactions, releasing molecular oxygen (O₂) into the atmosphere."
      },
      {
        question: "Where do the light-independent reactions (Calvin Cycle) take place inside the chloroplast?",
        options: [
          "Thylakoid lumen",
          "Stroma",
          "Outer membrane",
          "Cell wall"
        ],
        answer: 1,
        explanation: "The Calvin cycle occurs in the stroma, the fluid-filled region surrounding the thylakoid membranes."
      },
      {
        question: "What green pigment is responsible for absorbing sunlight photons for photosynthesis?",
        options: [
          "Carotenoid",
          "Anthocyanin",
          "Chlorophyll",
          "Hemoglobin"
        ],
        answer: 2,
        explanation: "Chlorophyll absorbs blue and red wavelengths of light while reflecting green light, giving plants their characteristic color."
      },
      {
        question: "Which two energy-carrier molecules produced in the light reactions are used to power the Calvin Cycle?",
        options: [
          "DNA and RNA",
          "ATP and NADPH",
          "Glucose and Fructose",
          "ADP and NADP+"
        ],
        answer: 1,
        explanation: "ATP provides cellular energy and NADPH provides reducing electrons to assemble glucose in the Calvin cycle."
      }
    ]
  },

  "data structures": {
    title: "Data Structures",
    standardExplanation: "In computer science, a Data Structure is a specialized format for organizing, processing, retrieving, and storing data efficiently in memory. Different data structures are optimized for specific use cases, such as fast lookup (Hash Tables), sequential ordering (Arrays, Linked Lists), hierarchical categorization (Trees), or interconnected relationships (Graphs).",
    beginnerExplanation: "Think of data structures like different storage solutions in your house. A line of coat hooks is like an Array where items are neatly numbered in a row. A sticky note to-do list is like a Linked List. A stack of clean plates in your kitchen is literally a Stack (last one placed on top is the first one taken). Choosing the right storage container makes finding and organizing your stuff quick and easy!",
    keyTakeaways: [
      "Linear structures: Arrays, Linked Lists, Stacks, Queues.",
      "Non-linear structures: Trees (BST, AVL), Heaps, Graphs.",
      "Efficiency is evaluated using Big-O time and space complexity."
    ],
    notes: {
      overview: "Choosing the correct data structure is critical for designing scalable algorithms and optimizing memory and execution time.",
      sections: [
        {
          heading: "1. Common Linear Data Structures",
          points: [
            "**Arrays:** Contiguous memory blocks with fast O(1) indexed lookups, but fixed size and O(n) insertions/deletions.",
            "**Linked Lists:** Nodes containing data and pointers to the next node. Dynamic sizing with O(1) insertions at known pointers, but O(n) traversal search.",
            "**Stacks (LIFO):** Last-In, First-Out model. Primary operations: push() and pop(). Used in call stacks and undo operations.",
            "**Queues (FIFO):** First-In, First-Out model. Primary operations: enqueue() and dequeue(). Used in print queues and BFS traversals."
          ]
        },
        {
          heading: "2. Non-Linear Structures",
          points: [
            "**Binary Search Tree (BST):** Nodes where left child < root < right child. Offers O(log n) average search, insertion, and deletion.",
            "**Hash Tables:** Key-value pairs indexed by hash codes. Provides average O(1) lookup, insertion, and deletion.",
            "**Graphs:** Vertices connected by edges. Represents networks, social connections, and pathfinding algorithms."
          ]
        },
        {
          heading: "3. Algorithm Selection Tip",
          points: [
            "Frequent lookups by key → **Hash Map**",
            "Maintaining sorted data with fast insertions → **Self-balancing BST / Heap**",
            "Backtracking or function recursion → **Stack**"
          ]
        }
      ]
    },
    quiz: [
      {
        question: "Which data structure follows the Last-In, First-Out (LIFO) principle?",
        options: [
          "Queue",
          "Stack",
          "Array",
          "Linked List"
        ],
        answer: 1,
        explanation: "A Stack follows the LIFO principle: the most recently added element is the first one to be removed."
      },
      {
        question: "What is the average time complexity for searching an element in a Hash Table?",
        options: [
          "O(1)",
          "O(n)",
          "O(n log n)",
          "O(n²)"
        ],
        answer: 0,
        explanation: "Hash tables compute array indices via a hash function, yielding average constant-time O(1) lookups."
      },
      {
        question: "What is the main advantage of a Linked List over a standard fixed Array?",
        options: [
          "Direct O(1) indexing by position number",
          "Dynamic size allocation without requiring contiguous memory blocks",
          "Consumes significantly less total memory per element",
          "Built-in automatic sorting"
        ],
        answer: 1,
        explanation: "Linked lists can grow or shrink dynamically during runtime because nodes are linked via pointers rather than contiguous memory blocks."
      },
      {
        question: "Which data structure is ideally suited for Breadth-First Search (BFS) graph traversal?",
        options: [
          "Stack",
          "Queue",
          "Binary Heap",
          "Trie"
        ],
        answer: 1,
        explanation: "BFS explores nodes level-by-level, making a First-In, First-Out (FIFO) Queue the ideal structure."
      },
      {
        question: "In a valid Binary Search Tree (BST), where is a node with a key smaller than the root placed?",
        options: [
          "Always in the right subtree",
          "Always in the left subtree",
          "At the root position itself",
          "In a separate linked array"
        ],
        answer: 1,
        explanation: "By definition, in a BST, every key in the left subtree is strictly less than the parent node's key."
      }
    ]
  },

  "machine learning": {
    title: "Machine Learning",
    standardExplanation: "Machine Learning (ML) is a branch of Artificial Intelligence (AI) focused on building algorithms that learn patterns and relationships from sample data, enabling computers to make predictions or decisions without being explicitly programmed with rule-based code. It is categorized into supervised learning, unsupervised learning, and reinforcement learning.",
    beginnerExplanation: "Think of how a toddler learns what a dog is. You don't hand the baby a 200-page rulebook explaining paw dimensions and whisker angles. Instead, you show them lots of pictures and say, 'Look, that's a dog!' After seeing enough examples, the child recognizes dogs on their own. Machine learning works the exact same way with computers and training data!",
    keyTakeaways: [
      "Supervised Learning: Trained on labeled data (e.g., house prices, spam detection).",
      "Unsupervised Learning: Finds hidden clusters in unlabeled data (e.g., customer segmentation).",
      "Reinforcement Learning: Learns through trial, error, rewards, and penalties (e.g., chess engines, robotics)."
    ],
    notes: {
      overview: "Machine Learning allows systems to automatically adapt and improve performance through empirical data training.",
      sections: [
        {
          heading: "1. Three Primary Paradigms",
          points: [
            "**Supervised Learning:** Inputs paired with correct ground-truth labels. Common tasks include Regression (predicting numbers) and Classification (predicting categories).",
            "**Unsupervised Learning:** Algorithms detect inherent structures and groupings in unlabeled data (Clustering like K-Means, Dimensionality Reduction like PCA).",
            "**Reinforcement Learning:** An autonomous agent learns optimal policies by taking actions in an environment to maximize cumulative reward."
          ]
        },
        {
          heading: "2. The Machine Learning Pipeline",
          points: [
            "1. Data Collection & Cleaning (handling missing values, outliers).",
            "2. Feature Engineering & Normalization.",
            "3. Splitting into Train (70-80%), Validation, and Test sets.",
            "4. Model Selection & Hyperparameter Tuning.",
            "5. Evaluation (Accuracy, Precision, Recall, F1-Score, RMSE)."
          ]
        },
        {
          heading: "3. Common Pitfalls",
          points: [
            "**Overfitting:** Model memorizes training noise and fails to generalize to new data.",
            "**Underfitting:** Model is too simple to capture underlying patterns.",
            "**Data Leakage:** Information from the test set unintentionally contaminates training."
          ]
        }
      ]
    },
    quiz: [
      {
        question: "Which type of machine learning uses input data that includes target ground-truth labels?",
        options: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Self-supervised Clustering"
        ],
        answer: 0,
        explanation: "Supervised learning relies on paired datasets (features + known labels) to teach models how to map inputs to outputs."
      },
      {
        question: "What problem occurs when a model performs exceptionally well on training data but poorly on unseen test data?",
        options: [
          "Underfitting",
          "Overfitting",
          "Convergence",
          "Quantization"
        ],
        answer: 1,
        explanation: "Overfitting happens when a model memorizes training noise and specifics rather than generalizable patterns."
      },
      {
        question: "Predicting the continuous numerical sale price of a house is an example of which task?",
        options: [
          "Classification",
          "Regression",
          "Clustering",
          "Dimensionality Reduction"
        ],
        answer: 1,
        explanation: "Regression predicts continuous numerical values, whereas classification predicts discrete classes or categories."
      },
      {
        question: "Which learning paradigm relies on agents taking actions to maximize rewards in an environment?",
        options: [
          "Unsupervised Learning",
          "Heuristic Indexing",
          "Reinforcement Learning",
          "Batch Processing"
        ],
        answer: 2,
        explanation: "Reinforcement learning optimizes an agent's policy through trial, error, and feedback in the form of rewards or penalties."
      },
      {
        question: "Why is a dataset commonly split into separate Training and Testing sets?",
        options: [
          "To reduce the size of the dataset on hard drives",
          "To evaluate how well the model generalizes to unseen data",
          "Because computers cannot process all rows at once",
          "To remove duplicate columns automatically"
        ],
        answer: 1,
        explanation: "Testing on held-out data ensures the model has truly learned underlying patterns rather than just memorizing training examples."
      }
    ]
  },

  "microeconomics": {
    title: "Microeconomics",
    standardExplanation: "Microeconomics is the branch of economics that analyzes the decision-making behavior of individual agents, households, and firms, and how their interactions determine the allocation of scarce resources in specific markets. Key topics include supply and demand mechanics, price elasticity, consumer utility, and market structures (perfect competition, monopoly, oligopoly).",
    beginnerExplanation: "While macroeconomics looks at whole countries and giant economies, microeconomics zooms in on everyday choices you and your local businesses make. For example: If concert tickets double in price, how many fewer fans will buy them? If a coffee shop drops latte prices, will they make more profit from higher sales volume? It's the science of individual choices when money and resources are limited.",
    keyTakeaways: [
      "Core principle: People face trade-offs and respond to incentives.",
      "The Law of Demand: As price rises, quantity demanded falls (ceteris paribus).",
      "Market equilibrium occurs where quantity supplied equals quantity demanded."
    ],
    notes: {
      overview: "Microeconomics examines how individuals and businesses allocate scarce resources through price signals and market incentives.",
      sections: [
        {
          heading: "1. Supply and Demand Dynamics",
          points: [
            "**Demand Curve:** Downward-sloping; consumers demand less quantity at higher prices.",
            "**Supply Curve:** Upward-sloping; producers supply greater quantity at higher selling prices.",
            "**Market Equilibrium:** The intersection point where Quantity Demanded (Qd) = Quantity Supplied (Qs)."
          ]
        },
        {
          heading: "2. Elasticity",
          points: [
            "**Price Elasticity of Demand (PED):** Measures responsiveness of quantity demanded to a price shift.",
            "**Elastic (|PED| > 1):** Luxury goods with many substitutes; small price increase causes huge drop in sales.",
            "**Inelastic (|PED| < 1):** Essential goods (e.g., insulin, basic food); consumers buy regardless of price fluctuations."
          ]
        },
        {
          heading: "3. Market Structures",
          points: [
            "**Perfect Competition:** Many buyers and sellers, identical products, price takers.",
            "**Monopoly:** Single seller controls the market, high barriers to entry, price setter.",
            "**Oligopoly:** Handful of dominant firms (e.g., commercial aircraft, smartphones)."
          ]
        }
      ]
    },
    quiz: [
      {
        question: "According to the Law of Demand, what generally happens to quantity demanded when price increases, holding other factors constant?",
        options: [
          "Quantity demanded increases",
          "Quantity demanded decreases",
          "Quantity demanded stays exactly the same",
          "Quantity supplied instantly becomes zero"
        ],
        answer: 1,
        explanation: "The Law of Demand states that higher prices lead to lower quantity demanded due to substitution and income effects."
      },
      {
        question: "What term describes the point where the supply curve and demand curve intersect?",
        options: [
          "Price Ceiling",
          "Market Equilibrium",
          "Deadweight Loss",
          "Marginal Surplus"
        ],
        answer: 1,
        explanation: "Market equilibrium is the price and quantity point where quantity supplied equals quantity demanded with no surplus or shortage."
      },
      {
        question: "If a product is considered 'Price Inelastic' (PED < 1), how do consumers respond to a price hike?",
        options: [
          "They stop buying the product entirely",
          "Quantity demanded changes very little because it is a necessity",
          "Consumers demand twice as much of the item",
          "Producers are forced out of business"
        ],
        answer: 1,
        explanation: "Inelastic goods (like medicine or staple foods) see very small changes in quantity demanded when prices change."
      },
      {
        question: "What market structure has only one single seller with no close substitutes and high barriers to entry?",
        options: [
          "Perfect Competition",
          "Monopolistic Competition",
          "Oligopoly",
          "Monopoly"
        ],
        answer: 3,
        explanation: "A monopoly is characterized by a single supplier dominating the entire market."
      },
      {
        question: "What is 'Opportunity Cost' in economic theory?",
        options: [
          "The monetary cost printed on a receipt",
          "The value of the next best alternative foregone when making a choice",
          "The total tax paid on a purchase",
          "The discount offered during sales promotions"
        ],
        answer: 1,
        explanation: "Opportunity cost represents the potential benefits an individual or business misses out on when choosing one alternative over another."
      }
    ]
  },

  "dbms normalization": {
    title: "DBMS Normalization",
    simpleDefinition: "DBMS normalization is the systematic technique of organizing data in a relational database to reduce data redundancy and eliminate undesirable update, insertion, and deletion anomalies.",
    detailedExplanation: "Normalization involves decomposing complex, unorganized tables into smaller, well-structured relational tables linked by relationships. Without normalization, databases suffer from three major update anomalies: Insertion Anomaly (cannot insert data without redundant attributes), Deletion Anomaly (unintended loss of related information when deleting a record), and Update Anomaly (inconsistent data when modifying values across multiple rows).\n\nNormalization progresses through distinct Normal Forms (NF):\n- **1NF (First Normal Form):** Ensures each column contains atomic (indivisible) values and each row is unique with no repeating groups.\n- **2NF (Second Normal Form):** Meets 1NF requirements and eliminates partial dependencies, meaning all non-prime attributes must depend fully on the entire candidate key.\n- **3NF (Third Normal Form):** Meets 2NF requirements and removes transitive dependencies, ensuring non-prime attributes do not depend on other non-prime attributes.\n- **BCNF (Boyce-Codd Normal Form):** An advanced version of 3NF where for every functional dependency X → Y, X must be a super key.",
    realWorldExample: "Imagine a university registration table storing Student ID, Student Name, Course ID, Course Name, and Instructor Name all in a single table. If 50 students take CS101, the instructor's name is duplicated 50 times (redundancy). If the instructor changes, you must update 50 rows (update anomaly). If all students drop CS101, you accidentally lose all record of the course existing (deletion anomaly). Normalization splits this into three clean tables: Students, Courses, and Enrollments.",
    beginnerExplanation: "Think of normalization like organizing your clothes into distinct closet drawers instead of piling everything into one giant laundry basket. If you keep socks, shirts, jeans, and coats in one basket, finding a matching pair or replacing an old shirt is messy and confusing. Normalization sorts items into dedicated drawers—one for shirts, one for pants, one for socks. Updating or removing one item no longer affects the rest of your wardrobe!",
    keyTakeaways: [
      "Minimizes data redundancy to save storage space and ensure consistency.",
      "Eliminates insertion, update, and deletion anomalies during database transactions.",
      "Organizes tables progressively through 1NF (atomicity), 2NF (no partial dependency), 3NF (no transitive dependency), and BCNF.",
      "Maintains referential integrity using primary and foreign keys without loss of relational data."
    ],
    notes: {
      overview: "Database Normalization is the formal process of evaluating relational table schemas using functional dependencies to minimize redundancy and prevent anomalies.",
      sections: [
        {
          heading: "1. The Three Database Anomalies",
          points: [
            "**Insertion Anomaly:** Inability to record certain facts without adding unrelated, redundant data (e.g., unable to add a new course until a student enrolls).",
            "**Update Anomaly:** Inconsistent database state caused by modifying redundant data in one row while missing other rows.",
            "**Deletion Anomaly:** The unintentional loss of critical information caused by deleting a row containing combined entities."
          ]
        },
        {
          heading: "2. The Progression of Normal Forms",
          points: [
            "**1NF (First Normal Form):** Eliminates multi-valued or composite attributes; every field contains atomic values.",
            "**2NF (Second Normal Form):** Table is in 1NF and contains no partial functional dependencies (every non-key attribute depends on the whole primary key).",
            "**3NF (Third Normal Form):** Table is in 2NF and contains no transitive dependencies (X → Y and Y → Z where Z depends on non-key Y).",
            "**BCNF (Boyce-Codd Normal Form):** A strict 3NF variant where for every non-trivial functional dependency X → Y, X is a superkey."
          ]
        },
        {
          heading: "3. Trade-offs: Normalization vs. Denormalization",
          points: [
            "**Normalization Benefits:** Higher data integrity, faster INSERT/UPDATE/DELETE operations, zero data duplication.",
            "**Denormalization Use Case:** Read-heavy analytics (OLAP / Data Warehouses) where joining normalized tables introduces query latency."
          ]
        }
      ]
    },
    quiz: [
      {
        question: "What is the primary objective of normalizing a relational database?",
        options: [
          "To increase storage consumption by duplicating records",
          "To reduce data redundancy and eliminate update anomalies",
          "To combine all database entities into a single massive table",
          "To disable foreign key constraints for faster writes"
        ],
        answer: 1,
        explanation: "The primary purpose of normalization is to minimize data duplication (redundancy) and prevent insertion, update, and deletion anomalies."
      },
      {
        question: "A relation is in First Normal Form (1NF) if and only if:",
        options: [
          "Every determinant is a candidate key",
          "All column values are atomic (indivisible) and there are no repeating groups",
          "It contains no foreign key relationships",
          "All attributes are sorted in alphabetical order"
        ],
        answer: 1,
        explanation: "1NF requires that all attributes contain only atomic (single, indivisible) values and that each record is uniquely identifiable."
      },
      {
        question: "Which condition must be satisfied for a relation to be in Second Normal Form (2NF)?",
        options: [
          "It must be in 1NF and contain no partial functional dependencies",
          "It must have at least five relational tables",
          "It must contain no transitive dependencies",
          "Every table must use auto-incrementing integer keys"
        ],
        answer: 0,
        explanation: "2NF requires 1NF compliance plus the complete removal of partial dependencies, meaning every non-prime attribute depends on the whole candidate key."
      },
      {
        question: "What type of dependency is eliminated when converting a relation from 2NF to 3NF?",
        options: [
          "Multivalued dependency",
          "Transitive dependency",
          "Partial dependency",
          "Cyclic dependency"
        ],
        answer: 1,
        explanation: "3NF eliminates transitive dependencies, ensuring non-prime attributes do not depend on other non-prime attributes."
      },
      {
        question: "What anomaly occurs when deleting a row causes unintended loss of completely unrelated data?",
        options: [
          "Insertion Anomaly",
          "Deletion Anomaly",
          "Update Anomaly",
          "Race Condition"
        ],
        answer: 1,
        explanation: "A Deletion Anomaly happens when deleting a record representing one fact unintentionally destroys information about another entity."
      }
    ]
  }
};

// Aliases for DBMS Normalization
CURATED_TOPICS["normalization"] = CURATED_TOPICS["dbms normalization"];
CURATED_TOPICS["database normalization"] = CURATED_TOPICS["dbms normalization"];

/**
 * Extracts the clean academic topic name from user input or natural language questions.
 * Handles queries like "What is DBMS normalization?" -> "DBMS Normalization".
 */
function extractCoreTopic(query) {
  if (!query) return '';
  let cleaned = query.trim();
  // Strip trailing punctuation
  cleaned = cleaned.replace(/[?!.,;:]+$/, '').trim();

  // Strip common conversational question prefixes
  const prefixes = [
    /^what\s+(is|are)\s+(a\s+|an\s+|the\s+)?/i,
    /^(can\s+you\s+)?explain\s+(about\s+|the\s+)?/i,
    /^define\s+(the\s+)?/i,
    /^tell\s+me\s+about\s+(the\s+)?/i,
    /^teach\s+me\s+(about\s+)?/i,
    /^how\s+does\s+/i,
    /^how\s+do\s+/i,
    /^give\s+me\s+(notes\s+on|a\s+summary\s+of|an\s+overview\s+of)\s+/i,
    /^overview\s+of\s+/i,
    /^introduction\s+to\s+/i
  ];

  for (const prefix of prefixes) {
    if (prefix.test(cleaned)) {
      cleaned = cleaned.replace(prefix, '').trim();
      break;
    }
  }

  if (!cleaned) cleaned = query.trim();

  // Format title nicely (preserve common acronyms)
  return cleaned.split(/\s+/).map(w => {
    const upper = w.toUpperCase();
    if (['DBMS', 'SQL', 'CPU', 'RAM', 'OS', 'TCP', 'UDP', 'AI', 'ML', 'API', 'REST', 'HTTP', 'IP', 'DNS', 'DFS', 'BFS', 'BST'].includes(upper)) {
      return upper;
    }
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

/**
 * Intelligent Dynamic Fallback Generator
 * Generates tailored, non-generic study materials using the 5-part structure.
 */
function generateDynamicTopicData(rawTopic) {
  const cleanTopic = extractCoreTopic(rawTopic);

  return {
    title: cleanTopic,
    simpleDefinition: `${cleanTopic} is a key concept focused on understanding core mechanisms, structured rules, and practical problem-solving in this subject area.`,
    detailedExplanation: `In academic study, understanding ${cleanTopic} requires examining its core operational flow, underlying principles, and practical constraints.\n\n- **Foundations:** How ${cleanTopic} is defined and the primary problem it solves.\n- **Mechanisms:** The step-by-step processes and interactions that govern how it behaves.\n- **Significance:** Why students and professionals study this topic to make informed decisions and design scalable solutions.`,
    realWorldExample: `A practical example of ${cleanTopic} in action is observing how industry professionals apply its rules to eliminate inefficiencies, avoid common pitfalls, and ensure predictable outcomes in production systems.`,
    beginnerExplanation: `Imagine ${cleanTopic} like a set of building blocks in your toolkit. Instead of getting intimidated by technical terms, think of it as a logical way to understand how things work step-by-step. Once you see how the foundational pieces connect together, understanding ${cleanTopic} becomes intuitive and straightforward.`,
    keyTakeaways: [
      `Core Definition: Understand the fundamental purpose and scope of ${cleanTopic}.`,
      `Key Mechanisms: Learn the sequential steps and rules governing its operation.`,
      `Trade-offs: Recognize the practical constraints, advantages, and limitations involved.`,
      `Exam Focus: Memorize essential definitions, formulas, and real-world applications.`
    ],
    notes: {
      overview: `A structured overview of ${cleanTopic}, focusing on core principles, analytical frameworks, and exam revision points.`,
      sections: [
        {
          heading: `1. Fundamentals of ${cleanTopic}`,
          points: [
            `**Primary Definition:** The fundamental conceptual framework that defines ${cleanTopic}.`,
            `**Core Purpose:** The specific academic or practical challenge this concept addresses.`,
            `**Key Terminology:** Standard vocabulary and notations necessary for mastery.`
          ]
        },
        {
          heading: `2. Mechanisms & Processes`,
          points: [
            `**Operational Flow:** The sequence of steps and transformations that take place within ${cleanTopic}.`,
            `**Boundary Conditions:** Key constraints, trade-offs, and environmental factors influencing behavior.`,
            `**Comparative Analysis:** How ${cleanTopic} relates to alternative approaches in this field.`
          ]
        },
        {
          heading: `3. Practical Applications & Study Tips`,
          points: [
            `**Real-World Utility:** Practical examples of ${cleanTopic} deployed across science, engineering, or commerce.`,
            `**High-Yield Exam Tips:** Focus on foundational rules, diagrams, and sequential workflows.`,
            `**Active Recall:** Test yourself on definitions and solve sample problem scenarios.`
          ]
        }
      ]
    },
    quiz: [
      {
        question: `What is the primary objective of studying "${cleanTopic}"?`,
        options: [
          `To build foundational understanding of its core principles and applications`,
          `To eliminate the need for any further experimentation or research`,
          `To memorize isolated facts without understanding underlying mechanisms`,
          `To restrict its usage to theoretical academic environments only`
        ],
        answer: 0,
        explanation: `Studying ${cleanTopic} equips students with theoretical frameworks and practical problem-solving capabilities.`
      },
      {
        question: `Which approach is most effective when analyzing a problem in ${cleanTopic}?`,
        options: [
          `Assuming all external variables remain completely static at all times`,
          `Breaking down the complex system into modular, testable components`,
          `Ignoring foundational definitions in favor of rapid guesswork`,
          `Relying exclusively on trial and error without structured models`
        ],
        answer: 1,
        explanation: `Systematic decomposition of complex problems into manageable sub-components is standard best practice in ${cleanTopic}.`
      },
      {
        question: `Why is understanding trade-offs important when applying ${cleanTopic}?`,
        options: [
          `Every real-world decision involves balancing competing constraints and resources`,
          `Trade-offs can always be eliminated with enough computation`,
          `It guarantees that one single metric is always 100% maximized`,
          `It is purely a theoretical exercise with no practical implications`
        ],
        answer: 0,
        explanation: `In any domain related to ${cleanTopic}, practical solutions must balance speed, accuracy, cost, and reliability.`
      },
      {
        question: `What distinguishes foundational principles in ${cleanTopic} from superficial patterns?`,
        options: [
          `Foundational principles remain true and applicable across changing contexts`,
          `Superficial patterns are universally validated by peer review`,
          `Foundational principles change unpredictably every day`,
          `Superficial patterns require rigorous mathematical proofs`
        ],
        answer: 0,
        explanation: `Core principles provide invariant truths that guide problem solving across varied conditions.`
      },
      {
        question: `What is a recommended study strategy for long-term retention of ${cleanTopic}?`,
        options: [
          `Cramming notes once right before the test without self-testing`,
          `Active recall, spaced repetition, and explaining concepts simply`,
          `Passive re-reading of textbooks without solving exercises`,
          `Avoiding diagrams and practical examples`
        ],
        answer: 1,
        explanation: `Active recall and explaining concepts in beginner-friendly terms (the Feynman technique) maximize long-term retention.`
      }
    ]
  };
}

/**
 * Retrieves curated data if available, otherwise generates high-quality fallback data.
 */
function getTopicStudyData(topicInput) {
  if (!topicInput || !topicInput.trim()) return null;
  const clean = extractCoreTopic(topicInput);
  const normalized = clean.toLowerCase();

  // Check direct match on clean name
  if (CURATED_TOPICS[normalized]) {
    return CURATED_TOPICS[normalized];
  }

  // Check partial/contains match
  for (const key of Object.keys(CURATED_TOPICS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return CURATED_TOPICS[key];
    }
  }

  // Dynamic generator fallback
  return generateDynamicTopicData(clean);
}

/**
 * Intelligent Mock Response for "Ask AI" queries
 */
function getMockAIAnswer(question, currentTopic) {
  const q = question.toLowerCase();

  if (q.includes("tcp") && q.includes("udp")) {
    return {
      title: "TCP vs UDP Comparison",
      answer: "• **TCP (Transmission Control Protocol):** Connection-oriented, guarantees packet delivery through 3-way handshakes and error checking. Slower but reliable (used for web browsing, emails, file transfers).\n\n• **UDP (User Datagram Protocol):** Connectionless, sends packets without arrival confirmation. Fast with minimal overhead, but packet loss can occur (ideal for live streaming, VoIP, and online multiplayer gaming)."
    };
  }

  if (q.includes("mitochondria") || q.includes("atp")) {
    return {
      title: "Mitochondria & ATP Production",
      answer: "Mitochondria produce ATP (adenosine triphosphate) through **cellular respiration**, specifically through three linked stages: **Glycolysis**, the **Krebs Cycle (Citric Acid Cycle)**, and **Oxidative Phosphorylation** across the inner mitochondrial membrane via ATP Synthase."
    };
  }

  if (q.includes("difference") || q.includes("vs")) {
    return {
      title: "Comparative Analysis",
      answer: `When comparing concepts in **${currentTopic || "this topic"}**, the key distinction lies in **trade-offs**:\n\n1. **Mechanism:** How each approach handles resource allocation, speed, and complexity.\n2. **Use Case:** Choosing the best solution depends on whether you prioritize predictability, performance, or simplicity.\n3. **Rule of Thumb:** Look at whether the requirements are linear or dynamic!`
    };
  }

  if (q.includes("how to study") || q.includes("exam") || q.includes("remember")) {
    return {
      title: "Effective Study Strategy",
      answer: `Here is a high-yield study routine for **${currentTopic || "college subjects"}**:\n\n1. **The Feynman Technique:** Explain the concept in plain words as if teaching a younger sibling.\n2. **Active Recall:** Use the StudyMate Quiz tab to test your memory without looking at notes.\n3. **Spaced Repetition:** Revisit the Study Notes 1 day, 3 days, and 7 days after first reading them!`
    };
  }

  // Default intelligent contextual answer
  const topicContext = currentTopic ? `Regarding **${currentTopic}**: ` : "";
  return {
    title: `AI Response to Your Question`,
    answer: `${topicContext}Great question! In academic study, breaking this down into fundamental components provides clarity.\n\n• **Core Principle:** Always identify the primary inputs, processes, and outputs involved.\n• **Key Insight:** Notice how this relates to foundational definitions we studied in this unit.\n• **Next Step:** Try testing yourself on this specific point using the Quiz tab above to lock in your understanding!`
  };
}
