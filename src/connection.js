// connection.js - Connection class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const events = require('events');

// Connection class

class Connection extends events.EventEmitter {

  // Connection roles

  static CLIENT = 'client';
  static SERVER = 'server';

  // Properties

  connections;
  identifier;
  profile = '';
  version = '';
  role = '';
  status = '';
  client = '';
  server = '';
  properties = new Properties(this);

  // Constructor

  // Create new connections
  constructor(options) {
    // Call base
    super();

    // Copy options
    this.connections = options.connections;
    this.identifier = options.identifier;
  }

  // Methods

  // Message handler
  message(packet) {
    // Set connection info
    this.profile = packet.profile;
    this.version = packet.version;
    this.role = packet.role;
    this.status = packet.status;
    this.client = packet.client;
    this.server = packet.server;

    return true;
  }
}

// Exports

exports.Connection = Connection;
