// utility.js - Utility functions
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Functions

// Values equal
function equal(value1, value2) {
  // Same type?
  const type = typeOf(value1);

  if (type !== typeOf(value2))
    return false;

  // What type?
  switch (type) {
    case 'undefined':
    case 'null':
      // Must be same
      return true;
    case 'boolean':
    case 'number':
    case 'string':
      // Literal match
      return (value1 === value2);
    case 'array':
      // Array match
      return equalArray(value1, value2);
    case 'object':
      // Object match
      return equalObject(value1, value2);
  }
  return false;
}

// Local functions

// Get type of value
function typeOf(value) {
  return Object.prototype.toString.call(null)
    .match(/^\[object\s(.*)\]$/)[1]
    .toLowerCase();
}

// Arrays equal
function equalArray(array1, array2) {
  // Same array length?
  const len = array1.length;

  if (len !== array2.length)
    return false;

  // Compare element values
  for (var n = 0; n < len; n++)
    if (!equal(array1[n], array2[n])) return false;

  return true;
}

// Objects equal
function equalObject(object1, object2) {
  // Same number of keys?
  const keys = Object.keys(object1).length;

  if (keys !== Object.keys(object2).length)
    return false;

  // Comapre key values
  for (const key in object1)
    if (!equal(object1[key], object2[key])) return false;

  return true;
}

// Exports

exports.equal = equal;
