// resource.js - Resource class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const events = require('events');

// Classes

const Properties = require('./properties.js').Properties;
const Connections = require('./connections.js').Connections;

// Resource class

class Resource extends events.EventEmitter {

  // Resource status

  static UNSUBSCRIBED = 0;
  static SUBSCRIBED = 1;

  // Properties

  resources;
  identifier;
  status = Resource.UNSUBSCRIBED;
  properties = new Properties(this);
  connections = new Connections(this);

  // Constructor

  // Create new resource
  constructor(options) {
    // Call base
    super();

    // Copy options
    this.resources = options.resources;
    this.identifier = options.identifier;
  }

  // Methods

  // Subscribe resource
  subscribe() {
    this.resources.application.subscribe(this);
    return this;
  }

  // Publish resource
  publish() {
    this.resources.application.publish(this);
    return this;
  }

  // Unsubscribe resource
  unsubscribe() {
    this.resources.application.unsubscribe(this);
    return this;
  }

  // Message handler
  message(packet) {
    // Anything changed?
    var change = false;

    if (this.properties.message(packet.properties)) change = true;
    if (this.connections.message(packet.connections)) change = true;

    // Emit change events?
    if (change) {
      this.emit('change', this);
      this.resources.application.emit('change', this);
    }
    return change;
  }
}

// Exports

exports.Resource = Resource;
