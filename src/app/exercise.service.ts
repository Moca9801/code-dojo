import { Injectable } from '@angular/core';
import { Exercise, DifficultyTier } from './models';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private exercises: Exercise[] = [
    // TIER 1 - Warmup
    {
      id: 'reverse-string',
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters.',
      tier: 1,
      xpValue: 100,
      initialCode: {
        javascript: 'function reverseString(s) {\n  // your code here\n  return s.reverse();\n}',
        python: 'def reverse_string(s):\n    # your code here\n    return s[::-1]\n'
      },
      testCases: [
        { input: [['h','e','l','l','o']], expected: ['o','l','l','e','h'] },
        { input: [['H','a','n','n','a','h']], expected: ['h','a','n','n','a','H'] }
      ]
    },
    {
      id: 'fizzbuzz',
      title: 'FizzBuzz',
      description: 'Given an integer n, return a string array where:\n- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.\n- answer[i] == "Fizz" if i is divisible by 3.\n- answer[i] == "Buzz" if i is divisible by 5.\n- answer[i] == i (as a string) if none of the above conditions are true.',
      tier: 1,
      xpValue: 100,
      initialCode: {
        javascript: 'function fizzBuzz(n) {\n  // your code here\n}',
        python: 'def fizz_buzz(n):\n    # your code here\n'
      },
      testCases: [
        { input: [3], expected: ["1","2","Fizz"] },
        { input: [5], expected: ["1","2","Fizz","4","Buzz"] },
        { input: [15], expected: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] }
      ]
    },
    {
      id: 'palindrome-check',
      title: 'Palindrome Check',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
      tier: 1,
      xpValue: 120,
      initialCode: {
        javascript: 'function isPalindrome(s) {\n  // your code here\n}',
        python: 'def is_palindrome(s):\n    # your code here\n'
      },
      testCases: [
        { input: ["A man, a plan, a canal: Panama"], expected: true },
        { input: ["race a car"], expected: false },
        { input: [" "], expected: true }
      ]
    },
    {
        id: 'two-sum',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        tier: 1,
        xpValue: 150,
        initialCode: {
          javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}',
          python: 'def two_sum(nums, target):\n    prevMap = {} # val : index\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n'
        },
        testCases: [
          { input: [[2,7,11,15], 9], expected: [0,1] },
          { input: [[3,2,4], 6], expected: [1,2] },
          { input: [[3,3], 6], expected: [0,1] }
        ]
    },
    // TIER 2 - Foundations
    {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      tier: 2,
      xpValue: 250,
      initialCode: {
        javascript: 'function isValid(s) {\n  // your code here\n}',
        python: 'def is_valid(s):\n    # your code here\n'
      },
      testCases: [
        { input: ["()"], expected: true },
        { input: ["()[]{}"], expected: true },
        { input: ["(]"], expected: false },
        { input: ["([)]"], expected: false }
      ]
    },
    {
      id: 'max-subarray',
      title: 'Maximum Subarray',
      description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
      tier: 2,
      xpValue: 300,
      initialCode: {
        javascript: 'function maxSubArray(nums) {\n  // your code here\n}',
        python: 'def max_sub_array(nums):\n    # your code here\n'
      },
      testCases: [
        { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
        { input: [[1]], expected: 1 },
        { input: [[5,4,-1,7,8]], expected: 23 }
      ]
    },
    // TIER 3 - Intermediate
    {
      id: 'number-of-islands',
      title: 'Number of Islands',
      description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
      tier: 3,
      xpValue: 500,
      initialCode: {
        javascript: 'function numIslands(grid) {\n  // your code here\n}',
        python: 'def num_islands(grid):\n    # your code here\n'
      },
      testCases: [
        { 
          input: [[
            ["1","1","1","1","0"],
            ["1","1","0","1","0"],
            ["1","1","0","0","0"],
            ["0","0","0","0","0"]
          ]], 
          expected: 1 
        },
        { 
          input: [[
            ["1","1","0","0","0"],
            ["1","1","0","0","0"],
            ["0","0","1","0","0"],
            ["0","0","0","1","1"]
          ]], 
          expected: 3 
        }
      ]
    },
    // TIER 4 - Senior
    {
      id: 'edit-distance',
      title: 'Edit Distance',
      description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert, Delete, Replace.',
      tier: 4,
      xpValue: 800,
      initialCode: {
        javascript: 'function minDistance(word1, word2) {\n  // your code here\n}',
        python: 'def min_distance(word1, word2):\n    # your code here\n'
      },
      testCases: [
        { input: ["horse", "ros"], expected: 3 },
        { input: ["intention", "execution"], expected: 5 }
      ]
    },
    // TIER 5 - Brutal
    {
      id: 'sudoku-solver',
      title: 'Sudoku Solver',
      description: 'Write a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are indicated by the character ".".',
      tier: 5,
      xpValue: 1500,
      initialCode: {
        javascript: 'function solveSudoku(board) {\n  // your code here\n}',
        python: 'def solve_sudoku(board):\n    # your code here\n'
      },
      testCases: [
        { input: [[]], expected: [] } // Placeholder test
      ]
    }
  ];

  getExercises() {
    return this.exercises;
  }

  getExerciseById(id: string) {
    return this.exercises.find(e => e.id === id);
  }

  getExercisesByTier(tier: DifficultyTier) {
    return this.exercises.filter(e => e.tier === tier);
  }

  getTierStats() {
      const tiers: DifficultyTier[] = [1, 2, 3, 4, 5];
      return tiers.map(t => ({
          tier: t,
          total: this.exercises.filter(e => e.tier === t).length
      }));
  }
}
