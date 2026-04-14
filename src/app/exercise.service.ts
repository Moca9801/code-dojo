import { Injectable } from '@angular/core';
import { Exercise, DifficultyTier } from './models';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private exercises: Exercise[] = [
    // TIER 1 - Warmup (10)
    {
      id: 'reverse-string',
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters.',
      tier: 1,
      xpValue: 100,
      initialCode: {
        javascript: 'function reverseString(s) {\n  // your code here\n}',
        python: 'def reverse_string(s):\n    # your code here\n'
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
        { input: [5], expected: ["1","2","Fizz","4","Buzz"] }
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
        { input: ["race a car"], expected: false }
      ]
    },
    {
        id: 'two-sum',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        tier: 1,
        xpValue: 150,
        initialCode: {
          javascript: 'function twoSum(nums, target) {\n  // your code here\n}',
          python: 'def two_sum(nums, target):\n    # your code here\n'
        },
        testCases: [
          { input: [[2,7,11,15], 9], expected: [0,1] },
          { input: [[3,2,4], 6], expected: [1,2] }
        ]
    },
    {
        id: 'move-zeroes',
        title: 'Move Zeroes',
        description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
        tier: 1,
        xpValue: 130,
        initialCode: {
          javascript: 'function moveZeroes(nums) {\n  // your code here\n  return nums;\n}',
          python: 'def move_zeroes(nums):\n    # your code here\n    return nums\n'
        },
        testCases: [
          { input: [[0,1,0,3,12]], expected: [1,3,12,0,0] },
          { input: [[0]], expected: [0] }
        ]
    },
    {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        tier: 1,
        xpValue: 100,
        initialCode: {
          javascript: 'function containsDuplicate(nums) {\n  // your code here\n}',
          python: 'def contains_duplicate(nums):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,2,3,1]], expected: true },
          { input: [[1,2,3,4]], expected: false }
        ]
    },
    {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        tier: 1,
        xpValue: 110,
        initialCode: {
          javascript: 'function isAnagram(s, t) {\n  // your code here\n}',
          python: 'def is_anagram(s, t):\n    # your code here\n'
        },
        testCases: [
          { input: ["anagram", "nagaram"], expected: true },
          { input: ["rat", "car"], expected: false }
        ]
    },
    {
        id: 'longest-common-prefix',
        title: 'Longest Common Prefix',
        description: 'Write a function to find the longest common prefix string amongst an array of strings.',
        tier: 1,
        xpValue: 140,
        initialCode: {
          javascript: 'function longestCommonPrefix(strs) {\n  // your code here\n}',
          python: 'def longest_common_prefix(strs):\n    # your code here\n'
        },
        testCases: [
          { input: [["flower","flow","flight"]], expected: "fl" },
          { input: [["dog","racecar","car"]], expected: "" }
        ]
    },
    {
        id: 'plus-one',
        title: 'Plus One',
        description: 'You are given a large integer represented as an integer array digits. Increment the large integer by one and return the resulting array.',
        tier: 1,
        xpValue: 100,
        initialCode: {
          javascript: 'function plusOne(digits) {\n  // your code here\n}',
          python: 'def plus_one(digits):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,2,3]], expected: [1,2,4] },
          { input: [[9]], expected: [1,0] }
        ]
    },
    {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        tier: 1,
        xpValue: 150,
        initialCode: {
          javascript: 'function climbStairs(n) {\n  // your code here\n}',
          python: 'def climb_stairs(n):\n    # your code here\n'
        },
        testCases: [
          { input: [2], expected: 2 },
          { input: [3], expected: 3 }
        ]
    },

    // TIER 2 - Foundations (10)
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
        { input: ["(]"], expected: false }
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
        { input: [[1]], expected: 1 }
      ]
    },
    {
        id: 'rotate-array',
        title: 'Rotate Array',
        description: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.',
        tier: 2,
        xpValue: 280,
        initialCode: {
          javascript: 'function rotate(nums, k) {\n  // your code here\n  return nums;\n}',
          python: 'def rotate(nums, k):\n    # your code here\n    return nums\n'
        },
        testCases: [
          { input: [[1,2,3,4,5,6,7], 3], expected: [5,6,7,1,2,3,4] }
        ]
    },
    {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        tier: 2,
        xpValue: 350,
        initialCode: {
          javascript: 'function groupAnagrams(strs) {\n  // your code here\n}',
          python: 'def group_anagrams(strs):\n    # your code here\n'
        },
        testCases: [
          { input: [["eat","tea","tan","ate","nat","bat"]], expected: [["eat","tea","ate"],["tan","nat"],["bat"]] }
        ]
    },
    {
        id: 'top-k-frequent',
        title: 'Top K Frequent Elements',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
        tier: 2,
        xpValue: 320,
        initialCode: {
          javascript: 'function topKFrequent(nums, k) {\n  // your code here\n}',
          python: 'def top_k_frequent(nums, k):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,1,1,2,2,3], 2], expected: [1,2] }
        ]
    },
    {
        id: '3sum',
        title: '3Sum',
        description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
        tier: 2,
        xpValue: 400,
        initialCode: {
          javascript: 'function threeSum(nums) {\n  // your code here\n}',
          python: 'def three_sum(nums):\n    # your code here\n'
        },
        testCases: [
          { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]] }
        ]
    },
    {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
        tier: 2,
        xpValue: 380,
        initialCode: {
          javascript: 'function maxArea(height) {\n  // your code here\n}',
          python: 'def max_area(height):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,8,6,2,5,4,8,3,7]], expected: 49 }
        ]
    },
    {
        id: 'best-time-to-buy-stock',
        title: 'Best Time to Buy Stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
        tier: 2,
        xpValue: 260,
        initialCode: {
          javascript: 'function maxProfit(prices) {\n  // your code here\n}',
          python: 'def max_profit(prices):\n    # your code here\n'
        },
        testCases: [
          { input: [[7,1,5,3,6,4]], expected: 5 }
        ]
    },
    {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
        tier: 2,
        xpValue: 450,
        initialCode: {
          javascript: 'function search(nums, target) {\n  // your code here\n}',
          python: 'def search(nums, target):\n    # your code here\n'
        },
        testCases: [
          { input: [[4,5,6,7,0,1,2], 0], expected: 4 }
        ]
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
        tier: 2,
        xpValue: 200,
        initialCode: {
          javascript: 'function search(nums, target) {\n  // your code here\n}',
          python: 'def search(nums, target):\n    # your code here\n'
        },
        testCases: [
          { input: [[-1,0,3,5,9,12], 9], expected: 4 }
        ]
    },

    // TIER 3 - Intermediate (10)
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
            ["1","1","0","0","0"],
            ["1","1","0","0","0"],
            ["0","0","1","0","0"],
            ["0","0","0","1","1"]
          ]], 
          expected: 3 
        }
      ]
    },
    {
        id: 'course-schedule',
        title: 'Course Schedule',
        description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Some courses may have prerequisites. Return true if you can finish all courses.',
        tier: 3,
        xpValue: 600,
        initialCode: {
          javascript: 'function canFinish(numCourses, prerequisites) {\n  // your code here\n}',
          python: 'def can_finish(num_courses, prerequisites):\n    # your code here\n'
        },
        testCases: [
          { input: [2, [[1,0]]], expected: true },
          { input: [2, [[1,0],[0,1]]], expected: false }
        ]
    },
    {
        id: 'lru-cache',
        title: 'LRU Cache',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        tier: 3,
        xpValue: 650,
        initialCode: {
          javascript: '/**\n * @param {number} capacity\n */\nvar LRUCache = function(capacity) {\n    \n};\n',
          python: 'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n'
        },
        testCases: [] // Complex test
    },
    {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        tier: 3,
        xpValue: 550,
        initialCode: {
          javascript: 'function lengthOfLIS(nums) {\n  // your code here\n}',
          python: 'def length_of_lis(nums):\n    # your code here\n'
        },
        testCases: [
          { input: [[10,9,2,5,3,7,101,18]], expected: 4 }
        ]
    },
    {
        id: 'decode-ways',
        title: 'Decode Ways',
        description: 'A message containing letters from A-Z can be encoded into numbers. Given a string s containing only digits, return the number of ways to decode it.',
        tier: 3,
        xpValue: 580,
        initialCode: {
          javascript: 'function numDecodings(s) {\n  // your code here\n}',
          python: 'def num_decodings(s):\n    # your code here\n'
        },
        testCases: [
          { input: ["12"], expected: 2 },
          { input: ["226"], expected: 3 }
        ]
    },
    {
        id: 'word-search',
        title: 'Word Search',
        description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.',
        tier: 3,
        xpValue: 520,
        initialCode: {
          javascript: 'function exist(board, word) {\n  // your code here\n}',
          python: 'def exist(board, word):\n    # your code here\n'
        },
        testCases: [
            { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"], expected: true }
        ]
    },
    {
        id: 'coin-change',
        title: 'Coin Change',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.',
        tier: 3,
        xpValue: 540,
        initialCode: {
          javascript: 'function coinChange(coins, amount) {\n  // your code here\n}',
          python: 'def coin_change(coins, amount):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,2,5], 11], expected: 3 }
        ]
    },
    {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
        tier: 3,
        xpValue: 510,
        initialCode: {
          javascript: 'function merge(intervals) {\n  // your code here\n}',
          python: 'def merge(intervals):\n    # your code here\n'
        },
        testCases: [
          { input: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] }
        ]
    },
    {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
        tier: 3,
        xpValue: 530,
        initialCode: {
          javascript: 'function isValidBST(root) {\n  // your code here\n}',
          python: 'def is_valid_bst(root):\n    # your code here\n'
        },
        testCases: []
    },
    {
        id: 'house-robber',
        title: 'House Robber',
        description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Return the maximum amount of money you can rob tonight without alerting the police.',
        tier: 3,
        xpValue: 480,
        initialCode: {
          javascript: 'function rob(nums) {\n  // your code here\n}',
          python: 'def rob(nums):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,2,3,1]], expected: 4 }
        ]
    },

    // TIER 4 - Senior (10)
    {
      id: 'edit-distance',
      title: 'Edit Distance',
      description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.',
      tier: 4,
      xpValue: 800,
      initialCode: {
        javascript: 'function minDistance(word1, word2) {\n  // your code here\n}',
        python: 'def min_distance(word1, word2):\n    # your code here\n'
      },
      testCases: [
        { input: ["horse", "ros"], expected: 3 }
      ]
    },
    {
        id: 'word-ladder',
        title: 'Word Ladder',
        description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList.',
        tier: 4,
        xpValue: 900,
        initialCode: {
          javascript: 'function ladderLength(beginWord, endWord, wordList) {\n  // your code here\n}',
          python: 'def ladder_length(begin_word, end_word, word_list):\n    # your code here\n'
        },
        testCases: [
          { input: ["hit", "cog", ["hot","dot","dog","lot","log","cog"]], expected: 5 }
        ]
    },
    {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
        tier: 4,
        xpValue: 950,
        initialCode: {
          javascript: 'function minWindow(s, t) {\n  // your code here\n}',
          python: 'def min_window(s, t):\n    # your code here\n'
        },
        testCases: [
          { input: ["ADOBECODEBANC", "ABC"], expected: "BANC" }
        ]
    },
    {
        id: 'maximal-rectangle',
        title: 'Maximal Rectangle',
        description: 'Given a rows x cols binary matrix filled with 0\'s and 1\'s, find the largest rectangle containing only 1\'s and return its area.',
        tier: 4,
        xpValue: 1000,
        initialCode: {
          javascript: 'function maximalRectangle(matrix) {\n  // your code here\n}',
          python: 'def maximal_rectangle(matrix):\n    # your code here\n'
        },
        testCases: [
          { input: [[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]], expected: 6 }
        ]
    },
    {
        id: 'serialize-deserialize-tree',
        title: 'Serialize and Deserialize Binary Tree',
        description: 'Design an algorithm to serialize and deserialize a binary tree.',
        tier: 4,
        xpValue: 850,
        initialCode: {
          javascript: 'function serialize(root) {};\nfunction deserialize(data) {};',
          python: 'class Codec:\n    def serialize(self, root):\n        pass\n'
        },
        testCases: []
    },
    {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        tier: 4,
        xpValue: 880,
        initialCode: {
          javascript: 'function trap(height) {\n  // your code here\n}',
          python: 'def trap(height):\n    # your code here\n'
        },
        testCases: [
          { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 }
        ]
    },
    {
        id: 'sliding-window-maximum',
        title: 'Sliding Window Maximum',
        description: 'Given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.',
        tier: 4,
        xpValue: 820,
        initialCode: {
          javascript: 'function maxSlidingWindow(nums, k) {\n  // your code here\n}',
          python: 'def max_sliding_window(nums, k):\n    # your code here\n'
        },
        testCases: [
          { input: [[1,3,-1,-3,5,3,6,7], 3], expected: [3,3,5,5,6,7] }
        ]
    },
    {
        id: 'longest-consecutive-sequence',
        title: 'Longest Consecutive Sequence',
        description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.',
        tier: 4,
        xpValue: 780,
        initialCode: {
          javascript: 'function longestConsecutive(nums) {\n  // your code here\n}',
          python: 'def longest_consecutive(nums):\n    # your code here\n'
        },
        testCases: [
          { input: [[100,4,200,1,3,2]], expected: 4 }
        ]
    },
    {
        id: 'alien-dictionary',
        title: 'Alien Dictionary',
        description: 'There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.',
        tier: 4,
        xpValue: 1100,
        initialCode: {
          javascript: 'function alienOrder(words) {\n  // your code here\n}',
          python: 'def alien_order(words):\n    # your code here\n'
        },
        testCases: [
          { input: [["wrt","wrf","er","ett","rftt"]], expected: "wertf" }
        ]
    },
    {
        id: 'regular-expression-matching',
        title: 'Regular Expression Matching',
        description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*".',
        tier: 4,
        xpValue: 1200,
        initialCode: {
          javascript: 'function isMatch(s, p) {\n  // your code here\n}',
          python: 'def is_match(s, p):\n    # your code here\n'
        },
        testCases: [
          { input: ["aa", "a*"], expected: true }
        ]
    },

    // TIER 5 - Brutal (2)
    {
      id: 'sudoku-solver',
      title: 'Sudoku Solver',
      description: 'Write a program to solve a Sudoku puzzle by filling the empty cells.',
      tier: 5,
      xpValue: 1500,
      initialCode: {
        javascript: 'function solveSudoku(board) {\n  // your code here\n}',
        python: 'def solve_sudoku(board):\n    # your code here\n'
      },
      testCases: []
    },
    {
        id: 'critical-connections',
        title: 'Critical Connections in a Network',
        description: 'Find all critical connections in a network (Tarjan\'s algorithm).',
        tier: 5,
        xpValue: 2000,
        initialCode: {
          javascript: 'function criticalConnections(n, connections) {\n  // your code here\n}',
          python: 'def critical_connections(n, connections):\n    # your code here\n'
        },
        testCases: []
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
