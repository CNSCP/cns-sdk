// properties.js - Properties class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const utility = require('./utility.js');

// Classes

const Property = require('./property.js').Property;

// Properties class

class Properties extends Array {

  // Properties

  parent;

  // Constructor

  // Create new properties
  constructor(parent) {
    // Call base
    super();

    // Copy options
    this.parent = parent;
  }

  // Methods

  // Add property
  add(name) {
    // Already a property?
    if (name instanceof Property) {
      // Add the property
      name.properties = this;
      this.push(name);

      return name;
    }

    // Property exists?
    var property = this.find(name);

    if (property === null) {
      // No, create new property
      property = new Property({
        properties: this,
        name: name
      });

      // Add the property
      this.push(property);
    }
    return property;
  }

  // Find property
  find(name) {
    const index = this.index(name);
    return (index >= 0)?this[index]:null;
  }

  // Get index for property
  index(name) {
    // Look through properties
    for (var index in this) {
      // Match property name?
      if (name === this[index].name)
        return index;
    }
    return -1;
  }

  // Remove property
  remove(name) {
    const index = this.index(name);
    return (index >= 0)?this.splice(index, 1):null;
  }

  // Message handler
  message(properties) {
    // Anything changed?
    var change = false;

    for (var name in properties) {
      // Check property value
      const value = properties[name];
      const property = this.add(name);

      if (!utility.equal(property.value, value)) {
        // Set value and emit change
        property.value = value;
        property.dirty = false;//?

        property.emit('change');

        change = true;
      }
    }
    return change;
  }
}

// Exports

exports.Properties = Properties;
