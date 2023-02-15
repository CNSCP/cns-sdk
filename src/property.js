// property.js - Property class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const utility = require('./utility.js');
const events = require('events');

// Property class

class Property extends events.EventEmitter {

  // Properties

  properties;
  name;
  value;
  dirty = false;

  // Constructor

  // Create new property
  constructor(options) {
    // Call base
    super();

    // Copy options
    this.properties = options.properties;
    this.name = options.name;
    this.value = options.value;
  }

  // Methods

  // Set property value
  set(value) {
    if (!utility.equal(this.value, value)) {
      this.value = value;
      this.dirty = true;
    }
  }

  // Get property value
  get() {
    return this.value;
  }
}

// Exports

exports.Property = Property;
