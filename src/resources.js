// resources.js - Resources class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const utility = require('./utility.js');

// Classes

const Resource = require('./resource.js').Resource;

// Resources class

class Resources extends Array {

  // Properties

  application;

  // Constructor

  // Create new resources
  constructor(application) {
    // Call base
    super();

    // Copy parent
    this.application = application;
  }

  // Methods

  // Add resource
  add(identifier) {
    // Already a resource?
    if (identifier instanceof Resource) {
      // Add the resource
      identifier.resources = this;
      this.push(identifier);

      return identifier;
    }

    // Resource exists?
    var resource = this.find(identifier);

    if (resource === null) {
      // No, create new resource
      resource = new Resource({
        resources: this,
        identifier: identifier
      });

      // Add the resource
      this.push(resource);
    }
    return resource;
  }

  // Find resource
  find(identifier) {
    const index = this.index(identifier);
    return (index >= 0)?this[index]:null;
  }

  // Get index for resource
  index(identifier) {
    // Look through resources
    for (var index = 0; index < this.length; index++) {
      // Identifiers match?
      if (utility.equal(identifier, this[index].identifier))
        return index;
    }
    return -1;
  }

  // Remove resource
  remove(identifier) {
    const index = this.index(identifier);
    return (index >= 0)?this.splice(index, 1):null;
  }
}

// Exports

exports.Resources = Resources;
