// connections.js - Connections class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const utility = require('./utility.js');

// Classes

const Connection = require('./connection.js').Connection;

// Connections class

class Connections extends Array {

  // Properties

  resource;

  // Constructor

  // Create new connections
  constructor(parent) {
    // Call base
    super();

    // Copy options
    this.resource = parent;
  }

  // Methods

  // Add connection
  add(identifier) {
    // Already a connection?
    if (identifier instanceof Connection) {
      // Add the connection
      identifier.connections = this;
      this.push(identifier);

      return identifier;
    }

    // Connection exists?
    var connection = this.find(identifier);

    if (connection === null) {
      // No, create new connection
      connection = new Connection({
        connections: this,
        identifier: identifier
      });

      // Add the connection
      this.push(connection);
    }
    return connection;
  }

  // Find connection
  find(identifier) {
    const index = this.index(identifier);
    return (index >= 0)?this[index]:null;
  }

  // Get index for connection
  index(identifier) {
    // Look through connections
    for (var index in this) {
      // Identifiers match?
      if (utility.equal(identifier, this[index].identifier))
        return index;
    }
    return -1;
  }

  // Remove connection
  remove(identifier) {
    const index = this.index(identifier);
    return (index >= 0)?this.splice(index, 1):null;
  }

  // Message handler
  message(connections) {
    // Anything changed?
    var change = false;

    for (var id in connections) {
      // New connection?
      const packet = connections[id];

      const identifier = packet.identifier;

      var connection = this.find(identifier);
      var connect = false;

      if (connection === null) {
        // Yes, add connection
        connection = this.add(identifier);
        connection.message(packet);

        change = true;
        connect = true;
      }

      // Properties changed?
      if (connection.properties.message(packet.properties))
        change = true;

      // Emit connect event?
      if (connect) this.resource.emit('connect', connection);
    }
    return change;
  }
}

// Exports

exports.Connections = Connections;
