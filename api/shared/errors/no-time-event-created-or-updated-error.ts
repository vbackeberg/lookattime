export default class NoTimeEventCreatedOrUpdatedError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
