// transport.js - Transport class
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const events = require('events');

// Classes

const Application = require('./application.js').Application;
const Resource = require('./resource.js').Resource;

// Transport class

class Transport extends events.EventEmitter {

  // Status

  static CLOSED = 0;
  static OPEN = 1;

  // Actions

  static SUBSCRIBE = 'subscribe';
  static MESSAGE = 'message';
  static PUBLISH = 'publish';
  static UNSUBSCIBE = 'unsubscibe';

  // Properties

  application;
  status;

  // Constructor

  // Create new transport
  constructor(options) {
    // Call base
    super();

    // Copy options
    this.application = options.application;
    this.status = Transport.CLOSED;
  }

  // Methods

  // Transport open
  open() {
    this.status = Transport.OPEN;
    this.emit('open');
  }

  // Transport subscribe
  subscribe(resource) {
    // Transport closed?
    if (this.status !== Transport.OPEN) return;

    // Already subscribed?
    if (resource.status === Resource.SUBSCRIBED) return;
    resource.status = Resource.SUBSCRIBED;

    // Transmit action
    this.send({
      action: Transport.SUBSCRIBE,
      identifier: resource.identifier
    });
  }

  // Transport publish
  publish(resource) {
    // Transport closed?
    if (this.status !== Transport.OPEN) return;

    // Collate changes
//    const changes = {};
//    if (!resource.changes(data)) return;

    // Transmit action
    this.send({
      action: Transport.PUBLISH,
      identifier: resource.identifier,
//      data: data
      properties: resource.properties,
      connections: resource.connections
    });
  }

  // Transport unsubscribe
  unsubscribe(resource) {
    // Transport closed?
    if (this.status !== Transport.OPEN) return;

    // Already unsubscribed?
    if (resource.status === Resource.UNSUBSCRIBED) return;
    resource.status = Resource.UNSUBSCRIBED;

    // Transmit action
    this.send({
      action: Transport.UNSUBSCRIBE,
      identifier: resource.identifier
    });
  }

  // Message handler
  message(packet) {
    // Message action?
    if (!packet || packet.action !== Transport.MESSAGE) return;

    // Update resource
    const resource = this.application.resources.find(packet.identifier);
    if (resource !== null) resource.message(packet);
  }

  // Stringify helper
  stringify(packet) {
    try {
      return JSON.stringify(packet);
    } catch(error) {
      this.error(error);
    }
  }

  // Parse helper
  parse(packet) {
    try {
      return JSON.parse(packet);
    } catch(error) {
      this.error(error);
    }
  }

  // Transport close
  close() {
    this.status = Transport.CLOSED;
    this.emit('close');
  }

  // Emit application error
  error(error) {
    this.application.error(Application.E_TRANSPORT, error);
  }
}

// Exports

exports.Transport = Transport;
