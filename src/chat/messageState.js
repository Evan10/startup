export default class messageState {
  static Sending = new messageState('sending');
  static Delivered = new messageState('delivered');
  static Seen = new messageState('seen');
  static Error = new messageState('error');

  constructor(name) {
    this.name = name;
  }
}