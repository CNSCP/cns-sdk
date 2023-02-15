// allication.js - Application class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const events = require('events');

// Application class

class Application extends events.EventEmitter {

  // Errors

  static E_TRANSPORT = 'E_TRANSPORT';
  static E_OPEN = 'E_OPEN';
  static E_SUBSCRIBE = 'E_SUBSCRIBE';
  static E_PUBLISH = 'E_PUBLISH';
  static E_UNSIBSCRIBE = 'E_UNSUBSCRIBE';
  static E_CLOSE = 'E_CLOSE';

  // Properties

  transport;
  resources = new Resources(this);

  // Constructor

  // Create new application
  constructor(options) {
    // Call base
    super();

    // Copy options
    options = options || {};

    if (options.transport) this.transport = options.transport;
    if (options.resources) this.add(options.resources);

    // Using transport class?
    if (typeof this.transport === 'function') {
      // Yes, create transport
      this.transport = new this.transport({
        application: this
      })
    }

    // No transport defined?
    if (!this.transport) return;

    // Bind handlers
    this.transport.on('open', () => {
      for (var resource of this.resources)
        this.subscribe(resource.identifier);
    })
    .on('close', () => {
      for (var resource of this.resources)
        resource.status = Resource.UNSUBSCRIBED;
    });
  }

  // Methods

  // Add resources
  add(resources) {
    // Resource array?
    if (Array.isArray(resources)) {
      // Allocate each resource
      for (var identifier of resources)
        this.resources.add(identifier);
    } else this.resources.add(resources);

    return this;
  }

  // Open transport
  open(options) {
    try {
      this.transport.open(options);
      this.emit('open');
    } catch(error) {
      this.error(Application.E_OPEN, error);
    }
    return this;
  }

  // Subscribe resource
  subscribe(identifier) {
    try {
      const resource = this.resources.add(identifier);
      this.transport.subscribe(resource);
    } catch(error) {
      this.error(Application.E_SUBSCRIBE, error);
    }
    return this;
  }

  // Publish resource
  publish(identifier) {
    try {
      const resource = this.resources.add(identifier);
      this.transport.publish(resource);
    } catch(error) {
      this.error(Application.E_PUBLISH, error);
    }
  }

  // Unsubscribe resource
  unsubscribe(identifier) {
    try {
      const resource = this.resources.remove(identifier);
      this.transport.unsubscribe(resource);
    } catch(error) {
      this.error(Application.E_UNSUBSCRIBE, error);
    }
    return this;
  }

  // Close transport
  close() {
    try {
      this.emit('close');
      this.transport.close();
    } catch(error) {
      this.error(Application.E_CLOSE, error);
    }
    return this;
  }

  // Emit application error
  error(code, error) {
    const message = error?(': ' + error.message):'';
    this.emit('error', new Error(code + message));
  }
}

// Exports

exports.Application = Application;
